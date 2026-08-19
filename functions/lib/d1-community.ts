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

export type PostCountRow = {
  platform: SocialPlatform
  count: number
  fetched_at: string
}

export async function getPostCountsCache(db: D1Database): Promise<PostCountRow[]> {
  const { results } = await db.prepare('SELECT * FROM post_counts_cache').all<PostCountRow>()
  return results
}

export type DiscordPresenceCacheRow = {
  online_count: number
  member_count: number | null
  fetched_at: string
}

export async function getDiscordPresenceCache(db: D1Database): Promise<DiscordPresenceCacheRow | null> {
  const row = await db
    .prepare('SELECT online_count, member_count, fetched_at FROM discord_presence_cache WHERE id = 1')
    .first<DiscordPresenceCacheRow>()
  return row ?? null
}

export async function upsertDiscordPresenceCache(
  db: D1Database,
  params: { onlineCount: number; memberCount: number | null },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO discord_presence_cache (id, online_count, member_count, fetched_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET online_count = excluded.online_count, member_count = excluded.member_count,
         fetched_at = excluded.fetched_at`,
    )
    .bind(params.onlineCount, params.memberCount)
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

export type TiktokLiveCacheRow = {
  is_live: number
  viewer_count: number | null
  room_hash: string | null
  fetched_at: string
}

// Diferente de twitch/kick (buscados frescos a cada request): quem escreve
// aqui é o job externo em scripts/tiktok-live-poll (ver
// functions/api/webhooks/tiktok-live.ts) — não tem API oficial do TikTok
// pra buscar isso na hora.
export async function getTiktokLiveCache(db: D1Database): Promise<TiktokLiveCacheRow | null> {
  const row = await db
    .prepare('SELECT is_live, viewer_count, room_hash, fetched_at FROM tiktok_live_cache WHERE id = 1')
    .first<TiktokLiveCacheRow>()
  return row ?? null
}

export async function upsertTiktokLiveCache(
  db: D1Database,
  params: { isLive: boolean; viewerCount: number | null; roomHash: string | null },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tiktok_live_cache (id, is_live, viewer_count, room_hash, fetched_at)
       VALUES (1, ?, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET is_live = excluded.is_live, viewer_count = excluded.viewer_count,
         room_hash = excluded.room_hash, fetched_at = excluded.fetched_at`,
    )
    .bind(params.isLive ? 1 : 0, params.viewerCount, params.roomHash)
    .run()
}
