import type { Env } from './lib/env'
import { getDiscordInviteUrl } from './lib/d1-community'
import { logError } from './lib/log'

// Redirect curto (/discord) pro convite real do Discord, guardado em D1 e
// editável em /admin/discord — assim o convite pode ser trocado (expirado,
// revogado, novo servidor) sem precisar de deploy nem atualizar link em
// vários lugares do site. 302 (não 301): convites de Discord podem mudar,
// não queremos navegador/CDN fixando o destino antigo em cache permanente.
const FALLBACK_INVITE_URL = 'https://discord.com/invite/JggtZ7qGY3'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  let url = FALLBACK_INVITE_URL
  try {
    url = (await getDiscordInviteUrl(context.env.DB)) ?? FALLBACK_INVITE_URL
  } catch (err) {
    logError('discord-redirect', 'Falha ao ler o convite do D1, usando fallback', { err })
  }
  return Response.redirect(url, 302)
}
