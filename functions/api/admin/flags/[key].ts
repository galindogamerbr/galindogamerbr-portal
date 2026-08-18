import type { Env } from '../../../../lib/env'
import { requireSession } from '../../../../lib/requireSession'
import { json } from '../../../../lib/http'

// Allowlist proposital — evita expor qualquer flag arbitrária criada no
// Flagship via URL, só as que o front realmente consulta.
const KNOWN_FLAGS = {
  'admin-instagram-visible': false,
} as const

type FlagKey = keyof typeof KNOWN_FLAGS

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const key = context.params.key
  if (typeof key !== 'string' || !(key in KNOWN_FLAGS)) {
    return json({ error: 'unknown_flag' }, { status: 404 })
  }

  const enabled = await context.env.FLAGS.getBooleanValue(key, KNOWN_FLAGS[key as FlagKey])
  return json({ key, enabled })
}
