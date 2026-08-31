import type { Env } from '../lib/env'
import { getRecentPlaylistVideos } from '../lib/youtube'
import { json } from '../lib/http'
import { withEdgeCache } from '../lib/edgeCache'

const CONTRABAND_POLICE_PLAYLIST_ID = 'PLSLPCJiW7RZM'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cacheUrl = new URL(context.request.url)
  cacheUrl.search = ''
  const cacheKey = new Request(cacheUrl, context.request)

  return withEdgeCache(cacheKey, (promise) => context.waitUntil(promise), async () => {
    const videos = await getRecentPlaylistVideos(context.env, CONTRABAND_POLICE_PLAYLIST_ID, 2)
    return json({ videos }, { publicCacheSeconds: 300 })
  })
}
