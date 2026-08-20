import type { Env } from '../lib/env'
import { json } from '../lib/http'
import { fetchTodayVisits } from '../lib/cfAnalytics'
import { fetchTwitchLiveStatus } from '../lib/twitch'
import { fetchKickLiveStatus } from '../lib/kick'
import { fetchDiscordCounts } from '../lib/discord'
import { withEdgeCache } from '../lib/edgeCache'
import {
  getDiscordPresenceCache,
  getPostCountsCache,
  getSiteVisitsCache,
  getSocialStatsCache,
  upsertDiscordPresenceCache,
  upsertSiteVisitsCache,
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

const TWITCH_LIVE_CACHE_KEY = 'twitch:live-status'
const KICK_LIVE_CACHE_KEY = 'kick:live-status'
const LIVE_STATUS_CACHE_TTL_SECONDS = 90

async function resolveTwitchLive(env: Env): Promise<LiveStatus> {
  const cached = await env.PUBLIC_CACHE.get<LiveStatus>(TWITCH_LIVE_CACHE_KEY, 'json')
  if (cached) return cached

  const fresh = await fetchTwitchLiveStatus(env)
  if (fresh) {
    await env.PUBLIC_CACHE.put(TWITCH_LIVE_CACHE_KEY, JSON.stringify(fresh), { expirationTtl: LIVE_STATUS_CACHE_TTL_SECONDS })
    return fresh
  }
  return { isLive: false, viewerCount: null }
}

async function resolveKickLive(env: Env): Promise<LiveStatus> {
  const cached = await env.PUBLIC_CACHE.get<LiveStatus>(KICK_LIVE_CACHE_KEY, 'json')
  if (cached) return cached

  const fresh = await fetchKickLiveStatus(env)
  if (fresh) {
    await env.PUBLIC_CACHE.put(KICK_LIVE_CACHE_KEY, JSON.stringify(fresh), { expirationTtl: LIVE_STATUS_CACHE_TTL_SECONDS })
    return fresh
  }
  return { isLive: false, viewerCount: null }
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

type CachedChannelStats = { count: number | null; postCount: number | null; fetchedAt: string }

const SOCIAL_STATS_CACHE_KEY_PREFIX = 'social-stats:'

// YouTube/TikTok/Instagram: nunca busca fresco aqui — quem faz isso é o
// worker workers/social-stats-cron, de hora em hora, escrevendo tanto no KV
// (PUBLIC_CACHE, TTL ~25min) quanto no D1. Esse endpoint só lê: KV primeiro
// (caminho quente), D1 como fallback só pra cobrir a janela entre o deploy
// e a primeira rodada do cron (quando o KV ainda não foi populado).
async function resolveChannelStatsFromCache(
  env: Env,
  platform: SocialPlatform,
  cachedCount: number | undefined,
  cachedPostCount: number | undefined,
  cachedFetchedAt: string | undefined,
): Promise<{ count: number | undefined; postCount: number | undefined; fetchedAt: string | undefined }> {
  const kvEntry = await env.PUBLIC_CACHE.get<CachedChannelStats>(`${SOCIAL_STATS_CACHE_KEY_PREFIX}${platform}`, 'json')
  if (!kvEntry) return { count: cachedCount, postCount: cachedPostCount, fetchedAt: cachedFetchedAt }
  return {
    count: kvEntry.count ?? cachedCount,
    postCount: kvEntry.postCount ?? cachedPostCount,
    fetchedAt: kvEntry.fetchedAt ?? cachedFetchedAt,
  }
}

type ResolvedChannelStats = { count: number | undefined; postCount: number | undefined; fetchedAt: string | undefined }

export const onRequestGet: PagesFunction<Env> = async (context) =>
  // context.waitUntil passado solto (sem o context como receiver) quebra em
  // runtime — é um método nativo que exige o this original, não uma função
  // livre. O wrapper abaixo preserva o binding.
  withEdgeCache(context.request, (promise) => context.waitUntil(promise), async () => {
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
      resolveChannelStatsFromCache(
        context.env,
        'youtube',
        countByPlatform.get('youtube'),
        postCountByPlatform.get('youtube'),
        fetchedAtByPlatform.get('youtube'),
      ),
      resolveChannelStatsFromCache(
        context.env,
        'tiktok',
        countByPlatform.get('tiktok'),
        postCountByPlatform.get('tiktok'),
        fetchedAtByPlatform.get('tiktok'),
      ),
      resolveChannelStatsFromCache(
        context.env,
        'instagram',
        countByPlatform.get('instagram'),
        postCountByPlatform.get('instagram'),
        fetchedAtByPlatform.get('instagram'),
      ),
    ])

    const liveResolved: Partial<Record<SocialPlatform, ResolvedChannelStats>> = {
      youtube,
      tiktok,
      instagram,
      discord: { count: discordCounts.memberCount ?? undefined, postCount: undefined, fetchedAt: undefined },
    }

    const platforms: SocialPlatform[] = ['youtube', 'tiktok', 'instagram', 'twitch', 'kick', 'discord']
    const postCounts: Partial<Record<SocialPlatform, number>> = {}
    for (const platform of platforms) {
      const postCount = liveResolved[platform]?.postCount ?? postCountByPlatform.get(platform)
      if (postCount !== undefined) postCounts[platform] = postCount
    }

    return json(
      {
        social: platforms
          .map((platform) => ({
            platform,
            count: liveResolved[platform]?.count ?? countByPlatform.get(platform),
            fetchedAt: liveResolved[platform]?.fetchedAt ?? fetchedAtByPlatform.get(platform) ?? null,
          }))
          .filter((row): row is { platform: SocialPlatform; count: number; fetchedAt: string | null } => row.count !== undefined),
        postCounts,
        siteVisits: { visitsToday },
        twitchLive,
        kickLive,
        discordOnline: discordCounts.onlineCount,
      },
      { publicCacheSeconds: 60 },
    )
  })
