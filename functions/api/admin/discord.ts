import type { Env } from '../../lib/env'
import { requireSession } from '../../lib/requireSession'
import { getDiscordInviteUrl, upsertDiscordInviteUrl } from '../../lib/d1-community'
import { json } from '../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const url = await getDiscordInviteUrl(context.env.DB)
  return json({ url })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const body = (await context.request.json()) as { url?: unknown }
  const url = typeof body.url === 'string' ? body.url.trim() : ''
  if (!/^https:\/\/(www\.)?discord\.(com|gg)\//.test(url)) {
    return json({ error: 'invalid_url' }, { status: 400 })
  }

  await upsertDiscordInviteUrl(context.env.DB, url)
  return json({ url })
}
