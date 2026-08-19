import type { Env } from './env'

export type ChannelStats = { count: number | null; postCount: number | null }

const GRAPH_VERSION = 'v22.0'

// Busca ao vivo (chamado de functions/api/community-stats.ts, cache em D1
// só como fallback) usando o access_token que o worker
// (workers/social-stats-cron) já mantém renovado em D1 — sem tentar
// renovar aqui. Lê a tabela direto (sem endpoint admin — foi removido,
// ver workers/social-stats-cron/README.md).
export async function fetchInstagramStats(env: Env): Promise<ChannelStats> {
  const token = await env.DB.prepare('SELECT access_token, ig_user_id FROM instagram_token WHERE id = 1').first<{
    access_token: string
    ig_user_id: string
  }>()
  if (!token) return { count: null, postCount: null }

  const url = new URL(`https://graph.instagram.com/${GRAPH_VERSION}/${token.ig_user_id}`)
  url.searchParams.set('fields', 'followers_count,media_count')
  url.searchParams.set('access_token', token.access_token)

  const res = await fetch(url.toString())
  if (!res.ok) return { count: null, postCount: null }

  const data = (await res.json()) as { followers_count?: number; media_count?: number }
  return { count: data.followers_count ?? null, postCount: data.media_count ?? null }
}
