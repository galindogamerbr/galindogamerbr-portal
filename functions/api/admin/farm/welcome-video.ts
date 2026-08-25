import type { Env } from '../../../lib/env'
import { getFarmVideoIds, upsertFarmVideoIds } from '../../../lib/d1-farm'
import { json } from '../../../lib/http'
import { requireSession } from '../../../lib/requireSession'

const FALLBACK_VIDEOS = { welcomeVideoId: 'tfoJW_5GJ3A', rulesVideoId: 'TcBrAo_A1Lc' }
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

  const videos = (await getFarmVideoIds(context.env.DB)) ?? FALLBACK_VIDEOS
  return json(videos)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  let body: { welcomeVideo?: unknown; rulesVideo?: unknown }
  try {
    body = (await context.request.json()) as { welcomeVideo?: unknown; rulesVideo?: unknown }
  } catch {
    return json({ error: 'invalid_body' }, { status: 400 })
  }

  const welcomeVideoId = typeof body.welcomeVideo === 'string' ? parseYouTubeVideoId(body.welcomeVideo) : null
  const rulesVideoId = typeof body.rulesVideo === 'string' ? parseYouTubeVideoId(body.rulesVideo) : null
  if (!welcomeVideoId || !rulesVideoId) return json({ error: 'invalid_video' }, { status: 400 })

  const videos = { welcomeVideoId, rulesVideoId }
  await upsertFarmVideoIds(context.env.DB, videos)
  return json(videos)
}
