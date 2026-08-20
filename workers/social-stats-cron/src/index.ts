import type { Env } from './env'
import { upsertSocialStat, upsertPostCount, upsertToAllDatabases, type SocialPlatform, type Stats } from './d1'
import { cacheSocialStats } from './cache'
import { fetchYoutubeStats } from './youtube'
import { fetchTwitchFollowers } from './twitch'
import { fetchKickFollowers } from './scrape'
import { getInstagramStats } from './instagram'
import { getTiktokStats } from './tiktok'
import { KICK_USERNAME, TWITCH_LOGIN, YOUTUBE_CHANNEL_ID } from './constants'
import { renewYoutubeSubscriptionIfNeeded } from './youtubePubsub'
import { updateSiteVisitsLifetime } from './siteVisitsLifetime'
import { logWarn, logError } from './log'

// Únicas plataformas que o endpoint público lê do KV (ver
// functions/api/community-stats.ts) — twitch/kick continuam só em D1 (lidos
// direto, sem passar pelo caminho que o item 2 mudou).
const CACHED_IN_KV_PLATFORMS: SocialPlatform[] = ['youtube', 'tiktok', 'instagram']

type Fetcher = { platform: SocialPlatform; run: (env: Env) => Promise<Stats> }

// Discord não está aqui de propósito — sai ao vivo em
// functions/api/community-stats.ts (endpoint público, sem risco de cota),
// não precisa do cache de hora em hora do worker.
const FETCHERS: Fetcher[] = [
  { platform: 'youtube', run: (env) => fetchYoutubeStats(env, YOUTUBE_CHANNEL_ID) },
  { platform: 'twitch', run: async () => ({ count: await fetchTwitchFollowers(TWITCH_LOGIN) }) },
  { platform: 'instagram', run: (env) => getInstagramStats(env) },
  { platform: 'tiktok', run: (env) => getTiktokStats(env) },
  { platform: 'kick', run: async () => ({ count: await fetchKickFollowers(KICK_USERNAME) }) },
]

// Cada rede roda isolada: uma falhando (fonte fora do ar, layout mudou) não
// derruba as outras nem apaga o último valor cacheado em D1 — só pula o
// upsert daquela rede nesta rodada. postCount (YouTube/TikTok/Instagram)
// é independente de count — grava o que vier, mesmo se o outro faltar.
async function collectAll(env: Env): Promise<void> {
  await renewYoutubeSubscriptionIfNeeded(env)

  const results = await Promise.allSettled(
    FETCHERS.map(async ({ platform, run }) => {
      const stats = await run(env)
      const { count, postCount } = stats
      if (count === null) {
        logWarn('social-stats-cron', `${platform}: sem dado nesta rodada`, { platform })
      } else {
        await upsertToAllDatabases(env, (db) => upsertSocialStat(db, platform, count))
        if (CACHED_IN_KV_PLATFORMS.includes(platform)) await cacheSocialStats(env, platform, stats)
      }
      if (postCount !== undefined && postCount !== null) {
        await upsertToAllDatabases(env, (db) => upsertPostCount(db, platform, postCount))
      }
    }),
  )

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      logError('social-stats-cron', `${FETCHERS[index].platform} falhou`, { platform: FETCHERS[index].platform, reason: result.reason })
    }
  })
}

// Precisa bater exatamente com o segundo cron em wrangler.toml — domingo
// 03:00 UTC = domingo meia-noite BRT (UTC-3, sem horário de verão desde
// 2019). Gatilho fixo (não "quando já fez uma semana"), pra sempre rodar no
// mesmo horário da semana.
const LIFETIME_BACKFILL_CRON = '0 3 * * 0'

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(collectAll(env))
    if (event.cron === LIFETIME_BACKFILL_CRON) {
      ctx.waitUntil(
        updateSiteVisitsLifetime(env).catch((error) =>
          logError('social-stats-cron', 'updateSiteVisitsLifetime falhou', { error }),
        ),
      )
    }
  },
  // Gatilho manual via HTTP — CI chama isso depois de todo deploy (do site
  // ou do próprio worker, ver .github/workflows/*.yml) pra não esperar até
  // 20min pela próxima rodada agendada e já sair com o cache (PUBLIC_CACHE)
  // morno. Protegido por secret pra não deixar qualquer um forçar rodadas
  // extra à toa.
  async fetch(request, env) {
    const secret = request.headers.get('x-trigger-secret')
    if (!secret || secret !== env.CRON_TRIGGER_SECRET) {
      return new Response('Not found', { status: 404 })
    }
    // Gatilho separado (?backfillLifetimeVisits=1) pra rodar o cálculo de
    // visitas desde sempre agora, sem esperar a janela semanal normal —
    // pensado pra bootstrap único (primeira vez que a tabela é populada),
    // não faz parte do fluxo do dia a dia.
    if (new URL(request.url).searchParams.has('backfillLifetimeVisits')) {
      await updateSiteVisitsLifetime(env)
      return new Response('ok')
    }
    await collectAll(env)
    return new Response('ok')
  },
} satisfies ExportedHandler<Env>
