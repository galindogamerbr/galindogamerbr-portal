import type { Env } from '../lib/env'
import { getLiveState } from '../lib/d1-live'
import { json } from '../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const state = await getLiveState(context.env.DB)
  if (!state || !state.video_id) {
    return json({ isLive: false, videoId: null, title: null, thumbnailUrl: null, updatedAt: state?.updated_at ?? null })
  }

  return json({
    isLive: state.is_live === 1,
    videoId: state.video_id,
    title: state.title,
    thumbnailUrl: state.thumbnail_url,
    updatedAt: state.updated_at,
  })
}
