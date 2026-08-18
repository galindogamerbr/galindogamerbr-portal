import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { json } from '../../../lib/http'
import { deleteInstagramToken } from '../../../lib/d1-instagram'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  await deleteInstagramToken(context.env.DB)
  return json({ ok: true })
}
