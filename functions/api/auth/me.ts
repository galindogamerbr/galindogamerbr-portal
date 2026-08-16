import type { Env } from '../../lib/env'
import { requireSession } from '../../lib/requireSession'
import { json } from '../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })
  return json({ email })
}
