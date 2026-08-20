import type { Env } from '../lib/env'
import { getRecentPlaylistVideos } from '../lib/youtube'
import { json } from '../lib/http'
import { withEdgeCache } from '../lib/edgeCache'

// Playlist do Euro Truck Simulator 2 — ver src/data/games.ts. Só os 2
// vídeos mais recentes, exibidos como cards menores ao lado do destaque.
const ETS2_PLAYLIST_ID = 'PLj6h86FobQUkbejSJ6f1D0eob6leKJAur'

export const onRequestGet: PagesFunction<Env> = async (context) =>
  withEdgeCache(context.request, (promise) => context.waitUntil(promise), async () => {
    const videos = await getRecentPlaylistVideos(context.env, ETS2_PLAYLIST_ID, 2)
    return json({ videos }, { publicCacheSeconds: 300 })
  })
