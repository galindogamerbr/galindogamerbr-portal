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

export type InstagramTokenRow = { access_token: string; ig_user_id: string; expires_at: string }

// Token conectado uma vez via functions/api/admin/instagram/* (fluxo OAuth
// no painel admin do site) — o worker só lê e renova, nunca inicia login.
export async function getInstagramToken(db: D1Database): Promise<InstagramTokenRow | null> {
  const row = await db
    .prepare('SELECT access_token, ig_user_id, expires_at FROM instagram_token WHERE id = 1')
    .first<InstagramTokenRow>()
  return row ?? null
}

export async function upsertInstagramToken(
  db: D1Database,
  params: { accessToken: string; igUserId: string; expiresAt: string },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO instagram_token (id, access_token, ig_user_id, expires_at, updated_at)
       VALUES (1, ?, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET access_token = excluded.access_token, ig_user_id = excluded.ig_user_id,
         expires_at = excluded.expires_at, updated_at = excluded.updated_at`,
    )
    .bind(params.accessToken, params.igUserId, params.expiresAt)
    .run()
}
