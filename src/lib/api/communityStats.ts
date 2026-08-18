import type { SocialPlatform } from '../../data/socials'

export type SocialStat = { platform: SocialPlatform; count: number; fetchedAt: string }

export type CommunityStats = {
  social: SocialStat[]
  siteVisits: { visitsToday: number | null }
}

export async function getCommunityStats(): Promise<CommunityStats> {
  const res = await fetch('/api/community-stats')
  return res.json() as Promise<CommunityStats>
}
