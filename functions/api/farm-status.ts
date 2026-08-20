import type { Env } from '../lib/env'
import { fetchFarmStatus } from '../lib/farmStatus'
import { json } from '../lib/http'
import { withEdgeCache } from '../lib/edgeCache'

// Status do servidor dedicado da Fazenda Nova Aliança, ver
// functions/lib/farmStatus.ts. Cache curto (mesma ideia do /api/live) —
// dado muda a qualquer minuto, mas não faz sentido bater no Azure Function
// a cada request de cada visitante da página.
export const onRequestGet: PagesFunction<Env> = async (context) =>
  withEdgeCache(context.request, (promise) => context.waitUntil(promise), async () => {
    const status = await fetchFarmStatus(context.env)
    if (!status) {
      // ok:false = falha ao consultar o Azure Function (timeout, 401, etc.)
      // — diferente de status.gameStatus, que é o online/offline de verdade
      // do servidor. O card (FarmStatusCard) some inteiro quando ok:false,
      // em vez de mostrar um estado quebrado/vazio.
      return json({ ok: false, status: null }, { publicCacheSeconds: 30 })
    }
    return json({ ok: true, status }, { publicCacheSeconds: 30 })
  })
