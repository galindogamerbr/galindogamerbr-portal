import type { Env } from './env'
import { upsertSocialStat, type SocialPlatform } from './d1'
import { fetchYoutubeSubscribers } from './youtube'
import { fetchDiscordMembers } from './discord'
import { fetchTwitchFollowers } from './twitch'
import { fetchInstagramFollowers, fetchKickFollowers, fetchTiktokFollowers } from './scrape'
import {
  DISCORD_INVITE_CODE,
  INSTAGRAM_USERNAME,
  KICK_USERNAME,
  TIKTOK_USERNAME,
  TWITCH_LOGIN,
  YOUTUBE_CHANNEL_ID,
} from './constants'

type Fetcher = { platform: SocialPlatform; run: () => Promise<number | null> }

const FETCHERS: Fetcher[] = [
  { platform: 'youtube', run: () => fetchYoutubeSubscribers(YOUTUBE_CHANNEL_ID) },
  { platform: 'discord', run: () => fetchDiscordMembers(DISCORD_INVITE_CODE) },
  { platform: 'twitch', run: () => fetchTwitchFollowers(TWITCH_LOGIN) },
  { platform: 'instagram', run: () => fetchInstagramFollowers(INSTAGRAM_USERNAME) },
  { platform: 'tiktok', run: () => fetchTiktokFollowers(TIKTOK_USERNAME) },
  { platform: 'kick', run: () => fetchKickFollowers(KICK_USERNAME) },
]

// Cada rede roda isolada: uma falhando (fonte fora do ar, layout mudou) não
// derruba as outras nem apaga o último valor cacheado em D1 — só pula o
// upsert daquela rede nesta rodada.
async function collectAll(env: Env): Promise<void> {
  const results = await Promise.allSettled(
    FETCHERS.map(async ({ platform, run }) => {
      const count = await run()
      if (count === null) {
        console.warn(`[social-stats-cron] ${platform}: sem dado nesta rodada`)
        return
      }
      await upsertSocialStat(env.DB, platform, count)
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
