export type ScheduleBlockRow = {
  id: number
  version_id: number
  cycle_index: number
  day_of_week: number
  start_time: string
  end_time: string
  note: string | null
}

export type ScheduleVersionRow = {
  id: number
  label: string
  cycle_length: number
  is_published: number
  created_at: string
  created_by: string | null
}

export type ScheduleBlockInput = {
  cycleIndex: number
  dayOfWeek: number
  startTime: string
  endTime: string
  note?: string | null
}

export async function getPublishedVersion(db: D1Database): Promise<ScheduleVersionRow | null> {
  const row = await db.prepare('SELECT * FROM schedule_versions WHERE is_published = 1 LIMIT 1').first<ScheduleVersionRow>()
  return row ?? null
}

export async function getVersion(db: D1Database, versionId: number): Promise<ScheduleVersionRow | null> {
  const row = await db.prepare('SELECT * FROM schedule_versions WHERE id = ?').bind(versionId).first<ScheduleVersionRow>()
  return row ?? null
}

export async function listVersions(db: D1Database): Promise<ScheduleVersionRow[]> {
  const { results } = await db.prepare('SELECT * FROM schedule_versions ORDER BY created_at DESC').all<ScheduleVersionRow>()
  return results
}

export async function getBlocks(db: D1Database, versionId: number): Promise<ScheduleBlockRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM schedule_blocks WHERE version_id = ? ORDER BY cycle_index, day_of_week, start_time')
    .bind(versionId)
    .all<ScheduleBlockRow>()
  return results
}

export async function createVersion(
  db: D1Database,
  params: { label: string; cycleLength: number; createdBy: string },
): Promise<number> {
  const result = await db
    .prepare('INSERT INTO schedule_versions (label, cycle_length, created_by) VALUES (?, ?, ?) RETURNING id')
    .bind(params.label, params.cycleLength, params.createdBy)
    .first<{ id: number }>()
  if (!result) throw new Error('Falha ao criar versão da programação')
  return result.id
}

// Substitui todos os blocos da versão de uma vez — semântica de "salvar"
// simples pro editor no-code (o cliente manda a lista completa).
export async function replaceBlocks(db: D1Database, versionId: number, blocks: ScheduleBlockInput[]): Promise<void> {
  const statements = [
    db.prepare('DELETE FROM schedule_blocks WHERE version_id = ?').bind(versionId),
    ...blocks.map((block) =>
      db
        .prepare(
          'INSERT INTO schedule_blocks (version_id, cycle_index, day_of_week, start_time, end_time, note) VALUES (?, ?, ?, ?, ?, ?)',
        )
        .bind(versionId, block.cycleIndex, block.dayOfWeek, block.startTime, block.endTime, block.note ?? null),
    ),
  ]
  await db.batch(statements)
}

export async function updateVersion(
  db: D1Database,
  versionId: number,
  params: { label?: string; cycleLength?: number },
): Promise<void> {
  if (params.label !== undefined) {
    await db.prepare('UPDATE schedule_versions SET label = ? WHERE id = ?').bind(params.label, versionId).run()
  }
  if (params.cycleLength !== undefined) {
    await db.prepare('UPDATE schedule_versions SET cycle_length = ? WHERE id = ?').bind(params.cycleLength, versionId).run()
    // Blocos de ciclos que deixaram de existir (ex.: reduzir de 2 semanas pra 1)
    // ficariam órfãos e reapareceriam se o cycle_length voltar a subir depois.
    await db.prepare('DELETE FROM schedule_blocks WHERE version_id = ? AND cycle_index >= ?').bind(versionId, params.cycleLength).run()
  }
}

export async function publishVersion(db: D1Database, versionId: number): Promise<void> {
  await db.batch([
    db.prepare('UPDATE schedule_versions SET is_published = 0 WHERE is_published = 1'),
    db.prepare('UPDATE schedule_versions SET is_published = 1 WHERE id = ?').bind(versionId),
  ])
}
