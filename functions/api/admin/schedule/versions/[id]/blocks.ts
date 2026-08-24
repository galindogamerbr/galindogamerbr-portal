import type { Env } from '../../../../../lib/env'
import { requireSession } from '../../../../../lib/requireSession'
import { buildPublishedScheduleJson, publishVersion, replaceBlocks, type ScheduleBlockInput } from '../../../../../lib/d1-schedule'
import { publishScheduleToDiscord } from '../../../../../lib/discord-schedule'
import { json } from '../../../../../lib/http'

type BlockPayload = { cycleIndex?: unknown; dayOfWeek?: unknown; startTime?: unknown; endTime?: unknown; note?: unknown }

function parseBlocks(input: unknown): ScheduleBlockInput[] {
  if (!Array.isArray(input)) return []
  const blocks: ScheduleBlockInput[] = []
  for (const raw of input as BlockPayload[]) {
    if (
      typeof raw.cycleIndex !== 'number' ||
      typeof raw.dayOfWeek !== 'number' ||
      typeof raw.startTime !== 'string' ||
      typeof raw.endTime !== 'string'
    ) {
      continue
    }
    blocks.push({
      cycleIndex: raw.cycleIndex,
      dayOfWeek: raw.dayOfWeek,
      startTime: raw.startTime,
      endTime: raw.endTime,
      note: typeof raw.note === 'string' ? raw.note : null,
    })
  }
  return blocks
}

// Substitui todos os blocos da versão — o editor no-code manda a grade
// inteira a cada "salvar" (sem diffing incremental, escala tranquilo pro
// volume de dados de uma programação semanal).
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const versionId = Number(context.params.id)
  const body = (await context.request.json()) as { blocks?: unknown; portraitImageDataUrl?: unknown }
  const blocks = parseBlocks(body.blocks)

  await replaceBlocks(context.env.DB, versionId, blocks)
  await publishVersion(context.env.DB, context.env.PUBLIC_CACHE, versionId)
  const schedule = await buildPublishedScheduleJson(context.env.DB, versionId)
  const discordPublished = await publishScheduleToDiscord(
    context.env.DB,
    context.env.DISCORD_SCHEDULE_WEBHOOK_URL,
    schedule,
    typeof body.portraitImageDataUrl === 'string' ? body.portraitImageDataUrl : undefined,
  )
  return json({ ok: true, count: blocks.length, discordPublished })
}
