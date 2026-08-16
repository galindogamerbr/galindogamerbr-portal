import type { VideoState } from './youtube'

export type LiveStateRow = {
  video_id: string | null
  title: string | null
  thumbnail_url: string | null
  is_live: number
  started_at: string | null
  updated_at: string
}

export async function getLiveState(db: D1Database): Promise<LiveStateRow | null> {
  const row = await db.prepare('SELECT * FROM live_state WHERE id = 1').first<LiveStateRow>()
  return row ?? null
}

export async function upsertLiveState(db: D1Database, state: VideoState): Promise<void> {
  await db
    .prepare(
      `UPDATE live_state
       SET video_id = ?, title = ?, thumbnail_url = ?, is_live = ?, started_at = ?, updated_at = datetime('now')
       WHERE id = 1`,
    )
    .bind(state.videoId, state.title, state.thumbnailUrl, state.isLive ? 1 : 0, state.startedAt)
    .run()
}

// Quando o vídeo que estava ao vivo termina, o próprio videos.list já
// devolve isLive:false na próxima resolução — não precisa de um caminho
// separado para "encerrar". O front sempre lê is_live do estado atual.
