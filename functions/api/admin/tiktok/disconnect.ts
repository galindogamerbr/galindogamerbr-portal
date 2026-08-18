import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { json } from '../../../lib/http'
import { deleteTiktokToken } from '../../../lib/d1-tiktok'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  await deleteTiktokToken(context.env.DB)
  return json({ ok: true })
}
