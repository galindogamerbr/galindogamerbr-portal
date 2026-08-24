import type { Env } from './env'
import { BROWSER_USER_AGENT } from './socialConstants'
import { fetchWithTimeout } from './http'
import { logWarn, logError } from './log'
import { putIfChanged } from './kv'

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
// Caminho principal por ser de graça (sem cota de API) — mas o fetch pra
// lá, rodando dentro do Workers, às vezes recebe um HTML diferente do que
// um navegador comum vê (IP de datacenter provavelmente tratado diferente
// por algum bot-detection do lado do YouTube). Por isso deixa o erro subir
// em vez de engolir aqui: resolveChannelLiveState pega essa falha e cai
// pro endpoint oficial (findLiveVideoIdViaApi) só nesse caso raro — não dá
// pra usar a API oficial sempre porque search.list custa 100 unidades de
// cota (10k/dia é o padrão), e com esse endpoint sendo checado a cada 60s
// isso estouraria a cota rapidinho.
async function getLiveVideoId(channelId: string): Promise<string | null> {
  const res = await fetchWithTimeout(`https://www.youtube.com/channel/${channelId}/live`, {
    redirect: 'follow',
    headers: { 'user-agent': BROWSER_USER_AGENT },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  const body = await res.text()
  const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)
  const videoId = canonical?.[1].match(/[?&]v=([^&"]+)/)
  return videoId ? videoId[1] : null
}

// Fallback oficial (search.list, eventType=live) — só chamado quando o
// scrape acima falha/trava. Custa 100 unidades de cota por chamada, mas
// como só roda no caminho de erro (raro), não é um problema na prática.
async function findLiveVideoIdViaApi(env: Env): Promise<string | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${env.YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${env.YOUTUBE_API_KEY}`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const data = (await res.json()) as { items?: [{ id?: { videoId?: string } }] }
    return data.items?.[0]?.id?.videoId ?? null
  } catch {
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

// A ordem da playlist "uploads" (publishedAt) não é confiável pra lives
// salvas como vídeo: o VOD "publica" na playlist só depois de processado, e
// esse atraso varia por vídeo — já visto na prática uma live do meio-dia
// (actualEndTime 14:23) aparecer DEPOIS de uma live da noite do mesmo dia
// (actualEndTime 23:03) na ordem de publishedAt, mesmo a segunda tendo ido
// ao ar bem mais tarde. actualEndTime (quando existe) é a única fonte
// confiável de "quando isso realmente foi transmitido"; cai pro publishedAt
// só pra upload comum (sem liveStreamingDetails, nunca foi live).
async function rankByActualRecency(env: Env, videos: PlaylistVideo[]): Promise<PlaylistVideo[]> {
  if (videos.length === 0) return videos
  try {
    const ids = videos.map((v) => v.videoId).join(',')
    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${ids}&key=${env.YOUTUBE_API_KEY}`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return videos

    const data = (await res.json()) as {
      items?: Array<{ id?: string; snippet?: { publishedAt?: string }; liveStreamingDetails?: { actualEndTime?: string } }>
    }
    const effectiveTime = new Map<string, string>()
    for (const item of data.items ?? []) {
      const time = item.liveStreamingDetails?.actualEndTime ?? item.snippet?.publishedAt
      if (item.id && time) effectiveTime.set(item.id, time)
    }

    return [...videos].sort((a, b) => (effectiveTime.get(b.videoId) ?? '').localeCompare(effectiveTime.get(a.videoId) ?? ''))
  } catch (err) {
    logError('youtube', 'rankByActualRecency falhou, mantendo ordem da playlist', { err })
    return videos
  }
}

// Data API v3 (playlistItems.list, 1 unidade de cota) — o feed Atom público
// do canal (`/feeds/videos.xml?channel_id=`) que essa função usava foi
// descontinuado pelo YouTube (confirmado: passou a devolver 404, mesmo
// destino do feed por playlist_id, ver getRecentPlaylistVideos). A
// playlist "uploads" de qualquer canal é implícita — troca só o prefixo
// "UC" por "UU" no ID do canal.
export async function getLatestUploadedVideoId(env: Env): Promise<string | null> {
  const uploadsPlaylistId = `UU${env.YOUTUBE_CHANNEL_ID.slice(2)}`
  const videos = await getRecentPlaylistVideos(env, uploadsPlaylistId, 10)
  const shortFlags = await Promise.all(videos.map((v) => isShort(v.videoId)))
  const nonShorts = videos.filter((_, i) => !shortFlags[i])
  if (nonShorts.length === 0) return null

  const ranked = await rankByActualRecency(env, nonShorts)
  return ranked[0]?.videoId ?? null
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

type LiveStreamingState = { isLive: boolean; viewerCount: number | null; resolved: boolean }

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
    if (!res.ok) return { isLive: false, viewerCount: null, resolved: false }

    const data = (await res.json()) as {
      items?: [{ liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string; concurrentViewers?: string } }]
    }
    const details = data.items?.[0]?.liveStreamingDetails
    if (!details?.actualStartTime || details.actualEndTime) return { isLive: false, viewerCount: null, resolved: true }

    return { isLive: true, viewerCount: details.concurrentViewers ? Number(details.concurrentViewers) : null, resolved: true }
  } catch {
    return { isLive: false, viewerCount: null, resolved: false }
  }
}

// Monta o VideoState de um vídeo específico — título e status de live não
// dependem um do outro, roda os dois ao mesmo tempo em vez de esperar um
// pra só depois começar o outro. Usado tanto pelo polling
// (resolveChannelLiveState) quanto pelo webhook do WebSub
// (updateLiveStateFromWebhook) — mesma lógica, dois gatilhos diferentes.
async function buildVideoState(env: Env, videoId: string): Promise<VideoState | null> {
  const [title, { isLive, viewerCount }] = await Promise.all([fetchTitle(videoId), fetchLiveStreamingDetails(env, videoId)])
  if (!title) return null

  return {
    videoId,
    title,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    isLive,
    startedAt: null,
    viewerCount,
  }
}

// Resolve o estado atual do canal (ao vivo agora, ou o último vídeo
// publicado se não houver live) — cache-first pra decidir QUAL vídeo (isso
// sim só muda via webhook do WebSub, updateLiveStateFromWebhook, ou no
// cache-miss abaixo: primeiro deploy, ou o KV perdeu o dado). viewerCount é
// diferente: muda a cada poucos segundos enquanto a live rola, e o webhook
// só dispara em mudança de metadado/estado (começou/terminou), não a cada
// espectador entrando — sem refetch aqui, concurrentViewers ficava
// congelado no valor (às vezes nem populado ainda, ver fetchLiveStreamingDetails)
// do momento em que a live começou. Por isso, com o vídeo cacheado ao vivo,
// sempre rebusca só o liveStreamingDetails (1 unidade de cota) pra manter o
// contador atualizado — mesmo espírito de resolveTwitchLive/resolveKickLive
// em community-stats.ts: busca fresco, putIfChanged só escreve no KV se
// mudou de verdade (evita reestourar a cota de write, ver af8b05a).
export async function resolveChannelLiveState(env: Env): Promise<VideoState | null> {
  const cached = await env.PUBLIC_CACHE.get<VideoState>(LIVE_STATE_CACHE_KEY, 'json')
  if (cached && !cached.isLive) return cached

  if (cached) {
    const { isLive, viewerCount, resolved } = await fetchLiveStreamingDetails(env, cached.videoId)
    if (!resolved) return cached
    if (isLive) {
      const state = { ...cached, viewerCount }
      await putIfChanged(env.PUBLIC_CACHE, LIVE_STATE_CACHE_KEY, state)
      return state
    }
    // Live terminou entre um poll e outro sem o webhook avisar a tempo —
    // recalcula pro último upload, mesma lógica do LIVE_ENDED no webhook.
    const fallbackId = await getLatestUploadedVideoId(env)
    const fallbackState = fallbackId ? await buildVideoState(env, fallbackId) : null
    if (!fallbackState) return cached
    await putIfChanged(env.PUBLIC_CACHE, LIVE_STATE_CACHE_KEY, fallbackState)
    return fallbackState
  }

  let liveVideoId: string | null
  try {
    liveVideoId = await getLiveVideoId(env.YOUTUBE_CHANNEL_ID)
  } catch (err) {
    logError('youtube', 'Scrape de /live falhou, caindo pro endpoint oficial', { err })
    liveVideoId = await findLiveVideoIdViaApi(env)
  }

  const candidateVideoId = liveVideoId ?? (await getLatestUploadedVideoId(env))
  if (!candidateVideoId) return null

  const state = await buildVideoState(env, candidateVideoId)
  if (!state) return null

  await putIfChanged(env.PUBLIC_CACHE, LIVE_STATE_CACHE_KEY, state)
  return state
}

// Notificação do WebSub (ver functions/api/webhooks/youtube.ts) — o hub
// avisa que um vídeo específico mudou, mas não diz o quê (pode ser a live
// começando, terminando, ou só uma edição de metadado num vídeo antigo
// qualquer, sem relação com o estado atual). Por isso decide o que fazer
// com base no isLive de verdade (Data API), não no fato de ter chegado
// notificação:
// - vídeo notificado está ao vivo agora → é a live atual, sempre atualiza.
// - não está ao vivo, mas É o vídeo que tínhamos cacheado como atual →
//   provavelmente acabou de terminar, recalcula (cai pro último upload).
// - não está ao vivo e não é o vídeo cacheado → edição irrelevante em outro
//   vídeo, ignora (não sobrescreve o cache com algo desatualizado).
export async function updateLiveStateFromWebhook(env: Env, notifiedVideoId: string): Promise<void> {
  const { isLive } = await fetchLiveStreamingDetails(env, notifiedVideoId)

  let targetVideoId = notifiedVideoId
  if (!isLive) {
    const cached = await env.PUBLIC_CACHE.get<VideoState>(LIVE_STATE_CACHE_KEY, 'json')
    if (cached?.videoId !== notifiedVideoId) return
    // actualEndTime apareceu pro vídeo que tínhamos como live atual — a
    // live acabou. Loga o evento (LIVE_ENDED) pra dar visibilidade no Log
    // Explorer de quando cada transmissão termina, sem precisar inferir
    // isso a partir do TTL do polling (que nem chega a rodar na prática
    // com o webhook ativo).
    logWarn('youtube-webhook', 'LIVE_ENDED', { videoId: notifiedVideoId })
    targetVideoId = (await getLatestUploadedVideoId(env)) ?? notifiedVideoId
  } else {
    logWarn('youtube-webhook', 'LIVE_STARTED', { videoId: notifiedVideoId })
  }

  const state = await buildVideoState(env, targetVideoId)
  if (!state) return

  await putIfChanged(env.PUBLIC_CACHE, LIVE_STATE_CACHE_KEY, state)
}

const PUBSUB_LEASE_CACHE_KEY = 'youtube:pubsub-lease'

// Grava o lease_seconds de verdade que o hub concedeu na verificação (GET
// de functions/api/webhooks/youtube.ts) — o Google costuma ignorar o valor
// pedido no POST /subscribe (workers/social-stats-cron/src/youtubePubsub.ts)
// e conceder o dele próprio (~5 dias), então só dá pra saber quando renovar
// lendo esse header na hora da confirmação, não assumindo o valor pedido.
export async function recordPubsubLease(env: Env, leaseSeconds: number): Promise<void> {
  const expiresAt = Date.now() + leaseSeconds * 1000
  await env.PUBLIC_CACHE.put(PUBSUB_LEASE_CACHE_KEY, JSON.stringify({ expiresAt }))
}

export type PlaylistVideo = { videoId: string; title: string; thumbnailUrl: string }

// Data API v3 (playlistItems.list, 1 unidade de cota por chamada) — o feed
// Atom público (`/feeds/videos.xml?playlist_id=`) que essa função usava
// antes foi descontinuado pelo YouTube (passou a devolver 404 pra qualquer
// playlist, não só as nossas); esse endpoint oficial é o substituto. Custo
// de cota baixo o bastante pra não precisar de cache-first no KV (os
// endpoints públicos que chamam essa função já ficam atrás de
// withEdgeCache, ver functions/api/flagship.ts e afins).
export async function getRecentPlaylistVideos(env: Env, playlistId: string, count: number): Promise<PlaylistVideo[]> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${count}&key=${env.YOUTUBE_API_KEY}`
    const res = await fetchWithTimeout(url)
    if (!res.ok) {
      logWarn('youtube', 'playlistItems.list retornou erro', { status: res.status, playlistId })
      return []
    }

    const data = (await res.json()) as { items?: Array<{ snippet?: { title?: string; resourceId?: { videoId?: string } } }> }
    return (data.items ?? [])
      .map((item): PlaylistVideo | null => {
        const videoId = item.snippet?.resourceId?.videoId
        const title = item.snippet?.title
        if (!videoId || !title) return null
        return { videoId, title, thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` }
      })
      .filter((v): v is PlaylistVideo => v !== null)
  } catch (err) {
    logError('youtube', 'getRecentPlaylistVideos falhou', { err, playlistId })
    return []
  }
}
