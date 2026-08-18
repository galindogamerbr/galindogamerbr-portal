import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { buildSetCookie } from '../../../lib/session'

// Cookie curto (10min) só pra validar o state no callback — não é sessão,
// é proteção CSRF padrão de fluxo OAuth.
const STATE_COOKIE_NAME = 'ig_oauth_state'

// "Instagram API with Facebook Login" — hoje a Meta provisiona esse caso de
// uso em cima do produto "Login do Facebook para Empresas" (Facebook Login
// for Business), não o "Facebook Login" clássico. Esse produto troca o
// parâmetro `scope` por `config_id`, referenciando uma "Configuração de
// Login" criada em Login do Facebook para Empresas → Configurações (que já
// embute as permissões, tipo de token, etc). O redirect_uri continua vindo
// da lista clássica "Valid OAuth Redirect URIs".
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return new Response('Unauthorized', { status: 401 })

  const state = crypto.randomUUID()
  const redirectUri = new URL('/api/admin/instagram/callback', context.request.url).toString()

  const authorizeUrl = new URL('https://www.facebook.com/v22.0/dialog/oauth')
  authorizeUrl.searchParams.set('client_id', context.env.INSTAGRAM_APP_ID)
  authorizeUrl.searchParams.set('config_id', context.env.INSTAGRAM_LOGIN_CONFIG_ID)
  authorizeUrl.searchParams.set('redirect_uri', redirectUri)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('state', state)

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      'set-cookie': buildSetCookie(STATE_COOKIE_NAME, state, 600),
    },
  })
}
