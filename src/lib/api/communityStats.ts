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

export async function getCommunityStats(): Promise<CommunityStats> {
  const res = await fetch('/api/community-stats')
  return res.json() as Promise<CommunityStats>
}
