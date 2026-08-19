import type { Env } from '../lib/env'
import { json } from '../lib/http'
import { fetchTodayVisits } from '../lib/cfAnalytics'
import { fetchTwitchLiveStatus } from '../lib/twitch'
import { fetchKickLiveStatus } from '../lib/kick'
import { fetchDiscordCounts } from '../lib/discord'
import {
  getDiscordPresenceCache,
  getKickLiveCache,
  getSiteVisitsCache,
  getSocialStatsCache,
  getTwitchLiveCache,
  upsertDiscordPresenceCache,
  upsertKickLiveCache,
  upsertSiteVisitsCache,
  upsertTwitchLiveCache,
} from '../lib/d1-community'

// Cache de visitas do site: não é limite de cota, é só pra não repetir o
// request pra cada visitante fazendo polling ao mesmo tempo (10min de
// validade). Twitch/Kick/Discord são diferentes: sem risco de cota, então
// sempre busca fresco — o cache aí é só um fallback pra quando a chamada
// falhar.
const SITE_VISITS_CACHE_MINUTES = 10

type LiveStatus = { isLive: boolean; viewerCount: number | null }

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

async function resolveTwitchLive(env: Env): Promise<LiveStatus> {
  const fresh = await fetchTwitchLiveStatus(env)
  if (fresh) {
    await upsertTwitchLiveCache(env.DB, fresh)
    return fresh
  }
  const cached = await getTwitchLiveCache(env.DB)
  return cached ? { isLive: cached.is_live === 1, viewerCount: cached.viewer_count } : { isLive: false, viewerCount: null }
}

async function resolveKickLive(env: Env): Promise<LiveStatus> {
  const fresh = await fetchKickLiveStatus(env)
  if (fresh) {
    await upsertKickLiveCache(env.DB, fresh)
    return fresh
  }
  const cached = await getKickLiveCache(env.DB)
  return cached ? { isLive: cached.is_live === 1, viewerCount: cached.viewer_count } : { isLive: false, viewerCount: null }
}

type DiscordCounts = { memberCount: number | null; onlineCount: number | null }

// Discord não passa pelo worker (workers/social-stats-cron) — o endpoint
// público de convite devolve membros totais e online numa chamada só, sem
// risco de cota, então busca sempre fresco aqui; cache só como fallback.
async function resolveDiscordCounts(env: Env): Promise<DiscordCounts> {
  const fresh = await fetchDiscordCounts()
  if (fresh) {
    await upsertDiscordPresenceCache(env.DB, { onlineCount: fresh.onlineCount ?? 0, memberCount: fresh.memberCount })
    return fresh
  }
  const cached = await getDiscordPresenceCache(env.DB)
  return { memberCount: cached?.member_count ?? null, onlineCount: cached?.online_count ?? null }
}

// Seguidores das outras redes são só leitura de D1 — quem os popula é o
// worker separado workers/social-stats-cron (roda de hora em hora, ver
// README lá). Aqui nunca falamos com YouTube/TikTok/Instagram direto,
// exceto Twitch/Kick live e Discord (mais voláteis, cada um com seu próprio
// cache curto/fallback) e visitas do site.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const [social, visitsToday, twitchLive, kickLive, discordCounts] = await Promise.all([
    getSocialStatsCache(context.env.DB),
    resolveSiteVisits(context.env),
    resolveTwitchLive(context.env),
    resolveKickLive(context.env),
    resolveDiscordCounts(context.env),
  ])

  return json({
    social: social.map((row) => ({
      platform: row.platform,
      count: row.platform === 'discord' && discordCounts.memberCount !== null ? discordCounts.memberCount : row.count,
      fetchedAt: row.fetched_at,
    })),
    siteVisits: { visitsToday },
    twitchLive,
    kickLive,
    discordOnline: discordCounts.onlineCount,
  })
}
