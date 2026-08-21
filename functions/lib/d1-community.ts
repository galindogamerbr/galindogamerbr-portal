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

// Total acumulado desde o início — só leitura aqui; quem escreve é o worker
// (workers/social-stats-cron/src/siteVisitsLifetime.ts), não o site público.
export type SiteVisitsLifetimeRow = {
  total_visits: number
  last_counted_at: string | null
}

export async function getSiteVisitsLifetime(db: D1Database): Promise<SiteVisitsLifetimeRow | null> {
  const row = await db
    .prepare('SELECT total_visits, last_counted_at FROM site_visits_lifetime WHERE id = 1')
    .first<SiteVisitsLifetimeRow>()
  return row ?? null
}

// Convite do Discord editável pelo admin (ver /admin/discord e
// functions/discord.ts) — mesma URL usada pra extrair o código do convite
// na contagem de membros do widget público do Discord (fetchDiscordCounts
// em functions/lib/discord.ts), então trocar aqui já atualiza os dois.
export async function getDiscordInviteUrl(db: D1Database): Promise<string | null> {
  const row = await db.prepare('SELECT url FROM discord_invite WHERE id = 1').first<{ url: string }>()
  return row?.url ?? null
}

export async function upsertDiscordInviteUrl(db: D1Database, url: string): Promise<void> {
  await db
    .prepare(
      `INSERT INTO discord_invite (id, url, updated_at)
       VALUES (1, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET url = excluded.url, updated_at = excluded.updated_at`,
    )
    .bind(url)
    .run()
}
