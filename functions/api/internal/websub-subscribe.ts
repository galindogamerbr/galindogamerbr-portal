import type { Env } from '../../lib/env'
import { subscribe } from '../../lib/websub'
import { json } from '../../lib/http'

// Renova a inscrição WebSub (lease de ~5 dias) — chamado por um cron
// externo com folga (ex: a cada 3 dias), mesmo padrão do reconcile-live.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  if (request.headers.get('x-internal-secret') !== env.INTERNAL_API_SECRET) {
    return json({ error: 'unauthorized' }, { status: 401 })
  }

  await subscribe(env)
  return json({ ok: true })
}
