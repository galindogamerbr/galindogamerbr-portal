import type { Env } from '../lib/env'
import { getPublishedVersion, getBlocks } from '../lib/d1-schedule'
import { json } from '../lib/http'

// Público — consumido pela página /programacao e pelo teaser da Home.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const version = await getPublishedVersion(context.env.DB)
  if (!version) return json({ label: null, cycleLength: 0, weeks: [] })

  const blocks = await getBlocks(context.env.DB, version.id)
  const weeks = Array.from({ length: version.cycle_length }, (_, cycleIndex) => ({
    cycleIndex,
    blocks: blocks
      .filter((block) => block.cycle_index === cycleIndex)
      .map((block) => ({
        dayOfWeek: block.day_of_week,
        startTime: block.start_time,
        endTime: block.end_time,
        note: block.note,
      })),
  }))

  return json({ label: version.label, cycleLength: version.cycle_length, weeks })
}
