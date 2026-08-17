import type { Env } from './env'
import { extractVideoIds } from './atom'

export type VideoState = {
  videoId: string
  title: string
  thumbnailUrl: string
  isLive: boolean
  startedAt: string | null
}

type OEmbedResponse = { title: string }

// Sem API key: usa o mesmo truque que ferramentas como yt-dlp usam — a
// URL /channel/{id}/live só redireciona pra /watch?v=ID quando o canal
// está ao vivo agora. Ausência de "v=" no destino final = não está ao vivo.
// User-Agent de navegador de verdade + cache desligado: sem isso o YouTube
// pode servir uma página de consentimento em vez do redirect, e o Cloudflare
// pode cachear esse redirect (ficando preso no estado de antes da live).
async function getLiveVideoId(channelId: string): Promise<string | null> {
  const res = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
    redirect: 'follow',
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  // eslint-disable-next-line no-console
  console.log('[live-debug]', res.status, res.redirected, res.url)
  const match = res.url.match(/[?&]v=([^&]+)/)
  return match ? match[1] : null
}

// Sem API key: um Short de verdade é servido direto em /shorts/{id} (200);
// um vídeo normal, ao pedir essa mesma URL, redireciona pra /watch (3xx).
async function isShort(videoId: string): Promise<boolean> {
  const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, { redirect: 'manual' })
  return res.status === 200
}

// Sem API key: feed Atom público do canal, do mais novo pro mais antigo —
// pula Shorts e devolve o primeiro vídeo "de verdade" (live ou normal).
export async function getLatestUploadedVideoId(env: Env): Promise<string | null> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${env.YOUTUBE_CHANNEL_ID}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha ao buscar feed do canal: ${res.status}`)

  const videoIds = extractVideoIds(await res.text())
  for (const videoId of videoIds) {
    if (!(await isShort(videoId))) return videoId
  }
  return null
}

// Sem API key: oEmbed público só devolve título — thumbnail vem direto da
// URL previsível do i.ytimg.com (mesmo padrão do update-live.yml antigo).
async function fetchTitle(videoId: string): Promise<string | null> {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as OEmbedResponse
  return data.title
}

// Resolve o estado atual do canal (ao vivo agora, ou o último vídeo
// publicado se não houver live) — chamado direto a cada request de
// /api/live, sempre fresco. Não depende de YOUTUBE_API_KEY nem de D1.
export async function resolveChannelLiveState(env: Env): Promise<VideoState | null> {
  const liveVideoId = await getLiveVideoId(env.YOUTUBE_CHANNEL_ID)
  const videoId = liveVideoId ?? (await getLatestUploadedVideoId(env))
  if (!videoId) return null

  const title = await fetchTitle(videoId)
  if (!title) return null

  return {
    videoId,
    title,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    isLive: liveVideoId !== null,
    startedAt: null,
  }
}

export type PlaylistVideo = { videoId: string; title: string; thumbnailUrl: string }

// Sem API key: feed Atom público da playlist, do mais novo pro mais antigo —
// resolve título dos primeiros `count` de uma vez (em paralelo).
export async function getRecentPlaylistVideos(playlistId: string, count: number): Promise<PlaylistVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
  const res = await fetch(url)
  if (!res.ok) return []

  const videoIds = extractVideoIds(await res.text()).slice(0, count)
  const videos = await Promise.all(
    videoIds.map(async (videoId): Promise<PlaylistVideo | null> => {
      const title = await fetchTitle(videoId)
      if (!title) return null
      return { videoId, title, thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` }
    }),
  )
  return videos.filter((v): v is PlaylistVideo => v !== null)
}
