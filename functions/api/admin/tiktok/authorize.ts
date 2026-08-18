import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { buildSetCookie } from '../../../lib/session'

// Cookie curto (10min) só pra validar o state no callback — não é sessão,
// é proteção CSRF padrão de fluxo OAuth.
const STATE_COOKIE_NAME = 'tt_oauth_state'

// TikTok Login Kit — scope user.info.stats dá acesso ao follower_count.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return new Response('Unauthorized', { status: 401 })

  const state = crypto.randomUUID()
  const redirectUri = new URL('/api/admin/tiktok/callback', context.request.url).toString()

  const authorizeUrl = new URL('https://www.tiktok.com/v2/auth/authorize/')
  authorizeUrl.searchParams.set('client_key', context.env.TIKTOK_CLIENT_KEY)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('scope', 'user.info.basic,user.info.stats')
  authorizeUrl.searchParams.set('redirect_uri', redirectUri)
  authorizeUrl.searchParams.set('state', state)

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      'set-cookie': buildSetCookie(STATE_COOKIE_NAME, state, 600),
    },
  })
}
