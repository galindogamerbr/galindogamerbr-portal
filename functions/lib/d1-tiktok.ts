export type TiktokTokenRow = {
  access_token: string
  refresh_token: string
  username: string | null
  updated_at: string
}

export async function getTiktokToken(db: D1Database): Promise<TiktokTokenRow | null> {
  const row = await db
    .prepare('SELECT access_token, refresh_token, username, updated_at FROM tiktok_token WHERE id = 1')
    .first<TiktokTokenRow>()
  return row ?? null
}

export async function upsertTiktokToken(
  db: D1Database,
  params: { accessToken: string; refreshToken: string; username?: string },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tiktok_token (id, access_token, refresh_token, username, updated_at)
       VALUES (1, ?, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token,
         username = COALESCE(excluded.username, tiktok_token.username), updated_at = excluded.updated_at`,
    )
    .bind(params.accessToken, params.refreshToken, params.username ?? null)
    .run()
}

export async function deleteTiktokToken(db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM tiktok_token WHERE id = 1').run()
}
