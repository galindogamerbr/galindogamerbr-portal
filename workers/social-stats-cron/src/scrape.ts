import { BROWSER_USER_AGENT } from './constants'

// Kick — scraping, layout pode mudar, bloqueio anti-scraping pode aparecer
// a qualquer momento. Tratado como melhor esforço: falha aqui nunca
// derruba as outras redes (ver Promise.allSettled em src/index.ts) nem
// apaga o último valor conhecido em D1. Instagram, YouTube e TikTok saíram
// daqui — usam API oficial agora (ver instagram.ts, youtube.ts, tiktok.ts).

// Kick: endpoint JSON que o próprio site usa pra montar a página do canal —
// não documentado oficialmente, sem auth.
export async function fetchKickFollowers(username: string): Promise<number | null> {
  const res = await fetch(`https://kick.com/api/v2/channels/${username}`, {
    headers: { 'user-agent': BROWSER_USER_AGENT },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  if (!res.ok) return null

  const data = (await res.json()) as { followers_count?: string | number }
  if (data.followers_count === undefined) return null
  const count = Number(data.followers_count)
  return Number.isNaN(count) ? null : count
}
