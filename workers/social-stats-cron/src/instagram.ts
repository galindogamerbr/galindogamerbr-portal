import type { Env } from './env'
import { getInstagramToken, upsertInstagramToken } from './d1'

const GRAPH_VERSION = 'v22.0'

// Renova se faltar menos de 10 dias pro vencimento — dá folga suficiente
// pra não arriscar o token expirar entre uma rodada (de hora em hora) e
// outra caso a renovação falhe uma vez.
const REFRESH_MARGIN_MS = 10 * 24 * 60 * 60 * 1000

async function refreshToken(accessToken: string): Promise<{ accessToken: string; expiresAt: string } | null> {
  const url = new URL('https://graph.instagram.com/refresh_access_token')
  url.searchParams.set('grant_type', 'ig_refresh_token')
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!data.access_token || !data.expires_in) return null

  return { accessToken: data.access_token, expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString() }
}

// Token de usuário do Instagram (Instagram API with Instagram Login) — sem
// painel admin no site, sem fluxo OAuth próprio. Gerado manualmente no App
// Dashboard da Meta e colado direto como secret do Worker
// (INSTAGRAM_ACCESS_TOKEN). Usa "me" como id da conta — a Graph API resolve
// sozinha pro dono do token, sem precisar guardar/colar o id numérico. Na
// primeira rodada sem nada em D1, bootstrapa a partir do secret com
// expires_at no passado — força a renovação já nessa mesma rodada, que
// grava o token renovado (de verdade, com expiração real) em D1. Daí em
// diante, D1 é a única fonte — o secret só volta a ser usado se a tabela
// for limpa.
export async function getInstagramFollowers(env: Env): Promise<number | null> {
  let token = await getInstagramToken(env.DB)
  if (!token && env.INSTAGRAM_ACCESS_TOKEN) {
    token = { access_token: env.INSTAGRAM_ACCESS_TOKEN, ig_user_id: 'me', expires_at: new Date(0).toISOString() }
  }
  if (!token) return null

  if (new Date(token.expires_at).getTime() - Date.now() < REFRESH_MARGIN_MS) {
    const refreshed = await refreshToken(token.access_token)
    if (refreshed) {
      await upsertInstagramToken(env.DB, { accessToken: refreshed.accessToken, igUserId: token.ig_user_id, expiresAt: refreshed.expiresAt })
      token = { ...token, access_token: refreshed.accessToken, expires_at: refreshed.expiresAt }
    }
    // Se a renovação falhar, segue tentando com o token atual — pode ainda
    // não ter vencido de verdade (a margem é intencionalmente folgada).
  }

  const url = new URL(`https://graph.instagram.com/${GRAPH_VERSION}/${token.ig_user_id}`)
  url.searchParams.set('fields', 'followers_count')
  url.searchParams.set('access_token', token.access_token)

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = (await res.json()) as { followers_count?: number }
  return data.followers_count ?? null
}
