import type { Env } from './env'
import { getTiktokToken, upsertTiktokToken } from './d1'

async function refreshToken(env: Env, currentRefreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: currentRefreshToken,
    }),
  })
  if (!res.ok) return null

  const data = (await res.json()) as { access_token?: string; refresh_token?: string }
  if (!data.access_token || !data.refresh_token) return null
  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}

// Token vem do fluxo OAuth "TikTok Login Kit" conectado uma vez pelo admin
// (functions/api/admin/tiktok/*.ts) — aqui só lê do D1 e renova a cada
// rodada (access_token dura só 24h, então renovar toda hora — quando o
// cron roda — é natural, sem precisar checar expiração). A TikTok
// rotaciona o refresh_token a cada troca, sempre salva o novo. Se nunca
// foi conectado, devolve null sem erro.
export async function getTiktokFollowers(env: Env): Promise<number | null> {
  const token = await getTiktokToken(env.DB)
  if (!token) return null

  const refreshed = await refreshToken(env, token.refresh_token)
  if (!refreshed) return null
  await upsertTiktokToken(env.DB, refreshed)

  const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=follower_count', {
    headers: { authorization: `Bearer ${refreshed.accessToken}` },
  })
  if (!res.ok) return null

  const data = (await res.json()) as { data?: { user?: { follower_count?: number } } }
  return data.data?.user?.follower_count ?? null
}
