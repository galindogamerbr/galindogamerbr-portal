import type { SocialPlatform, Stats } from './d1'

// TTL alinhado ao intervalo do cron (ver [triggers] em wrangler.toml) com
// alguma folga — se uma rodada falhar, a próxima ainda teria tempo de
// renovar antes da chave expirar de vez.
const SOCIAL_STATS_CACHE_TTL_SECONDS = 1500

type CachedChannelStats = { count: number | null; postCount: number | null; fetchedAt: string }

// Grava no PUBLIC_CACHE (mesmo namespace KV que functions/lib/env.ts usa no
// Pages Functions) além do D1 (ver upsertSocialStat/upsertPostCount em
// ./d1.ts) — o endpoint público (functions/api/community-stats.ts) só lê
// esse cache pra youtube/tiktok/instagram, sem fetch síncrono às APIs
// sociais; D1 continua sendo escrito também, como registro histórico e
// fallback pra janela entre o deploy e a primeira rodada do cron.
export async function cacheSocialStats(env: { PUBLIC_CACHE: KVNamespace }, platform: SocialPlatform, stats: Stats): Promise<void> {
  const entry: CachedChannelStats = {
    count: stats.count,
    postCount: stats.postCount ?? null,
    fetchedAt: new Date().toISOString(),
  }
  await env.PUBLIC_CACHE.put(`social-stats:${platform}`, JSON.stringify(entry), { expirationTtl: SOCIAL_STATS_CACHE_TTL_SECONDS })
}
