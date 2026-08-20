import type { Env } from './env'
import { extractVideoIds } from './atom'
import { BROWSER_USER_AGENT } from './socialConstants'
import { fetchWithTimeout } from './http'

export type VideoState = {
  videoId: string
  title: string
  thumbnailUrl: string
  isLive: boolean
  startedAt: string | null
  viewerCount: number | null
}

type OEmbedResponse = { title: string }

// Sem API key: busca a página /channel/{id}/live e olha o HTML — o YouTube
// não faz mais redirect HTTP de verdade pra essa URL (é servida como SPA).
// O <link rel="canonical"> da página aponta pro vídeo ao vivo quando o
// canal está transmitindo, e pro próprio canal (sem "v=") quando não está.
// Só usado como palpite de QUAL vídeo checar (ver resolveChannelLiveState)
// — quem decide se está ao vivo de verdade é a Data API
// (fetchLiveStreamingDetails), porque o fetch daqui pro YouTube, rodando
// dentro do Workers, às vezes recebe um HTML diferente do que um navegador
// comum vê (IP de datacenter provavelmente tratado diferente por algum
// bot-detection do lado do YouTube) e erra o isLiveNow/canonical mesmo com
// a live rolando de verdade.
async function getLiveVideoId(channelId: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/channel/${channelId}/live`, {
      redirect: 'follow',
      headers: { 'user-agent': BROWSER_USER_AGENT },
      cf: { cacheTtl: 0, cacheEverything: false },
    })
    const body = await res.text()
    const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)
    const videoId = canonical?.[1].match(/[?&]v=([^&"]+)/)
    return videoId ? videoId[1] : null
  } catch {
    // Timeout ou falha de rede — trata como "sem palpite", cai pro feed Atom.
    return null
  }
}

// Sem API key: um Short de verdade é servido direto em /shorts/{id} (200);
// um vídeo normal, ao pedir essa mesma URL, redireciona pra /watch (3xx).
async function isShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`https://www.youtube.com/shorts/${videoId}`, { redirect: 'manual' })
    return res.status === 200
  } catch {
    return false
  }
}

// Sem API key: feed Atom público do canal, do mais novo pro mais antigo —
// pula Shorts e devolve o primeiro vídeo "de verdade" (live ou normal).
export async function getLatestUploadedVideoId(env: Env): Promise<string | null> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${env.YOUTUBE_CHANNEL_ID}`
  const res = await fetchWithTimeout(url)
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
  try {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const data = (await res.json()) as OEmbedResponse
    return data.title
  } catch {
    return null
  }
}

const LIVE_STATE_CACHE_KEY = 'youtube:live-state'
// 60 é o mínimo que o Workers KV aceita pra expirationTtl (PUT falha com
// 400 abaixo disso) — não dá pra ir mais curto que isso.
const LIVE_STATE_CACHE_TTL_SECONDS = 60

type LiveStreamingState = { isLive: boolean; viewerCount: number | null }

// YouTube Data API v3 — liveStreamingDetails só aparece (e actualStartTime
// só vem preenchido sem actualEndTime) enquanto o vídeo está ao vivo de
// verdade. É quem decide isLive de fato: getLiveVideoId (scrape do HTML de
// /channel/{id}/live) só serve pra sugerir qual vídeo checar, porque o
// fetch pra lá, rodando dentro do Workers, às vezes recebe um HTML
// diferente do que um navegador comum vê (provável bot-detection por IP de
// datacenter) e erra o isLiveNow/canonical mesmo com a live rolando —
// a Data API não tem esse problema.
async function fetchLiveStreamingDetails(env: Env, videoId: string): Promise<LiveStreamingState> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${env.YOUTUBE_API_KEY}`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return { isLive: false, viewerCount: null }

    const data = (await res.json()) as {
      items?: [{ liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string; concurrentViewers?: string } }]
    }
    const details = data.items?.[0]?.liveStreamingDetails
    if (!details?.actualStartTime || details.actualEndTime) return { isLive: false, viewerCount: null }

    return { isLive: true, viewerCount: details.concurrentViewers ? Number(details.concurrentViewers) : null }
  } catch {
    return { isLive: false, viewerCount: null }
  }
}

// Resolve o estado atual do canal (ao vivo agora, ou o último vídeo
// publicado se não houver live) — cache-first no KV (PUBLIC_CACHE), TTL
// curto: cada miss custa até 4 fetches sequenciais pro YouTube (scrape +
// feed Atom + shorts-check + oEmbed + Data API), então vale a pena servir
// do cache pra qualquer visitante que caia dentro da janela do TTL.
export async function resolveChannelLiveState(env: Env): Promise<VideoState | null> {
  const cached = await env.PUBLIC_CACHE.get<VideoState>(LIVE_STATE_CACHE_KEY, 'json')
  if (cached) return cached

  const candidateVideoId = (await getLiveVideoId(env.YOUTUBE_CHANNEL_ID)) ?? (await getLatestUploadedVideoId(env))
  if (!candidateVideoId) return null

  const title = await fetchTitle(candidateVideoId)
  if (!title) return null

  const { isLive, viewerCount } = await fetchLiveStreamingDetails(env, candidateVideoId)

  const state: VideoState = {
    videoId: candidateVideoId,
    title,
    thumbnailUrl: `https://i.ytimg.com/vi/${candidateVideoId}/maxresdefault.jpg`,
    isLive,
    startedAt: null,
    viewerCount,
  }
  await env.PUBLIC_CACHE.put(LIVE_STATE_CACHE_KEY, JSON.stringify(state), { expirationTtl: LIVE_STATE_CACHE_TTL_SECONDS })
  return state
}

export type PlaylistVideo = { videoId: string; title: string; thumbnailUrl: string }

// Sem API key: feed Atom público da playlist, do mais novo pro mais antigo —
// resolve título dos primeiros `count` de uma vez (em paralelo).
export async function getRecentPlaylistVideos(playlistId: string, count: number): Promise<PlaylistVideo[]> {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
    const res = await fetchWithTimeout(url)
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
  } catch {
    return []
  }
}
