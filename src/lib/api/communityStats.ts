import type { SocialPlatform } from '../../data/socials'

export type SocialStat = { platform: SocialPlatform; count: number; fetchedAt: string }

export type LiveStatus = { isLive: boolean; viewerCount: number | null }

export type CommunityStats = {
  social: SocialStat[]
  siteVisits: { visitsToday: number | null }
  twitchLive: LiveStatus
  kickLive: LiveStatus
}

export async function getCommunityStats(): Promise<CommunityStats> {
  const res = await fetch('/api/community-stats')
  return res.json() as Promise<CommunityStats>
}
