import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { buildClearCookie, parseCookie } from '../../../lib/session'
import { upsertTiktokToken } from '../../../lib/d1-tiktok'

const STATE_COOKIE_NAME = 'tt_oauth_state'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return new Response('Unauthorized', { status: 401 })

  const url = new URL(context.request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const expectedState = parseCookie(context.request.headers.get('cookie'), STATE_COOKIE_NAME)

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response('Estado inválido ou expirado — tenta conectar de novo pelo painel.', { status: 400 })
  }

  const redirectUri = new URL('/api/admin/tiktok/callback', context.request.url).toString()

  const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: context.env.TIKTOK_CLIENT_KEY,
      client_secret: context.env.TIKTOK_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })
  if (!tokenRes.ok) {
    return new Response(`Falha ao trocar o code por token: ${await tokenRes.text()}`, { status: 502 })
  }
  const token = (await tokenRes.json()) as { access_token?: string; refresh_token?: string }
  if (!token.access_token || !token.refresh_token) {
    return new Response('Resposta sem access_token/refresh_token.', { status: 502 })
  }

  await upsertTiktokToken(context.env.DB, { accessToken: token.access_token, refreshToken: token.refresh_token })

  return new Response(null, {
    status: 302,
    headers: {
      location: '/admin/tiktok?connected=1',
      'set-cookie': buildClearCookie(STATE_COOKIE_NAME),
    },
  })
}
