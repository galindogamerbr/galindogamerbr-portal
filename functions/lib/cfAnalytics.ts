import type { Env } from './env'
import { fetchWithTimeout } from './http'
import { logError } from './log'

// "Visitas do site" via Cloudflare Web Analytics (RUM) real — dataset
// rumPageloadEventsAdaptiveGroups, que é account-scoped (não zone-scoped:
// fica embaixo de viewer.accounts, não viewer.zones — testado direto contra
// a API real, já que essa API bloqueia introspecção). sum.visits confirmado
// batendo exatamente com o número "Visits" mostrado no dashboard de Web
// Analytics da Cloudflare para a mesma janela de tempo. Requer só a
// permissão "Account Analytics" → Read no token (CLOUDFLARE_ANALYTICS_API_TOKEN/
// CLOUDFLARE_ACCOUNT_ID, ver functions/lib/env.ts) — não precisa de siteTag
// nem de escopo de zona. Cada consulta cobre no máximo ~13 semanas e 2 dias
// (limite real da GraphQL Analytics API, confirmado via erro de quota) —
// quem chama fetchVisitsRange precisa garantir que o intervalo cabe nisso.
const BRT_OFFSET_HOURS = 3 // UTC-3 fixo, sem horário de verão desde 2019

async function fetchVisitsRange(env: Env, sinceISO: string, untilISO: string): Promise<number | null> {
  const query = `
    query {
      viewer {
        accounts(filter: { accountTag: "${env.CLOUDFLARE_ACCOUNT_ID}" }) {
          rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { datetime_geq: "${sinceISO}", datetime_lt: "${untilISO}" }
          ) {
            sum { visits }
          }
        }
      }
    }
  `

  const res = await fetchWithTimeout('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_API_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const data = (await res.json()) as {
    data?: { viewer?: { accounts?: [{ rumPageloadEventsAdaptiveGroups?: [{ sum?: { visits?: number } }] }] } }
    errors?: unknown
  }

  // Loga o corpo bruto sempre que não vier um número — a GraphQL Analytics
  // API devolve 200 mesmo quando a query tem erro (fica em `errors`), então
  // `res.ok` sozinho não denuncia problema de token/conta/campo errado.
  if (!res.ok || data.errors) {
    logError('cfAnalytics', 'Resposta inesperada da GraphQL Analytics API', { status: res.status, data })
    return null
  }

  const visits = data.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups?.[0]?.sum?.visits
  if (typeof visits !== 'number') {
    logError('cfAnalytics', 'Campo sum.visits não encontrado na resposta', { data })
    return null
  }
  return visits
}

// Janela "hoje desde meia-noite BRT" — não bate com o "Last 24 hrs" do
// dashboard da Cloudflare (esse é rolling), mas reseta no horário local do
// público, que é o que a maioria espera de "visitas de hoje". A resposta
// ainda tem alguns minutos de atraso, não é "visitantes agora" em tempo
// real estrito.
export async function fetchTodayVisits(env: Env): Promise<number | null> {
  if (!env.CLOUDFLARE_ANALYTICS_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) return null

  try {
    const until = new Date()
    const brtShifted = new Date(until.getTime() - BRT_OFFSET_HOURS * 60 * 60 * 1000)
    const brtMidnightShifted = new Date(Date.UTC(brtShifted.getUTCFullYear(), brtShifted.getUTCMonth(), brtShifted.getUTCDate()))
    const since = new Date(brtMidnightShifted.getTime() + BRT_OFFSET_HOURS * 60 * 60 * 1000)
    return await fetchVisitsRange(env, since.toISOString(), until.toISOString())
  } catch (err) {
    logError('cfAnalytics', 'Falha ao buscar visitas de hoje', { err })
    return null
  }
}

// Visitas desde um checkpoint até agora — usado pra completar o total
// "desde sempre" entre uma verificação semanal e outra (ver
// functions/api/community-stats.ts, resolveLifetimeVisits, e o worker
// workers/social-stats-cron/src/siteVisitsLifetime.ts, que é quem grava o
// checkpoint). O intervalo aqui é sempre pequeno (no máximo ~1 semana),
// então cabe tranquilo no limite de ~90 dias por consulta.
export async function fetchVisitsSince(env: Env, sinceISO: string): Promise<number | null> {
  if (!env.CLOUDFLARE_ANALYTICS_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) return null

  try {
    return await fetchVisitsRange(env, sinceISO, new Date().toISOString())
  } catch (err) {
    logError('cfAnalytics', 'Falha ao buscar visitas desde o checkpoint', { err })
    return null
  }
}
