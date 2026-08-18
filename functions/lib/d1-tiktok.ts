export type TiktokTokenRow = {
  access_token: string
  refresh_token: string
  updated_at: string
}

export async function getTiktokToken(db: D1Database): Promise<TiktokTokenRow | null> {
  const row = await db.prepare('SELECT access_token, refresh_token, updated_at FROM tiktok_token WHERE id = 1').first<TiktokTokenRow>()
  return row ?? null
}

export async function upsertTiktokToken(db: D1Database, params: { accessToken: string; refreshToken: string }): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tiktok_token (id, access_token, refresh_token, updated_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token,
         updated_at = excluded.updated_at`,
    )
    .bind(params.accessToken, params.refreshToken)
    .run()
}
