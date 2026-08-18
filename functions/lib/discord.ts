import { DISCORD_INVITE_CODE } from './socialConstants'

// Mesmo endpoint público usado pelo worker pro total de membros (ver
// workers/social-stats-cron/src/discord.ts) — sem auth, sem bot. Também
// devolve approximate_presence_count (quantos estão online agora).
export async function fetchDiscordOnlineCount(): Promise<number | null> {
  const res = await fetch(`https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`)
  if (!res.ok) return null

  const data = (await res.json()) as { approximate_presence_count?: number }
  return data.approximate_presence_count ?? null
}
