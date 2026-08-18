export type SocialPlatform = 'youtube' | 'discord' | 'twitch' | 'instagram' | 'tiktok' | 'kick'

export type SocialStatRow = {
  platform: SocialPlatform
  count: number
  fetched_at: string
}

export async function getSocialStatsCache(db: D1Database): Promise<SocialStatRow[]> {
  const { results } = await db.prepare('SELECT * FROM social_stats_cache').all<SocialStatRow>()
  return results
}

export async function upsertSocialStat(db: D1Database, platform: SocialPlatform, count: number): Promise<void> {
  await db
    .prepare(
      `INSERT INTO social_stats_cache (platform, count, fetched_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT (platform) DO UPDATE SET count = excluded.count, fetched_at = excluded.fetched_at`,
    )
    .bind(platform, count)
    .run()
}

export type LiveViewerCacheRow = {
  video_id: string
  viewer_count: number
  fetched_at: string
}

export async function getLiveViewerCache(db: D1Database): Promise<LiveViewerCacheRow | null> {
  const row = await db.prepare('SELECT video_id, viewer_count, fetched_at FROM live_viewer_cache WHERE id = 1').first<LiveViewerCacheRow>()
  return row ?? null
}

export async function upsertLiveViewerCache(db: D1Database, params: { videoId: string; viewerCount: number }): Promise<void> {
  await db
    .prepare(
      `INSERT INTO live_viewer_cache (id, video_id, viewer_count, fetched_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET video_id = excluded.video_id, viewer_count = excluded.viewer_count,
         fetched_at = excluded.fetched_at`,
    )
    .bind(params.videoId, params.viewerCount)
    .run()
}

export type TwitchLiveCacheRow = {
  is_live: number
  viewer_count: number | null
  fetched_at: string
}

export async function getTwitchLiveCache(db: D1Database): Promise<TwitchLiveCacheRow | null> {
  const row = await db.prepare('SELECT is_live, viewer_count, fetched_at FROM twitch_live_cache WHERE id = 1').first<TwitchLiveCacheRow>()
  return row ?? null
}

export async function upsertTwitchLiveCache(db: D1Database, params: { isLive: boolean; viewerCount: number | null }): Promise<void> {
  await db
    .prepare(
      `INSERT INTO twitch_live_cache (id, is_live, viewer_count, fetched_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET is_live = excluded.is_live, viewer_count = excluded.viewer_count,
         fetched_at = excluded.fetched_at`,
    )
    .bind(params.isLive ? 1 : 0, params.viewerCount)
    .run()
}

export type KickLiveCacheRow = {
  is_live: number
  viewer_count: number | null
  fetched_at: string
}

export async function getKickLiveCache(db: D1Database): Promise<KickLiveCacheRow | null> {
  const row = await db.prepare('SELECT is_live, viewer_count, fetched_at FROM kick_live_cache WHERE id = 1').first<KickLiveCacheRow>()
  return row ?? null
}

export async function upsertKickLiveCache(db: D1Database, params: { isLive: boolean; viewerCount: number | null }): Promise<void> {
  await db
    .prepare(
      `INSERT INTO kick_live_cache (id, is_live, viewer_count, fetched_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET is_live = excluded.is_live, viewer_count = excluded.viewer_count,
         fetched_at = excluded.fetched_at`,
    )
    .bind(params.isLive ? 1 : 0, params.viewerCount)
    .run()
}

export type DiscordPresenceCacheRow = {
  online_count: number
  fetched_at: string
}

export async function getDiscordPresenceCache(db: D1Database): Promise<DiscordPresenceCacheRow | null> {
  const row = await db.prepare('SELECT online_count, fetched_at FROM discord_presence_cache WHERE id = 1').first<DiscordPresenceCacheRow>()
  return row ?? null
}

export async function upsertDiscordPresenceCache(db: D1Database, onlineCount: number): Promise<void> {
  await db
    .prepare(
      `INSERT INTO discord_presence_cache (id, online_count, fetched_at)
       VALUES (1, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET online_count = excluded.online_count, fetched_at = excluded.fetched_at`,
    )
    .bind(onlineCount)
    .run()
}

export type SiteVisitsCacheRow = {
  visits_today: number
  fetched_at: string
}

export async function getSiteVisitsCache(db: D1Database): Promise<SiteVisitsCacheRow | null> {
  const row = await db.prepare('SELECT visits_today, fetched_at FROM site_visits_cache WHERE id = 1').first<SiteVisitsCacheRow>()
  return row ?? null
}

export async function upsertSiteVisitsCache(db: D1Database, visitsToday: number): Promise<void> {
  await db
    .prepare(
      `INSERT INTO site_visits_cache (id, visits_today, fetched_at)
       VALUES (1, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET visits_today = excluded.visits_today, fetched_at = excluded.fetched_at`,
    )
    .bind(visitsToday)
    .run()
}
