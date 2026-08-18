export type SocialPlatform = 'youtube' | 'discord' | 'twitch' | 'instagram' | 'tiktok' | 'kick'

// Duplicado (não importado de functions/lib/) de propósito: esse worker roda
// num runtime/deploy separado do Pages Functions do site — acoplar os dois
// builds complicaria o tsc -b do projeto principal pra um helper de 6 linhas.
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
