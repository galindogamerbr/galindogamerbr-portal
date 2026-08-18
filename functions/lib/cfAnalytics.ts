import type { Env } from './env'

// "Visitas do site" via Cloudflare Web Analytics (RUM) real — dataset
// rumPageloadEventsAdaptiveGroups, que é account-scoped (não zone-scoped:
// fica embaixo de viewer.accounts, não viewer.zones — testado direto contra
// a API real, já que essa API bloqueia introspecção). sum.visits confirmado
// batendo exatamente com o número "Visits" mostrado no dashboard de Web
// Analytics da Cloudflare para a mesma janela de tempo. Requer só a
// permissão "Account Analytics" → Read no token (CLOUDFLARE_ANALYTICS_API_TOKEN/
// CLOUDFLARE_ACCOUNT_ID, ver functions/lib/env.ts) — não precisa de siteTag
// nem de escopo de zona. A resposta ainda tem alguns minutos de atraso e
// não é "visitantes agora" em tempo real estrito, então tratamos como
// "visitas de hoje" (desde meia-noite UTC).
export async function fetchTodayVisits(env: Env): Promise<number | null> {
  if (!env.CLOUDFLARE_ANALYTICS_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) return null

  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  const until = new Date()

  const query = `
    query {
      viewer {
        accounts(filter: { accountTag: "${env.CLOUDFLARE_ACCOUNT_ID}" }) {
          rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { datetime_geq: "${since.toISOString()}", datetime_lt: "${until.toISOString()}" }
          ) {
            sum { visits }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
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
    console.error('[cfAnalytics] resposta inesperada da GraphQL Analytics API:', res.status, JSON.stringify(data))
    return null
  }

  const visits = data.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups?.[0]?.sum?.visits
  if (typeof visits !== 'number') {
    console.error('[cfAnalytics] campo sum.visits não encontrado na resposta:', JSON.stringify(data))
    return null
  }
  return visits
}
