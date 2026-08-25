export type FlagshipVideoCacheRow = {
  video_id: string
  title: string
  thumbnail_url: string
}

export async function getFlagshipVideoCache(db: D1Database): Promise<FlagshipVideoCacheRow | null> {
  const row = await db.prepare('SELECT video_id, title, thumbnail_url FROM flagship_video_cache WHERE id = 1').first<FlagshipVideoCacheRow>()
  return row ?? null
}

export async function upsertFlagshipVideoCache(
  db: D1Database,
  params: { videoId: string; title: string; thumbnailUrl: string },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO flagship_video_cache (id, video_id, title, thumbnail_url, updated_at)
       VALUES (1, ?, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET video_id = excluded.video_id, title = excluded.title,
         thumbnail_url = excluded.thumbnail_url, updated_at = excluded.updated_at`,
    )
    .bind(params.videoId, params.title, params.thumbnailUrl)
    .run()
}

export type OtpCodeRow = {
  id: number
  email: string
  code_hash: string
  expires_at: string
  consumed_at: string | null
  attempt_count: number
}

export type SessionRow = {
  id: string
  email: string
  expires_at: string
  revoked_at: string | null
}

export async function isAllowlisted(db: D1Database, email: string): Promise<boolean> {
  const row = await db.prepare('SELECT 1 FROM admin_allowlist WHERE email = ?').bind(email).first()
  return row !== null
}

export async function insertOtpCode(
  db: D1Database,
  params: { email: string; codeHash: string; expiresAt: string; requestIp: string | null },
): Promise<void> {
  await db
    .prepare('INSERT INTO otp_codes (email, code_hash, expires_at, request_ip) VALUES (?, ?, ?, ?)')
    .bind(params.email, params.codeHash, params.expiresAt, params.requestIp)
    .run()
}

export async function getLatestValidOtp(db: D1Database, email: string): Promise<OtpCodeRow | null> {
  const row = await db
    .prepare(
      `SELECT * FROM otp_codes
       WHERE email = ? AND consumed_at IS NULL AND expires_at > datetime('now')
       ORDER BY created_at DESC LIMIT 1`,
    )
    .bind(email)
    .first<OtpCodeRow>()
  return row ?? null
}

export async function consumeOtpCode(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM otp_codes WHERE id = ?').bind(id).run()
}

export async function incrementOtpAttempt(db: D1Database, id: number): Promise<void> {
  await db.prepare('UPDATE otp_codes SET attempt_count = attempt_count + 1 WHERE id = ?').bind(id).run()
}

export async function createSession(
  db: D1Database,
  params: { id: string; email: string; expiresAt: string; userAgent: string | null; ip: string | null },
): Promise<void> {
  await db
    .prepare('INSERT INTO sessions (id, email, expires_at, user_agent, ip) VALUES (?, ?, ?, ?, ?)')
    .bind(params.id, params.email, params.expiresAt, params.userAgent, params.ip)
    .run()
}

export async function getActiveSession(db: D1Database, id: string): Promise<SessionRow | null> {
  const row = await db
    .prepare(
      `SELECT * FROM sessions
       WHERE id = ? AND revoked_at IS NULL AND expires_at > datetime('now')`,
    )
    .bind(id)
    .first<SessionRow>()
  return row ?? null
}

export async function revokeSession(db: D1Database, id: string): Promise<void> {
  await db.prepare("UPDATE sessions SET revoked_at = datetime('now') WHERE id = ?").bind(id).run()
}

// O cron roda a cada 20 minutos. Usamos uma margem de uma hora para que,
// mesmo entre duas execuções, nenhum IP complete 24 horas armazenado.
export async function purgeExpiredSecurityData(db: D1Database): Promise<void> {
  await db.batch([
    db.prepare("DELETE FROM rate_limit_events WHERE created_at <= datetime('now', '-23 hours')"),
    db.prepare("DELETE FROM otp_codes WHERE created_at <= datetime('now', '-23 hours')"),
  ])
}

export async function recordRateLimitEvent(db: D1Database, scope: string): Promise<void> {
  await db.prepare('INSERT INTO rate_limit_events (scope) VALUES (?)').bind(scope).run()
}

export async function countRateLimitEvents(db: D1Database, scope: string, sinceMinutesAgo: number): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) as count FROM rate_limit_events
       WHERE scope = ? AND created_at > datetime('now', ?)`,
    )
    .bind(scope, `-${sinceMinutesAgo} minutes`)
    .first<{ count: number }>()
  return row?.count ?? 0
}
