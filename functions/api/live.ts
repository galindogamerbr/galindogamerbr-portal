import type { Env } from '../lib/env'
import { fetchViewerCount, resolveChannelLiveState } from '../lib/youtube'
import { json } from '../lib/http'
import { withEdgeCache } from '../lib/edgeCache'

// Quantos minutos um viewer count cacheado ainda vale — não é limite de cota
// (o scraping da página do vídeo não tem uma), é só pra não repetir o
// request pra cada visitante que estiver com o polling de /api/live aberto
// ao mesmo tempo. Guardado no PUBLIC_CACHE (KV) com um TTL de segurança bem
// maior que isso (ver VIEWER_COUNT_KV_SAFETY_TTL_SECONDS) só pra sobreviver
// como fallback caso o fetch falhe — quem decide "fresco o suficiente" é a
// checagem manual de idade abaixo, não a expiração do KV.
const VIEWER_COUNT_CACHE_MINUTES = 3
const VIEWER_COUNT_KV_KEY = 'youtube:viewer-count'
const VIEWER_COUNT_KV_SAFETY_TTL_SECONDS = 60 * 60 * 24

type ViewerCountCacheEntry = { videoId: string; viewerCount: number; fetchedAt: string }

async function resolveViewerCount(env: Env, videoId: string): Promise<number | null> {
  const cached = await env.PUBLIC_CACHE.get<ViewerCountCacheEntry>(VIEWER_COUNT_KV_KEY, 'json')
  if (cached && cached.videoId === videoId) {
    const ageMinutes = (Date.now() - new Date(cached.fetchedAt).getTime()) / 60_000
    if (ageMinutes < VIEWER_COUNT_CACHE_MINUTES) return cached.viewerCount
  }

  const fresh = await fetchViewerCount(env, videoId)
  if (fresh !== null) {
    const entry: ViewerCountCacheEntry = { videoId, viewerCount: fresh, fetchedAt: new Date().toISOString() }
    await env.PUBLIC_CACHE.put(VIEWER_COUNT_KV_KEY, JSON.stringify(entry), { expirationTtl: VIEWER_COUNT_KV_SAFETY_TTL_SECONDS })
    return fresh
  }
  return cached?.videoId === videoId ? cached.viewerCount : null
}

// isLive/videoId/title/thumbnailUrl vêm de resolveChannelLiveState, que já é
// cache-first no KV (ver functions/lib/youtube.ts) — não precisa de mais
// nenhum cache aqui pra isso. O viewer count (quando ao vivo) tem seu
// próprio cache curto, ver resolveViewerCount.
export const onRequestGet: PagesFunction<Env> = async (context) =>
  withEdgeCache(context.request, context.waitUntil, async () => {
    const state = await resolveChannelLiveState(context.env)
    if (!state) {
      return json({ isLive: false, videoId: null, title: null, thumbnailUrl: null, viewerCount: null }, { publicCacheSeconds: 30 })
    }

    const viewerCount = state.isLive ? await resolveViewerCount(context.env, state.videoId) : null

    return json(
      {
        isLive: state.isLive,
        videoId: state.videoId,
        title: state.title,
        thumbnailUrl: state.thumbnailUrl,
        viewerCount,
      },
      { publicCacheSeconds: 30 },
    )
  })
