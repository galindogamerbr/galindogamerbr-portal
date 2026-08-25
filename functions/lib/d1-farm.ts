export type FarmVideoIds = {
  welcomeVideoId: string
  rulesVideoId: string
}

// As duas configurações são lidas e gravadas juntas para o painel nunca
// exibir/salvar uma combinação parcial de boas-vindas e regras.
export async function getFarmVideoIds(db: D1Database): Promise<FarmVideoIds | null> {
  const row = await db
    .prepare('SELECT video_id, rules_video_id FROM farm_welcome_video WHERE id = 1')
    .first<{ video_id: string; rules_video_id: string }>()
  return row ? { welcomeVideoId: row.video_id, rulesVideoId: row.rules_video_id } : null
}

export async function upsertFarmVideoIds(db: D1Database, videos: FarmVideoIds): Promise<void> {
  await db
    .prepare(
      `INSERT INTO farm_welcome_video (id, video_id, rules_video_id, updated_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET
         video_id = excluded.video_id,
         rules_video_id = excluded.rules_video_id,
         updated_at = excluded.updated_at`,
    )
    .bind(videos.welcomeVideoId, videos.rulesVideoId)
    .run()
}
