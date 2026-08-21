import { fetchWithTimeout } from './http'
import { logWarn, logError } from './log'

export type DiscordCounts = { memberCount: number | null; onlineCount: number | null }

// Código do convite (ex.: "JggtZ7qGY3") extraído da URL guardada em D1
// (discord_invite, ver functions/lib/d1-community.ts e /admin/discord) — é
// só o último segmento do path, funciona tanto pra discord.gg/CODE quanto
// discord.com/invite/CODE. Sem constante hardcoded separada: se o convite
// trocar no admin, essa contagem já usa o código novo na próxima consulta.
function extractInviteCode(inviteUrl: string): string | null {
  try {
    const { pathname } = new URL(inviteUrl)
    return pathname.split('/').filter(Boolean).pop() ?? null
  } catch {
    return null
  }
}

// Endpoint público oficial do Discord — sem auth, sem bot. Uma chamada só
// devolve total de membros (approximate_member_count) e online agora
// (approximate_presence_count), então buscamos os dois juntos ao vivo em
// vez de depender do worker (workers/social-stats-cron) pro total.
export async function fetchDiscordCounts(inviteUrl: string): Promise<DiscordCounts | null> {
  const code = extractInviteCode(inviteUrl)
  if (!code) {
    logWarn('discord', 'Não foi possível extrair o código do convite da URL', { inviteUrl })
    return null
  }

  try {
    const res = await fetchWithTimeout(`https://discord.com/api/v10/invites/${code}?with_counts=true`)
    if (!res.ok) {
      logWarn('discord', 'invites endpoint retornou erro', { status: res.status })
      return null
    }

    const data = (await res.json()) as { approximate_member_count?: number; approximate_presence_count?: number }
    return {
      memberCount: data.approximate_member_count ?? null,
      onlineCount: data.approximate_presence_count ?? null,
    }
  } catch (err) {
    logError('discord', 'fetchDiscordCounts falhou', { err })
    return null
  }
}
