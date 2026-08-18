import type { Env } from './env'

// YouTube Data API v3 — número exato de inscritos, sem precisar parsear
// texto abreviado ("1,2 mi de inscritos") como o scraping fazia antes.
// Precisa de YOUTUBE_API_KEY (cota gratuita generosa: 10.000 unidades/dia,
// essa chamada custa 1 unidade por rodada).
export async function fetchYoutubeSubscribers(env: Env, channelId: string): Promise<number | null> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${env.YOUTUBE_API_KEY}`
  const res = await fetch(url)
  if (!res.ok) return null

  const data = (await res.json()) as { items?: [{ statistics?: { subscriberCount?: string } }] }
  const raw = data.items?.[0]?.statistics?.subscriberCount
  return raw ? Number(raw) : null
}
