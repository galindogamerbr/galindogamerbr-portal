import type { Env } from './env'
import { upsertSocialStat, upsertPostCount, type SocialPlatform, type Stats } from './d1'
import { fetchYoutubeStats } from './youtube'
import { fetchTwitchFollowers } from './twitch'
import { fetchKickFollowers } from './scrape'
import { getInstagramStats } from './instagram'
import { getTiktokStats } from './tiktok'
import { KICK_USERNAME, TWITCH_LOGIN, YOUTUBE_CHANNEL_ID } from './constants'

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
  const results = await Promise.allSettled(
    FETCHERS.map(async ({ platform, run }) => {
      const { count, postCount } = await run(env)
      if (count === null) {
        console.warn(`[social-stats-cron] ${platform}: sem dado nesta rodada`)
      } else {
        await upsertSocialStat(env.DB, platform, count)
      }
      if (postCount !== undefined && postCount !== null) {
        await upsertPostCount(env.DB, platform, postCount)
      }
    }),
  )

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`[social-stats-cron] ${FETCHERS[index].platform} falhou:`, result.reason)
    }
  })
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(collectAll(env))
  },
} satisfies ExportedHandler<Env>
