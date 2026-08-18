import type { Env } from './env'

// Cloudflare Web Analytics (RUM) via GraphQL Analytics API — exige um API
// Token com escopo Zone.Analytics:Read e o Zone Tag do domínio
// (CLOUDFLARE_ANALYTICS_API_TOKEN/CLOUDFLARE_ZONE_TAG, ver functions/lib/env.ts).
// Isso é infraestrutura própria da Cloudflare, não uma API de terceiro com
// risco de cota — mas a resposta ainda tem alguns minutos de atraso e não
// representa "visitantes agora" em tempo real estrito, então tratamos como
// "visitas de hoje".
//
// Dataset/campos aqui seguem a documentação pública da GraphQL Analytics API
// (rumPageloadEventsAdaptiveGroups); como não há como testar contra uma conta
// real sem o token do Pedro, vale conferir a resposta real na primeira vez
// que rodar e ajustar o campo (`sum.visits` vs `count`) se necessário.
// TEMP — introspecção pra descobrir o nome/caminho certo do dataset de RUM
// nessa conta (rumPageloadEventsAdaptiveGroups deu "unknown field" embaixo
// de zones). Remover depois de descobrir o campo certo.
export async function debugIntrospectRum(env: Env): Promise<void> {
  const query = `
    query {
      zonesType: __type(name: "zones") { fields { name } }
      accountsType: __type(name: "accounts") { fields { name } }
      queryType: __type(name: "Query") { fields { name } }
    }
  `
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_API_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const data = (await res.json()) as {
    data?: { zonesType?: { fields: { name: string }[] }; accountsType?: { fields: { name: string }[] }; queryType?: { fields: { name: string }[] } }
    errors?: unknown
  }
  if (data.errors) {
    console.error('[cfAnalytics][debug] introspecção falhou:', JSON.stringify(data.errors))
    return
  }
  const rumIn = (fields?: { name: string }[]) => (fields ?? []).map((f) => f.name).filter((n) => n.toLowerCase().includes('rum'))
  console.error('[cfAnalytics][debug] Query fields:', JSON.stringify((data.data?.queryType?.fields ?? []).map((f) => f.name)))
  console.error('[cfAnalytics][debug] zones RUM fields:', JSON.stringify(rumIn(data.data?.zonesType?.fields)))
  console.error('[cfAnalytics][debug] accounts RUM fields:', JSON.stringify(rumIn(data.data?.accountsType?.fields)))
}

export async function fetchTodayVisits(env: Env): Promise<number | null> {
  if (!env.CLOUDFLARE_ANALYTICS_API_TOKEN || !env.CLOUDFLARE_ZONE_TAG) return null

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
      authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_API_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { zoneTag: env.CLOUDFLARE_ZONE_TAG, since: since.toISOString(), until: new Date().toISOString() },
    }),
  })

  const data = (await res.json()) as {
    data?: { viewer?: { zones?: [{ rumPageloadEventsAdaptiveGroups?: [{ sum?: { visits?: number } }] }] } }
    errors?: unknown
  }

  // Loga o corpo bruto sempre que não vier um número — a GraphQL Analytics
  // API devolve 200 mesmo quando a query tem erro (fica em `errors`), então
  // `res.ok` sozinho não denuncia problema de token/zona/campo errado.
  if (!res.ok || data.errors) {
    console.error('[cfAnalytics] resposta inesperada da GraphQL Analytics API:', res.status, JSON.stringify(data))
    return null
  }

  const visits = data.data?.viewer?.zones?.[0]?.rumPageloadEventsAdaptiveGroups?.[0]?.sum?.visits
  if (typeof visits !== 'number') {
    console.error('[cfAnalytics] campo sum.visits não encontrado na resposta:', JSON.stringify(data))
    return null
  }
  return visits
}
