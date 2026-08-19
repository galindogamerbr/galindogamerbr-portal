import type { Env } from '../lib/env'
import { json } from '../lib/http'
import { fetchTodayVisits } from '../lib/cfAnalytics'
import { fetchTwitchLiveStatus } from '../lib/twitch'
import { fetchKickLiveStatus } from '../lib/kick'
import { fetchDiscordCounts } from '../lib/discord'
import { fetchYoutubeStats } from '../lib/youtube'
import { fetchTiktokStats } from '../lib/tiktok'
import { fetchInstagramStats } from '../lib/instagram'
import {
  getDiscordPresenceCache,
  getKickLiveCache,
  getPostCountsCache,
  getSiteVisitsCache,
  getSocialStatsCache,
  getTwitchLiveCache,
  upsertDiscordPresenceCache,
  upsertKickLiveCache,
  upsertPostCount,
  upsertSiteVisitsCache,
  upsertSocialStat,
  upsertTwitchLiveCache,
  type SocialPlatform,
} from '../lib/d1-community'

// Cache de visitas do site: não é limite de cota, é só pra não repetir o
// request pra cada visitante fazendo polling ao mesmo tempo (10min de
// validade). As demais buscas ao vivo desta página são diferentes: sem
// risco de cota/renovação, então sempre buscam fresco — o cache aí é só
// um fallback pra quando a chamada falhar.
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

type ChannelStats = { count: number | null; postCount: number | null }

// YouTube/TikTok/Instagram: busca sempre fresco (usa a API key/token que já
// está configurado — sem tentar renovar nada aqui, isso é trabalho do
// worker workers/social-stats-cron de hora em hora), grava em D1 a cada
// sucesso, e cai no cache (populado pelo worker ou por uma chamada anterior
// desta função) quando a chamada falhar por qualquer motivo — token
// vencido nesse meio-tempo, rate limit, API fora do ar, etc.
async function resolveChannelStats(
  env: Env,
  platform: SocialPlatform,
  fetchStats: (env: Env) => Promise<ChannelStats>,
  cachedCount: number | undefined,
  cachedPostCount: number | undefined,
): Promise<{ count: number | undefined; postCount: number | undefined }> {
  const fresh = await fetchStats(env)
  if (fresh.count !== null) await upsertSocialStat(env.DB, platform, fresh.count)
  if (fresh.postCount !== null) await upsertPostCount(env.DB, platform, fresh.postCount)
  return {
    count: fresh.count ?? cachedCount,
    postCount: fresh.postCount ?? cachedPostCount,
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const [socialCache, postCountsCache, visitsToday, twitchLive, kickLive, discordCounts] = await Promise.all([
    getSocialStatsCache(context.env.DB),
    getPostCountsCache(context.env.DB),
    resolveSiteVisits(context.env),
    resolveTwitchLive(context.env),
    resolveKickLive(context.env),
    resolveDiscordCounts(context.env),
  ])

  const countByPlatform = new Map(socialCache.map((row) => [row.platform, row.count]))
  const postCountByPlatform = new Map(postCountsCache.map((row) => [row.platform, row.count]))
  const fetchedAtByPlatform = new Map(socialCache.map((row) => [row.platform, row.fetched_at]))

  const [youtube, tiktok, instagram] = await Promise.all([
    resolveChannelStats(context.env, 'youtube', fetchYoutubeStats, countByPlatform.get('youtube'), postCountByPlatform.get('youtube')),
    resolveChannelStats(context.env, 'tiktok', fetchTiktokStats, countByPlatform.get('tiktok'), postCountByPlatform.get('tiktok')),
    resolveChannelStats(
      context.env,
      'instagram',
      fetchInstagramStats,
      countByPlatform.get('instagram'),
      postCountByPlatform.get('instagram'),
    ),
  ])

  const liveResolved: Partial<Record<SocialPlatform, { count: number | undefined; postCount: number | undefined }>> = {
    youtube,
    tiktok,
    instagram,
    discord: { count: discordCounts.memberCount ?? undefined, postCount: undefined },
  }

  const platforms: SocialPlatform[] = ['youtube', 'tiktok', 'instagram', 'twitch', 'kick', 'discord']
  const postCounts: Partial<Record<SocialPlatform, number>> = {}
  for (const platform of platforms) {
    const postCount = liveResolved[platform]?.postCount ?? postCountByPlatform.get(platform)
    if (postCount !== undefined) postCounts[platform] = postCount
  }

  return json({
    social: platforms
      .map((platform) => ({
        platform,
        count: liveResolved[platform]?.count ?? countByPlatform.get(platform),
        fetchedAt: fetchedAtByPlatform.get(platform) ?? null,
      }))
      .filter((row): row is { platform: SocialPlatform; count: number; fetchedAt: string | null } => row.count !== undefined),
    postCounts,
    siteVisits: { visitsToday },
    twitchLive,
    kickLive,
    discordOnline: discordCounts.onlineCount,
  })
}
