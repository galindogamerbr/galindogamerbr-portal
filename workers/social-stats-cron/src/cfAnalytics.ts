import type { Env } from './env'

// Duplicado (não importado de functions/lib/cfAnalytics.ts) de propósito,
// mesmo motivo do resto de src/d1.ts: esse worker roda num runtime/deploy
// separado. Diferente da versão do site (que sempre pergunta "hoje"), essa
// aceita qualquer intervalo — quem chama garante que cabe no limite de ~90
// dias por consulta da GraphQL Analytics API (ver siteVisitsLifetime.ts).
export async function fetchVisitsInRange(env: Env, sinceISO: string, untilISO: string): Promise<number | null> {
  if (!env.CLOUDFLARE_ANALYTICS_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) return null

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

  try {
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

    // A GraphQL Analytics API devolve 200 mesmo com erro de query (fica em
    // `errors`, ex: intervalo maior que o permitido) — res.ok sozinho não
    // denuncia isso.
    if (!res.ok || data.errors) return null

    const visits = data.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups?.[0]?.sum?.visits
    return typeof visits === 'number' ? visits : null
  } catch {
    return null
  }
}
