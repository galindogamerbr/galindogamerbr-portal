import type { Env } from './env'
import { getInstagramToken, upsertInstagramToken } from './d1'

const GRAPH_VERSION = 'v22.0'

// Renova se faltar menos de 10 dias pro vencimento — dá folga suficiente
// pra não arriscar o token expirar entre uma rodada (de hora em hora) e
// outra caso a renovação falhe uma vez.
const REFRESH_MARGIN_MS = 10 * 24 * 60 * 60 * 1000

async function refreshToken(env: Env, accessToken: string): Promise<{ accessToken: string; expiresAt: string } | null> {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`)
  url.searchParams.set('grant_type', 'fb_exchange_token')
  url.searchParams.set('client_id', env.INSTAGRAM_APP_ID)
  url.searchParams.set('client_secret', env.INSTAGRAM_APP_SECRET)
  url.searchParams.set('fb_exchange_token', accessToken)

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!data.access_token || !data.expires_in) return null

  return { accessToken: data.access_token, expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString() }
}

// Token vem do fluxo OAuth "Instagram API with Facebook Login" conectado
// uma vez pelo admin (functions/api/admin/instagram/*.ts) — aqui só lê do
// D1, renova sozinho antes de vencer (fb_exchange_token, precisa do
// App ID/Secret) e busca o followers_count via Graph API. Se nunca foi
// conectado, devolve null sem erro — o worker mantém o último valor
// cacheado em social_stats_cache até alguém conectar.
export async function getInstagramFollowers(env: Env): Promise<number | null> {
  let token = await getInstagramToken(env.DB)
  if (!token) return null

  if (new Date(token.expires_at).getTime() - Date.now() < REFRESH_MARGIN_MS) {
    const refreshed = await refreshToken(env, token.access_token)
    if (refreshed) {
      await upsertInstagramToken(env.DB, { accessToken: refreshed.accessToken, igUserId: token.ig_user_id, expiresAt: refreshed.expiresAt })
      token = { ...token, access_token: refreshed.accessToken, expires_at: refreshed.expiresAt }
    }
    // Se a renovação falhar, segue tentando com o token atual — pode ainda
    // não ter vencido de verdade (a margem é intencionalmente folgada).
  }

  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${token.ig_user_id}`)
  url.searchParams.set('fields', 'followers_count')
  url.searchParams.set('access_token', token.access_token)

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = (await res.json()) as { followers_count?: number }
  return data.followers_count ?? null
}
