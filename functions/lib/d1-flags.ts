export async function getFlag(db: D1Database, key: string): Promise<boolean> {
  const row = await db.prepare('SELECT enabled FROM app_flags WHERE key = ?').bind(key).first<{ enabled: number }>()
  return row?.enabled === 1
}

export async function setFlag(db: D1Database, key: string, enabled: boolean): Promise<void> {
  await db
    .prepare(
      `INSERT INTO app_flags (key, enabled, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT (key) DO UPDATE SET enabled = excluded.enabled, updated_at = excluded.updated_at`,
    )
    .bind(key, enabled ? 1 : 0)
    .run()
}
