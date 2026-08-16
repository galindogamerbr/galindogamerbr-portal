import { countRateLimitEvents, recordRateLimitEvent } from './d1'

type RateLimitRule = { scope: string; limit: number; windowMinutes: number }

// Contagem em D1 (não as regras nativas do Cloudflare, que não distinguem
// por e-mail no corpo da requisição, só IP/rota). Sempre registra o evento
// antes de checar, para que a própria tentativa que estoura o limite conte.
export async function checkRateLimit(db: D1Database, rule: RateLimitRule): Promise<boolean> {
  await recordRateLimitEvent(db, rule.scope)
  const count = await countRateLimitEvents(db, rule.scope, rule.windowMinutes)
  return count <= rule.limit
}
