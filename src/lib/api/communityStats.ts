import type { SocialPlatform } from '../../data/socials'

export type SocialStat = { platform: SocialPlatform; count: number; fetchedAt: string | null }

export type LiveStatus = { isLive: boolean; viewerCount: number | null }

export type CommunityStats = {
  social: SocialStat[]
  postCounts: Partial<Record<SocialPlatform, number>>
  siteVisits: { visitsToday: number | null; lifetimeVisits: number | null }
  twitchLive: LiveStatus
  kickLive: LiveStatus
  tiktokLive: LiveStatus
  discordOnline: number | null
}

// null em qualquer falha (rede, 500, JSON inválido) — quem chama decide o
// fallback (useCommunityStats mantém o último dado bom em vez de sobrescrever
// com nada).
export async function getCommunityStats(): Promise<CommunityStats | null> {
  try {
    const res = await fetch('/api/community-stats')
    if (!res.ok) return null
    return (await res.json()) as CommunityStats
  } catch {
    return null
  }
}
