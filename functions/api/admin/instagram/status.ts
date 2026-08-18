import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { json } from '../../../lib/http'
import { getInstagramToken } from '../../../lib/d1-instagram'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const token = await getInstagramToken(context.env.DB)
  return json({
    connected: token !== null,
    username: token?.username ?? null,
    avatarUrl: token?.avatar_url ?? null,
    updatedAt: token?.updated_at ?? null,
    expiresAt: token?.expires_at ?? null,
  })
}
