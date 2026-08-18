import type { Env } from './env'

// "Visitas do site" via GraphQL Analytics API — dataset httpRequestsAdaptiveGroups
// da zona (não é o Web Analytics/RUM baseado em beacon JS: essa API bloqueia
// introspecção e o dataset de RUM é account-scoped, exigindo permissão
// diferente da que temos). httpRequestsAdaptiveGroups é zone-scoped, casa
// com o token Zone > Analytics > Read (CLOUDFLARE_ANALYTICS_API_TOKEN/
// CLOUDFLARE_ZONE_TAG, ver functions/lib/env.ts), e filtrando
// requestSource: "eyeball" conta só tráfego de navegador de verdade (exclui
// bots/crawlers). A resposta ainda tem alguns minutos de atraso e não é
// "visitantes agora" em tempo real estrito, então tratamos como "visitas de
// hoje". Query confirmada contra a documentação oficial da Cloudflare
// (developers.cloudflare.com/analytics/graphql-api).
export async function fetchTodayVisits(env: Env): Promise<number | null> {
  if (!env.CLOUDFLARE_ANALYTICS_API_TOKEN || !env.CLOUDFLARE_ZONE_TAG) return null

  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  const until = new Date()

  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${env.CLOUDFLARE_ZONE_TAG}" }) {
          httpRequestsAdaptiveGroups(
            limit: 1
            filter: { datetime_geq: "${since.toISOString()}", datetime_lt: "${until.toISOString()}", requestSource: "eyeball" }
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
    data?: { viewer?: { zones?: [{ httpRequestsAdaptiveGroups?: [{ sum?: { visits?: number } }] }] } }
    errors?: unknown
  }

  // Loga o corpo bruto sempre que não vier um número — a GraphQL Analytics
  // API devolve 200 mesmo quando a query tem erro (fica em `errors`), então
  // `res.ok` sozinho não denuncia problema de token/zona/campo errado.
  if (!res.ok || data.errors) {
    console.error('[cfAnalytics] resposta inesperada da GraphQL Analytics API:', res.status, JSON.stringify(data))
    return null
  }

  const visits = data.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups?.[0]?.sum?.visits
  if (typeof visits !== 'number') {
    console.error('[cfAnalytics] campo sum.visits não encontrado na resposta:', JSON.stringify(data))
    return null
  }
  return visits
}
