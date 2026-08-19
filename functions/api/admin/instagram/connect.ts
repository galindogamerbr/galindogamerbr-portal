import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { json } from '../../../lib/http'
import { upsertInstagramToken } from '../../../lib/d1-instagram'

const GRAPH_VERSION = 'v22.0'

// Sem fluxo OAuth — o admin gera o token de acesso do Instagram manualmente
// (Meta App Dashboard → Casos de uso → Gerenciar mensagens e conteúdo no
// Instagram → "Gerar tokens de acesso") e cola aqui. Token de usuário do
// Instagram (Instagram API with Instagram Login), não token de Página do
// Facebook — daí a API ser graph.instagram.com, não graph.facebook.com (ver
// workers/social-stats-cron/src/instagram.ts pra renovação).
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const body = (await context.request.json()) as { accessToken?: unknown; igUserId?: unknown }
  const accessToken = typeof body.accessToken === 'string' ? body.accessToken.trim() : ''
  const igUserId = typeof body.igUserId === 'string' ? body.igUserId.trim() : ''
  if (!accessToken || !igUserId) return json({ error: 'invalid_body' }, { status: 400 })

  const profileUrl = new URL(`https://graph.instagram.com/${GRAPH_VERSION}/${igUserId}`)
  profileUrl.searchParams.set('fields', 'username,profile_picture_url')
  profileUrl.searchParams.set('access_token', accessToken)

  const profileRes = await fetch(profileUrl.toString())
  if (!profileRes.ok) {
    return json({ error: 'token_invalid', details: await profileRes.text() }, { status: 400 })
  }
  const profile = (await profileRes.json()) as { username?: string; profile_picture_url?: string }

  // Tokens de usuário do Instagram de longa duração vivem 60 dias — não tem
  // como saber a expiração exata de um token colado manualmente, então
  // assume o máximo documentado. O worker renova bem antes disso (margem de
  // 10 dias, igual ao fluxo antigo).
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()

  await upsertInstagramToken(context.env.DB, {
    accessToken,
    igUserId,
    expiresAt,
    username: profile.username,
    avatarUrl: profile.profile_picture_url,
  })

  return json({ ok: true })
}
