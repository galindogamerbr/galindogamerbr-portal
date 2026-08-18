export type InstagramTokenRow = {
  access_token: string
  ig_user_id: string
  expires_at: string
  updated_at: string
}

export async function getInstagramToken(db: D1Database): Promise<InstagramTokenRow | null> {
  const row = await db
    .prepare('SELECT access_token, ig_user_id, expires_at, updated_at FROM instagram_token WHERE id = 1')
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
