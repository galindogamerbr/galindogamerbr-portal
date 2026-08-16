import type { Env } from '../../../lib/env'
import { requireSession } from '../../../lib/requireSession'
import { createVersion, listVersions } from '../../../lib/d1-schedule'
import { json } from '../../../lib/http'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const versions = await listVersions(context.env.DB)
  return json({
    versions: versions.map((v) => ({
      id: v.id,
      label: v.label,
      cycleLength: v.cycle_length,
      isPublished: v.is_published === 1,
      createdAt: v.created_at,
    })),
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const email = await requireSession(context.request, context.env)
  if (!email) return json({ error: 'unauthorized' }, { status: 401 })

  const body = (await context.request.json()) as { label?: unknown; cycleLength?: unknown }
  const label = typeof body.label === 'string' && body.label.trim() ? body.label.trim() : 'Nova programação'
  const cycleLength = typeof body.cycleLength === 'number' && body.cycleLength > 0 ? Math.floor(body.cycleLength) : 2

  const id = await createVersion(context.env.DB, { label, cycleLength, createdBy: email })
  return json({ id }, { status: 201 })
}
