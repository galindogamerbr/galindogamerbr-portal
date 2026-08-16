import type { Env } from '../../../../../lib/env'
import { requireSession } from '../../../../../lib/requireSession'
import { publishVersion } from '../../../../../lib/d1-schedule'
import { json } from '../../../../../lib/http'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const versionId = Number(context.params.id)
  await publishVersion(context.env.DB, versionId)
  return json({ ok: true })
}
