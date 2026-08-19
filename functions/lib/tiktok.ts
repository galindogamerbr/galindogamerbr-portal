import type { Env } from './env'
import { getTiktokToken } from './d1-tiktok'

export type ChannelStats = { count: number | null; postCount: number | null }

// Busca ao vivo (chamado de functions/api/community-stats.ts, cache em D1
// só como fallback) usando o access_token que já está salvo — sem tentar
// renovar aqui (isso é trabalho do worker workers/social-stats-cron, de
// hora em hora). Se o token tiver expirado nesse meio-tempo, essa chamada
// simplesmente falha e cai no fallback; a próxima rodada do worker resolve.
export async function fetchTiktokStats(env: Env): Promise<ChannelStats> {
  const token = await getTiktokToken(env.DB)
  if (!token) return { count: null, postCount: null }

  const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=follower_count,video_count', {
    headers: { authorization: `Bearer ${token.access_token}` },
  })
  if (!res.ok) return { count: null, postCount: null }

  const data = (await res.json()) as { data?: { user?: { follower_count?: number; video_count?: number } } }
  return {
    count: data.data?.user?.follower_count ?? null,
    postCount: data.data?.user?.video_count ?? null,
  }
}
