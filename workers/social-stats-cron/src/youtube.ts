import type { Env } from './env'
import type { Stats } from './d1'

// YouTube Data API v3 — número exato de inscritos, sem precisar parsear
// texto abreviado ("1,2 mi de inscritos") como o scraping fazia antes.
// Precisa de YOUTUBE_API_KEY (cota gratuita generosa: 10.000 unidades/dia,
// essa chamada custa 1 unidade por rodada). videoCount vem de graça na
// mesma chamada, sem custo extra de cota.
export async function fetchYoutubeStats(env: Env, channelId: string): Promise<Stats> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${env.YOUTUBE_API_KEY}`
  const res = await fetch(url)
  if (!res.ok) return { count: null }

  const data = (await res.json()) as { items?: [{ statistics?: { subscriberCount?: string; videoCount?: string } }] }
  const stats = data.items?.[0]?.statistics
  return {
    count: stats?.subscriberCount ? Number(stats.subscriberCount) : null,
    postCount: stats?.videoCount ? Number(stats.videoCount) : null,
  }
}
