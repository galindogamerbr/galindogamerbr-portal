import type { Env } from '../lib/env'
import { json } from '../lib/http'
import { fetchLast24hVisits } from '../lib/cfAnalytics'
import { getSiteVisitsCache, getSocialStatsCache, upsertSiteVisitsCache } from '../lib/d1-community'

// Quanto tempo o cache de visitas do site vale antes de bater de novo na
// GraphQL Analytics API da Cloudflare — não é limite de cota, é só pra não
// repetir o request pra cada visitante fazendo polling ao mesmo tempo.
const SITE_VISITS_CACHE_MINUTES = 10

async function resolveSiteVisits(env: Env): Promise<number | null> {
  const cached = await getSiteVisitsCache(env.DB)
  if (cached) {
    const ageMinutes = (Date.now() - new Date(`${cached.fetched_at}Z`).getTime()) / 60_000
    if (ageMinutes < SITE_VISITS_CACHE_MINUTES) return cached.visits_today
  }

  const fresh = await fetchLast24hVisits(env)
  if (fresh !== null) {
    await upsertSiteVisitsCache(env.DB, fresh)
    return fresh
  }
  return cached?.visits_today ?? null
}

// Seguidores por rede são só leitura de D1 — quem os popula é o worker
// separado workers/social-stats-cron (roda de hora em hora, ver README lá).
// Aqui nunca falamos com YouTube/Twitch/Discord/etc diretamente.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const [social, visitsToday] = await Promise.all([getSocialStatsCache(context.env.DB), resolveSiteVisits(context.env)])

  return json({
    social: social.map((row) => ({ platform: row.platform, count: row.count, fetchedAt: row.fetched_at })),
    siteVisits: { visitsToday },
  })
}
