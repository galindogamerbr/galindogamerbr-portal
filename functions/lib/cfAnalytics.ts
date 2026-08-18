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
type NamedType = { name: string | null; ofType: NamedType | null } | null

function unwrapTypeName(t: NamedType): string | null {
  let cur = t
  for (let i = 0; i < 5 && cur; i++) {
    if (cur.name) return cur.name
    cur = cur.ofType
  }
  return null
}

async function introspect(env: Env, query: string): Promise<any> {
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_API_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  return res.json()
}

export async function debugIntrospectRum(env: Env): Promise<void> {
  // Passo 1: descobre o tipo real de Viewer.zones e Viewer.accounts (o nome
  // do tipo não é necessariamente "zones"/"accounts" — pode vir embrulhado
  // em NON_NULL/LIST).
  const step1 = await introspect(
    env,
    `query {
      __type(name: "Viewer") {
        fields { name type { name kind ofType { name kind ofType { name kind ofType { name kind } } } } }
      }
    }`,
  )
  if (step1.errors) {
    console.error('[cfAnalytics][debug] step1 falhou:', JSON.stringify(step1.errors))
    return
  }
  const viewerFields = (step1.data?.__type?.fields ?? []) as { name: string; type: NamedType }[]
  console.error('[cfAnalytics][debug] Viewer fields:', JSON.stringify(viewerFields.map((f) => f.name)))

  const zonesField = viewerFields.find((f) => f.name === 'zones')
  const accountsField = viewerFields.find((f) => f.name === 'accounts')
  const zonesTypeName = zonesField ? unwrapTypeName(zonesField.type) : null
  const accountsTypeName = accountsField ? unwrapTypeName(accountsField.type) : null
  console.error('[cfAnalytics][debug] zonesTypeName:', zonesTypeName, 'accountsTypeName:', accountsTypeName)

  // Passo 2: lista os campos desses tipos reais, filtrando por "rum".
  const typeNames = [zonesTypeName, accountsTypeName].filter((n): n is string => !!n)
  for (const typeName of typeNames) {
    const step2 = await introspect(env, `query { __type(name: "${typeName}") { fields { name } } }`)
    if (step2.errors) {
      console.error(`[cfAnalytics][debug] step2 (${typeName}) falhou:`, JSON.stringify(step2.errors))
      continue
    }
    const fields = (step2.data?.__type?.fields ?? []) as { name: string }[]
    const rumFields = fields.map((f) => f.name).filter((n) => n.toLowerCase().includes('rum'))
    console.error(`[cfAnalytics][debug] ${typeName} total fields:`, fields.length, 'rum fields:', JSON.stringify(rumFields))
  }
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
