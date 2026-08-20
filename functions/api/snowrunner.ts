import type { Env } from '../lib/env'
import { getRecentPlaylistVideos } from '../lib/youtube'
import { json } from '../lib/http'
import { withEdgeCache } from '../lib/edgeCache'

// Playlist do SnowRunner — ver src/data/games.ts. Só os 2 vídeos mais
// recentes, exibidos como cards menores ao lado do destaque.
const SNOWRUNNER_PLAYLIST_ID = 'PLDv3gOgRACDY'

export const onRequestGet: PagesFunction<Env> = async (context) =>
  withEdgeCache(context.request, (promise) => context.waitUntil(promise), async () => {
    const videos = await getRecentPlaylistVideos(context.env, SNOWRUNNER_PLAYLIST_ID, 2)
    return json({ videos }, { publicCacheSeconds: 300 })
  })
