import type { Env } from './env'
import { extractVideoIds } from './atom'
import { BROWSER_USER_AGENT } from './socialConstants'

export type VideoState = {
  videoId: string
  title: string
  thumbnailUrl: string
  isLive: boolean
  startedAt: string | null
}

type OEmbedResponse = { title: string }

// Sem API key: busca a página /channel/{id}/live e olha o HTML — o YouTube
// não faz mais redirect HTTP de verdade pra essa URL (é servida como SPA).
// O <link rel="canonical"> da página aponta pro vídeo ao vivo quando o
// canal está transmitindo, e pro próprio canal (sem "v=") quando não está
// — mais confiável que o marcador "isLiveNow" embutido no JSON, que na
// prática se mostrou inconsistente (testado ao vivo, várias respostas).
// User-Agent de navegador de verdade + cache desligado: sem isso o YouTube
// pode servir algo diferente do que um navegador vê, e o Cloudflare pode
// cachear a resposta (ficando presa no estado de antes da live).
async function getLiveVideoId(channelId: string): Promise<string | null> {
  const res = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
    redirect: 'follow',
    headers: { 'user-agent': BROWSER_USER_AGENT },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  const body = await res.text()
  const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)
  const videoId = canonical?.[1].match(/[?&]v=([^&"]+)/)
  return videoId ? videoId[1] : null
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

// YouTube Data API v3 — número oficial de espectadores simultâneos
// (liveStreamingDetails.concurrentViewers), só existe enquanto o vídeo
// está ao vivo. Antes era via scraping da página /watch (frágil, dependia
// de um campo interno do YouTube que podia sumir a qualquer momento).
export async function fetchViewerCount(env: Env, videoId: string): Promise<number | null> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${env.YOUTUBE_API_KEY}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as { items?: [{ liveStreamingDetails?: { concurrentViewers?: string } }] }
  const raw = data.items?.[0]?.liveStreamingDetails?.concurrentViewers
  return raw ? Number(raw) : null
}

export type ChannelStats = { count: number | null; postCount: number | null }

// YouTube Data API v3 — inscritos e quantidade de vídeos numa chamada só.
// Chamado direto de functions/api/community-stats.ts (busca sempre fresco,
// cache em D1 só como fallback) — mesma chamada que o worker
// workers/social-stats-cron faz de hora em hora, sem custo extra de cota
// nem risco de renovação de token (essa API só precisa da API key, sem
// token de usuário pra rotacionar).
export async function fetchYoutubeStats(env: Env): Promise<ChannelStats> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${env.YOUTUBE_CHANNEL_ID}&key=${env.YOUTUBE_API_KEY}`
  const res = await fetch(url)
  if (!res.ok) return { count: null, postCount: null }

  const data = (await res.json()) as { items?: [{ statistics?: { subscriberCount?: string; videoCount?: string } }] }
  const stats = data.items?.[0]?.statistics
  return {
    count: stats?.subscriberCount ? Number(stats.subscriberCount) : null,
    postCount: stats?.videoCount ? Number(stats.videoCount) : null,
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
