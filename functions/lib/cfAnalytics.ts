import type { Env } from './env'

// Cloudflare Web Analytics (RUM) via GraphQL Analytics API — exige um API
// Token com escopo Zone.Analytics:Read e o Zone Tag do domínio (CF_API_TOKEN/
// CF_ZONE_TAG, ver functions/lib/env.ts). Isso é infraestrutura própria da
// Cloudflare, não uma API de terceiro com risco de cota — mas a resposta
// ainda tem alguns minutos de atraso e não representa "visitantes agora" em
// tempo real estrito, então tratamos como "visitas de hoje".
//
// Dataset/campos aqui seguem a documentação pública da GraphQL Analytics API
// (rumPageloadEventsAdaptiveGroups); como não há como testar contra uma conta
// real sem o token do Pedro, vale conferir a resposta real na primeira vez
// que rodar e ajustar o campo (`sum.visits` vs `count`) se necessário.
export async function fetchTodayVisits(env: Env): Promise<number | null> {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_TAG) return null

  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)

  const query = `
    query GetVisitsToday($zoneTag: String!, $since: Time!, $until: Time!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          rumPageloadEventsAdaptiveGroups(limit: 1, filter: { datetime_geq: $since, datetime_leq: $until }) {
            sum { visits }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.CF_API_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { zoneTag: env.CF_ZONE_TAG, since: since.toISOString(), until: new Date().toISOString() },
    }),
  })
  if (!res.ok) return null

  const data = (await res.json()) as {
    data?: { viewer?: { zones?: [{ rumPageloadEventsAdaptiveGroups?: [{ sum?: { visits?: number } }] }] } }
  }
  const visits = data.data?.viewer?.zones?.[0]?.rumPageloadEventsAdaptiveGroups?.[0]?.sum?.visits
  return typeof visits === 'number' ? visits : null
}
