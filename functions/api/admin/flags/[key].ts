import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { json } from '../../../lib/http'
import { getFlag, setFlag } from '../../../lib/d1-flags'

// Allowlist proposital — evita ligar/desligar qualquer chave arbitrária via
// URL, só as que o front realmente usa.
const KNOWN_FLAGS = ['admin-instagram-visible'] as const

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const key = context.params.key
  if (typeof key !== 'string' || !KNOWN_FLAGS.includes(key as (typeof KNOWN_FLAGS)[number])) {
    return json({ error: 'unknown_flag' }, { status: 404 })
  }

  const enabled = await getFlag(context.env.DB, key)
  return json({ key, enabled })
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const key = context.params.key
  if (typeof key !== 'string' || !KNOWN_FLAGS.includes(key as (typeof KNOWN_FLAGS)[number])) {
    return json({ error: 'unknown_flag' }, { status: 404 })
  }

  const body = (await context.request.json()) as { enabled?: unknown }
  if (typeof body.enabled !== 'boolean') return json({ error: 'invalid_body' }, { status: 400 })

  await setFlag(context.env.DB, key, body.enabled)
  return json({ key, enabled: body.enabled })
}
