import { DISCORD_INVITE_CODE } from './socialConstants'
import { fetchWithTimeout } from './http'

export type DiscordCounts = { memberCount: number | null; onlineCount: number | null }

// Endpoint público oficial do Discord — sem auth, sem bot. Uma chamada só
// devolve total de membros (approximate_member_count) e online agora
// (approximate_presence_count), então buscamos os dois juntos ao vivo em
// vez de depender do worker (workers/social-stats-cron) pro total.
export async function fetchDiscordCounts(): Promise<DiscordCounts | null> {
  try {
    const res = await fetchWithTimeout(`https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`)
    if (!res.ok) return null

    const data = (await res.json()) as { approximate_member_count?: number; approximate_presence_count?: number }
    return {
      memberCount: data.approximate_member_count ?? null,
      onlineCount: data.approximate_presence_count ?? null,
    }
  } catch {
    return null
  }
}
