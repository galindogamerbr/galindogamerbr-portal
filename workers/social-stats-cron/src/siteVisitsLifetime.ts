import type { Env } from './env'
import { getSiteVisitsLifetime, upsertSiteVisitsLifetime, upsertToAllDatabases } from './d1'
import { fetchVisitsInRange } from './cfAnalytics'
import { logWarn } from './log'

// Data aproximada do primeiro deploy do site (ver git log) — usada só como
// ponto de partida na primeira rodada (sem linha ainda em site_visits_lifetime).
// Consultar a Analytics API um pouco antes do início de verdade não é
// problema: só devolve 0 pros dias sem dado.
const SITE_LAUNCH_AT = '2026-08-16T00:00:00Z'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
// Bem abaixo do limite real da API (13 semanas e 2 dias) — margem de
// segurança, não precisa colar no limite exato.
const MAX_CHUNK_MS = 84 * 24 * 60 * 60 * 1000

// Mesma chave lida por functions/api/community-stats.ts (não importado de
// lá de propósito — worker roda num projeto/deploy separado). Sem
// expirationTtl: só o cron escreve aqui, uma vez por semana; o site público
// só lê e soma o intervalo desde `asOf` até agora por conta própria (ver
// functions/lib/cfAnalytics.ts, fetchVisitsSince) pro número não ficar
// parado 7 dias seguidos.
const LIFETIME_KV_KEY = 'site-visits:lifetime'

// Cloudflare Web Analytics não expõe um total corrido, e cada consulta da
// GraphQL Analytics API só cobre uma janela de tempo limitada — então esse
// total é somado por nós, aos poucos, e persistido em D1
// (site_visits_lifetime.total_visits, cursor de verdade) e replicado pro KV
// (leitura rápida do site público). Roda a cada execução do cron (a cada
// 20min, junto do resto de collectAll), mas só faz trabalho de verdade
// quando já se passou uma semana desde o último cursor — nas outras vezes é
// só uma leitura do D1. `force` pula essa checagem (bootstrap manual).
export async function updateSiteVisitsLifetime(env: Env, force = false): Promise<void> {
  const state = await getSiteVisitsLifetime(env.DB)
  const cursorStart = state?.last_counted_at ? new Date(state.last_counted_at) : new Date(SITE_LAUNCH_AT)
  const now = new Date()

  if (!force && now.getTime() - cursorStart.getTime() < WEEK_MS) return

  let total = state?.total_visits ?? 0
  let cursor = cursorStart
  let advanced = false

  while (cursor.getTime() < now.getTime()) {
    const chunkEnd = new Date(Math.min(cursor.getTime() + MAX_CHUNK_MS, now.getTime()))
    const visits = await fetchVisitsInRange(env, cursor.toISOString(), chunkEnd.toISOString())
    if (visits === null) {
      logWarn('siteVisitsLifetime', 'fetchVisitsInRange falhou, tenta de novo na próxima rodada', {
        since: cursor.toISOString(),
        until: chunkEnd.toISOString(),
      })
      break
    }

    total += visits
    cursor = chunkEnd
    advanced = true
    // Persiste a cada pedaço (não só no fim) — se um pedaço mais adiante
    // falhar, o progresso já somado não se perde. Escreve em produção e
    // preview igualzinho (mesmo motivo do resto do worker, ver upsertToAllDatabases).
    const totalVisits = total
    const lastCountedAt = cursor.toISOString()
    await upsertToAllDatabases(env, (db) => upsertSiteVisitsLifetime(db, { totalVisits, lastCountedAt }))
  }

  if (advanced) {
    await env.PUBLIC_CACHE.put(LIFETIME_KV_KEY, JSON.stringify({ total, asOf: cursor.toISOString() }))
  }
}
