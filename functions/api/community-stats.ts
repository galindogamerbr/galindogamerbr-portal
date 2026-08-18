import type { Env } from '../lib/env'
import { json } from '../lib/http'
import { fetchTodayVisits } from '../lib/cfAnalytics'
import { fetchTwitchLiveStatus } from '../lib/twitch'
import {
  getSiteVisitsCache,
  getSocialStatsCache,
  getTwitchLiveCache,
  upsertSiteVisitsCache,
  upsertTwitchLiveCache,
} from '../lib/d1-community'

// Quanto tempo os caches de visitas do site e de live da Twitch valem antes
// de bater de novo nas APIs externas — não é limite de cota, é só pra não
// repetir o request pra cada visitante fazendo polling ao mesmo tempo.
const SITE_VISITS_CACHE_MINUTES = 10
const TWITCH_LIVE_CACHE_MINUTES = 3

async function resolveSiteVisits(env: Env): Promise<number | null> {
  const cached = await getSiteVisitsCache(env.DB)
  if (cached) {
    const ageMinutes = (Date.now() - new Date(`${cached.fetched_at}Z`).getTime()) / 60_000
    if (ageMinutes < SITE_VISITS_CACHE_MINUTES) return cached.visits_today
  }

  const fresh = await fetchTodayVisits(env)
  if (fresh !== null) {
    await upsertSiteVisitsCache(env.DB, fresh)
    return fresh
  }
  return cached?.visits_today ?? null
}

async function resolveTwitchLive(env: Env): Promise<{ isLive: boolean; viewerCount: number | null }> {
  const cached = await getTwitchLiveCache(env.DB)
  if (cached) {
    const ageMinutes = (Date.now() - new Date(`${cached.fetched_at}Z`).getTime()) / 60_000
    if (ageMinutes < TWITCH_LIVE_CACHE_MINUTES) return { isLive: cached.is_live === 1, viewerCount: cached.viewer_count }
  }

  const fresh = await fetchTwitchLiveStatus(env)
  if (fresh) {
    await upsertTwitchLiveCache(env.DB, fresh)
    return fresh
  }
  return cached ? { isLive: cached.is_live === 1, viewerCount: cached.viewer_count } : { isLive: false, viewerCount: null }
}

// Seguidores por rede são só leitura de D1 — quem os popula é o worker
// separado workers/social-stats-cron (roda de hora em hora, ver README lá).
// Aqui nunca falamos com YouTube/Discord/etc diretamente, exceto Twitch
// live (mais volátil, tem seu próprio cache curto) e visitas do site.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const [social, visitsToday, twitchLive] = await Promise.all([
    getSocialStatsCache(context.env.DB),
    resolveSiteVisits(context.env),
    resolveTwitchLive(context.env),
  ])

  return json({
    social: social.map((row) => ({ platform: row.platform, count: row.count, fetchedAt: row.fetched_at })),
    siteVisits: { visitsToday },
    twitchLive,
  })
}
