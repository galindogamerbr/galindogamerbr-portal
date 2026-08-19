import type { Env } from '../lib/env'
import { buildPublishedScheduleJson, getPublishedVersion, PUBLISHED_SCHEDULE_CACHE_KEY, type PublishedSchedule } from '../lib/d1-schedule'
import { json } from '../lib/http'

// Público — consumido pela página /programacao e pelo teaser da Home.
// Lê direto do KV (escrito no publish, ver publishVersion em
// lib/d1-schedule.ts) — só cai pro D1 se a chave ainda não existir (deploy
// novo, antes de qualquer publish ter acontecido depois dele).
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cached = await context.env.PUBLIC_CACHE.get<PublishedSchedule>(PUBLISHED_SCHEDULE_CACHE_KEY, 'json')
  if (cached) return json(cached, { publicCacheSeconds: 30 })

  const version = await getPublishedVersion(context.env.DB)
  if (!version) return json({ label: null, cycleLength: 0, weeks: [] }, { publicCacheSeconds: 30 })

  const publishedJson = await buildPublishedScheduleJson(context.env.DB, version.id)
  return json(publishedJson, { publicCacheSeconds: 30 })
}
