import type { Env } from '../lib/env'
import { resolveChannelLiveState } from '../lib/youtube'
import { json } from '../lib/http'

// Checa direto no YouTube a cada request — sem cache em D1. O check é
// keyless e barato (ver functions/lib/youtube.ts), então não precisa de
// webhook/cron pra manter um estado "morno" por fora.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const state = await resolveChannelLiveState(context.env)
  if (!state) {
    return json({ isLive: false, videoId: null, title: null, thumbnailUrl: null })
  }

  return json({
    isLive: state.isLive,
    videoId: state.videoId,
    title: state.title,
    thumbnailUrl: state.thumbnailUrl,
  })
}
