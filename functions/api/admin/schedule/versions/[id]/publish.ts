import type { Env } from '../../../../../lib/env'
import { requireSession } from '../../../../../lib/requireSession'
import { buildPublishedScheduleJson, publishVersion } from '../../../../../lib/d1-schedule'
import { publishScheduleToDiscord } from '../../../../../lib/discord-schedule'
import { json } from '../../../../../lib/http'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const versionId = Number(context.params.id)
  await publishVersion(context.env.DB, context.env.PUBLIC_CACHE, versionId)
  const schedule = await buildPublishedScheduleJson(context.env.DB, versionId)
  const discordPublished = await publishScheduleToDiscord(
    context.env.DB,
    context.env.DISCORD_SCHEDULE_WEBHOOK_URL,
    schedule,
  )
  return json({ ok: true, discordPublished })
}
