import type { Env } from '../lib/env'
import { fetchViewerCount, resolveChannelLiveState } from '../lib/youtube'
import { json } from '../lib/http'
import { getLiveViewerCache, upsertLiveViewerCache } from '../lib/d1-community'

// Quantos minutos um viewer count cacheado ainda vale — não é limite de cota
// (o scraping da página do vídeo não tem uma), é só pra não repetir o
// request pra cada visitante que estiver com o polling de /api/live aberto
// ao mesmo tempo.
const VIEWER_COUNT_CACHE_MINUTES = 3

async function resolveViewerCount(env: Env, videoId: string): Promise<number | null> {
  const cached = await getLiveViewerCache(env.DB)
  if (cached && cached.video_id === videoId) {
    const ageMinutes = (Date.now() - new Date(`${cached.fetched_at}Z`).getTime()) / 60_000
    if (ageMinutes < VIEWER_COUNT_CACHE_MINUTES) return cached.viewer_count
  }

  const fresh = await fetchViewerCount(videoId)
  if (fresh !== null) {
    await upsertLiveViewerCache(env.DB, { videoId, viewerCount: fresh })
    return fresh
  }
  return cached?.video_id === videoId ? cached.viewer_count : null
}

// Checa direto no YouTube a cada request — sem cache em D1 pro status em si.
// O check é keyless e barato (ver functions/lib/youtube.ts), então não
// precisa de webhook/cron pra manter um estado "morno" por fora. O viewer
// count (quando ao vivo) tem seu próprio cache curto, ver resolveViewerCount.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const state = await resolveChannelLiveState(context.env)
  if (!state) {
    return json({ isLive: false, videoId: null, title: null, thumbnailUrl: null, viewerCount: null })
  }

  const viewerCount = state.isLive ? await resolveViewerCount(context.env, state.videoId) : null

  return json({
    isLive: state.isLive,
    videoId: state.videoId,
    title: state.title,
    thumbnailUrl: state.thumbnailUrl,
    viewerCount,
  })
}
