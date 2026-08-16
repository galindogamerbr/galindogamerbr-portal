import type { Env } from '../../../../lib/env'
import { requireSession } from '../../../../lib/requireSession'
import { getBlocks, getVersion } from '../../../../lib/d1-schedule'
import { json } from '../../../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const versionId = Number(context.params.id)
  const version = await getVersion(context.env.DB, versionId)
  if (!version) return json({ error: 'not_found' }, { status: 404 })

  const blocks = await getBlocks(context.env.DB, versionId)
  return json({
    id: version.id,
    label: version.label,
    cycleLength: version.cycle_length,
    isPublished: version.is_published === 1,
    blocks: blocks.map((b) => ({
      id: b.id,
      cycleIndex: b.cycle_index,
      dayOfWeek: b.day_of_week,
      startTime: b.start_time,
      endTime: b.end_time,
      note: b.note,
    })),
  })
}
