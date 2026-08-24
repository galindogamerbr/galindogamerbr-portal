// Configurações da Fazenda editáveis pelo painel admin.
export async function getFarmWelcomeVideoId(db: D1Database): Promise<string | null> {
  const row = await db.prepare('SELECT video_id FROM farm_welcome_video WHERE id = 1').first<{ video_id: string }>()
  return row?.video_id ?? null
}

export async function upsertFarmWelcomeVideoId(db: D1Database, videoId: string): Promise<void> {
  await db
    .prepare(
      `INSERT INTO farm_welcome_video (id, video_id, updated_at)
       VALUES (1, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET video_id = excluded.video_id, updated_at = excluded.updated_at`,
    )
    .bind(videoId)
    .run()
}
