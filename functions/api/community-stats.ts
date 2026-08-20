import type { Env } from '../lib/env'
import { json } from '../lib/http'
import { fetchTodayVisits, fetchVisitsSince } from '../lib/cfAnalytics'
import { fetchTwitchLiveStatus } from '../lib/twitch'
import { fetchKickLiveStatus } from '../lib/kick'
import { fetchTiktokLiveStatus } from '../lib/tiktokLive'
import { fetchDiscordCounts } from '../lib/discord'
import { resolveChannelLiveState } from '../lib/youtube'
import { logError } from '../lib/log'
import { withEdgeCache } from '../lib/edgeCache'
import {
  getDiscordPresenceCache,
  getPostCountsCache,
  getSiteVisitsCache,
  getSiteVisitsLifetime,
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

// Checkpoint semanal escrito pelo worker (workers/social-stats-cron/src/
// siteVisitsLifetime.ts) — { total, asOf }. O site nunca escreve aqui, só
// lê e soma o intervalo desde `asOf` até agora (fetchVisitsSince), pra o
// número não ficar parado a semana inteira entre uma rodada do cron e
// outra. Esse "gap" fica cacheado 10min (mesmo espírito de
// SITE_VISITS_CACHE_MINUTES) — não é limite de cota, é só pra não repetir
// a chamada a cada visitante.
const LIFETIME_KV_KEY = 'site-visits:lifetime'
const LIFETIME_GAP_KV_KEY = 'site-visits:lifetime-gap'
const LIFETIME_GAP_CACHE_TTL_SECONDS = 600

type LifetimeCheckpoint = { total: number; asOf: string }

async function resolveLifetimeVisits(env: Env): Promise<number | null> {
  const kvCheckpoint = await env.PUBLIC_CACHE.get<LifetimeCheckpoint>(LIFETIME_KV_KEY, 'json')
  const checkpoint =
    kvCheckpoint ??
    (await getSiteVisitsLifetime(env.DB).then((row) =>
      row?.last_counted_at ? { total: row.total_visits, asOf: row.last_counted_at } : null,
    ))
  if (!checkpoint) return null

  let gap = await env.PUBLIC_CACHE.get<number>(LIFETIME_GAP_KV_KEY, 'json')
  if (gap === null) {
    gap = (await fetchVisitsSince(env, checkpoint.asOf)) ?? 0
    await env.PUBLIC_CACHE.put(LIFETIME_GAP_KV_KEY, JSON.stringify(gap), { expirationTtl: LIFETIME_GAP_CACHE_TTL_SECONDS })
  }

  return checkpoint.total + gap
}

const TWITCH_LIVE_CACHE_KEY = 'twitch:live-status'
const KICK_LIVE_CACHE_KEY = 'kick:live-status'
const TIKTOK_LIVE_CACHE_KEY = 'tiktok:live-status'
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

// TikTok, diferente de Twitch/Kick, não é gated pela live do YouTube — o
// Galindo transmite no TikTok de forma independente (não é sempre simulcast
// do evento do YouTube), então checa sempre, com cache de 90s (mesmo TTL do
// Twitch/Kick) só pra não bater no endpoint a cada request de cada
// visitante. fetchTiktokLiveStatus é uma chamada HTTP só, sem OAuth, sem
// cron externo nem worker rodando sem parar (ver functions/lib/tiktokLive.ts).
async function resolveTiktokLive(env: Env): Promise<LiveStatus> {
  const cached = await env.PUBLIC_CACHE.get<LiveStatus>(TIKTOK_LIVE_CACHE_KEY, 'json')
  if (cached) return cached

  const fresh = await fetchTiktokLiveStatus()
  if (fresh) {
    await env.PUBLIC_CACHE.put(TIKTOK_LIVE_CACHE_KEY, JSON.stringify(fresh), { expirationTtl: LIVE_STATUS_CACHE_TTL_SECONDS })
    return fresh
  }
  return { isLive: false, viewerCount: null }
}

// Twitch/Kick só têm graça mostrar "ao vivo" quando a live do YouTube (o
// evento em si) está rolando — fora disso, gasta chamada externa à toa pra
// mostrar um card que a UI ia esconder de qualquer jeito (ver
// CommunityStatsGrid, que já cai pro postCount quando isLive é false).
// resolveChannelLiveState é cache-first (ver functions/lib/youtube.ts,
// populado tanto pelo polling quanto pelo webhook do WebSub), então checar
// aqui primeiro é barato mesmo fora do cache-miss.
async function resolveYoutubeIsLive(env: Env): Promise<boolean> {
  try {
    const state = await resolveChannelLiveState(env)
    return state?.isLive ?? false
  } catch (err) {
    logError('community-stats', 'resolveChannelLiveState falhou', { err })
    return false
  }
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
    const isYoutubeLive = await resolveYoutubeIsLive(context.env)
    const noLiveStatus: LiveStatus = { isLive: false, viewerCount: null }

    const [socialCache, postCountsCache, visitsToday, lifetimeVisits, twitchLive, kickLive, tiktokLive, discordCounts] =
      await Promise.all([
        getSocialStatsCache(context.env.DB),
        getPostCountsCache(context.env.DB),
        resolveSiteVisits(context.env),
        resolveLifetimeVisits(context.env),
        isYoutubeLive ? resolveTwitchLive(context.env) : Promise.resolve(noLiveStatus),
        isYoutubeLive ? resolveKickLive(context.env) : Promise.resolve(noLiveStatus),
        resolveTiktokLive(context.env),
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
        siteVisits: { visitsToday, lifetimeVisits },
        twitchLive,
        kickLive,
        tiktokLive,
        discordOnline: discordCounts.onlineCount,
      },
      { publicCacheSeconds: 60 },
    )
  })
