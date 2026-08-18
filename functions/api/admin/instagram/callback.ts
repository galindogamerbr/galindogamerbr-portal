import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { buildClearCookie, parseCookie } from '../../../lib/session'
import { upsertInstagramToken } from '../../../lib/d1-instagram'

const STATE_COOKIE_NAME = 'ig_oauth_state'
const GRAPH_VERSION = 'v22.0'

type Page = { id: string; name: string; access_token: string; instagram_business_account?: { id: string } }

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

  const redirectUri = new URL('/api/admin/instagram/callback', context.request.url).toString()

  // Passo 1: troca o code por um token de usuário de curta duração.
  const shortLivedUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`)
  shortLivedUrl.searchParams.set('client_id', context.env.INSTAGRAM_APP_ID)
  shortLivedUrl.searchParams.set('client_secret', context.env.INSTAGRAM_APP_SECRET)
  shortLivedUrl.searchParams.set('redirect_uri', redirectUri)
  shortLivedUrl.searchParams.set('code', code)

  const shortLivedRes = await fetch(shortLivedUrl.toString())
  if (!shortLivedRes.ok) {
    return new Response(`Falha ao trocar o code por token: ${await shortLivedRes.text()}`, { status: 502 })
  }
  const shortLived = (await shortLivedRes.json()) as { access_token?: string }
  if (!shortLived.access_token) {
    return new Response('Resposta sem access_token no passo 1.', { status: 502 })
  }

  // Passo 2: troca o token curto por um de usuário de longa duração (~60 dias).
  const longLivedUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`)
  longLivedUrl.searchParams.set('grant_type', 'fb_exchange_token')
  longLivedUrl.searchParams.set('client_id', context.env.INSTAGRAM_APP_ID)
  longLivedUrl.searchParams.set('client_secret', context.env.INSTAGRAM_APP_SECRET)
  longLivedUrl.searchParams.set('fb_exchange_token', shortLived.access_token)

  const longLivedRes = await fetch(longLivedUrl.toString())
  if (!longLivedRes.ok) {
    return new Response(`Falha ao gerar token de longa duração: ${await longLivedRes.text()}`, { status: 502 })
  }
  const longLived = (await longLivedRes.json()) as { access_token?: string; expires_in?: number }
  if (!longLived.access_token || !longLived.expires_in) {
    return new Response('Resposta sem access_token/expires_in no passo 2.', { status: 502 })
  }

  // Passo 3: acha a Página do Facebook vinculada a uma conta do Instagram
  // (pega o token da própria Página — esse é o que consulta o Instagram
  // depois — e o ID da conta comercial do Instagram vinculada a ela).
  const pagesUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/me/accounts`)
  pagesUrl.searchParams.set('fields', 'id,name,access_token,instagram_business_account')
  pagesUrl.searchParams.set('access_token', longLived.access_token)

  const pagesRes = await fetch(pagesUrl.toString())
  if (!pagesRes.ok) {
    return new Response(`Falha ao listar Páginas: ${await pagesRes.text()}`, { status: 502 })
  }
  const pagesData = (await pagesRes.json()) as { data?: Page[] }
  const page = pagesData.data?.find((p) => p.instagram_business_account?.id)

  if (!page?.instagram_business_account) {
    return new Response(
      'Nenhuma Página do Facebook com conta do Instagram vinculada foi encontrada. Confirma que a Página certa está conectada ao Instagram Business/Creator antes de tentar de novo.',
      { status: 400 },
    )
  }

  // Passo 4: busca o @ e a foto da conta comercial do Instagram — só pra
  // exibir no painel qual conta está conectada, uma falha aqui não deve
  // travar a conexão.
  const igUserId = page.instagram_business_account.id
  const profileUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}`)
  profileUrl.searchParams.set('fields', 'username,profile_picture_url')
  profileUrl.searchParams.set('access_token', page.access_token)
  const profileRes = await fetch(profileUrl.toString())
  const profileData = profileRes.ok
    ? ((await profileRes.json()) as { username?: string; profile_picture_url?: string })
    : null

  const expiresAt = new Date(Date.now() + longLived.expires_in * 1000).toISOString()
  await upsertInstagramToken(context.env.DB, {
    accessToken: page.access_token,
    igUserId,
    expiresAt,
    username: profileData?.username,
    avatarUrl: profileData?.profile_picture_url,
  })

  return new Response(null, {
    status: 302,
    headers: {
      location: '/admin/instagram?connected=1',
      'set-cookie': buildClearCookie(STATE_COOKIE_NAME),
    },
  })
}
