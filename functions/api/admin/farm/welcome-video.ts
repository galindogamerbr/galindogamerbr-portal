import type { Env } from '../../../lib/env'
import { getFarmWelcomeVideoId, upsertFarmWelcomeVideoId } from '../../../lib/d1-farm'
import { json } from '../../../lib/http'
import { requireSession } from '../../../lib/requireSession'

const FALLBACK_VIDEO_ID = 'tfoJW_5GJ3A'
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function parseYouTubeVideoId(value: string): string | null {
  const trimmed = value.trim()
  if (VIDEO_ID_PATTERN.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const hostname = url.hostname.replace(/^www\./, '')
    let videoId: string | null = null

    if (hostname === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0] ?? null
    } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const [first, second] = url.pathname.split('/').filter(Boolean)
      videoId = url.searchParams.get('v') ?? ((first === 'embed' || first === 'shorts') ? second : null)
    }

    return videoId && VIDEO_ID_PATTERN.test(videoId) ? videoId : null
  } catch {
    return null
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const videoId = (await getFarmWelcomeVideoId(context.env.DB)) ?? FALLBACK_VIDEO_ID
  return json({ videoId })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  let body: { video?: unknown }
  try {
    body = (await context.request.json()) as { video?: unknown }
  } catch {
    return json({ error: 'invalid_body' }, { status: 400 })
  }

  const videoId = typeof body.video === 'string' ? parseYouTubeVideoId(body.video) : null
  if (!videoId) return json({ error: 'invalid_video' }, { status: 400 })

  await upsertFarmWelcomeVideoId(context.env.DB, videoId)
  return json({ videoId })
}
