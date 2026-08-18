import { BROWSER_USER_AGENT } from './constants'

// TikTok e Kick — scraping, layout pode mudar, bloqueio anti-scraping pode
// aparecer a qualquer momento. Tratados como melhor esforço: falha aqui
// nunca derruba as outras redes (ver Promise.allSettled em src/index.ts)
// nem apaga o último valor conhecido em D1. Instagram e YouTube saíram
// daqui — usam API oficial agora (ver instagram.ts e youtube.ts).

// TikTok: a página de perfil embute o estado inicial da UI (SIGI_STATE) com
// o número exato de seguidores em "followerCount".
export async function fetchTiktokFollowers(username: string): Promise<number | null> {
  const res = await fetch(`https://www.tiktok.com/@${username}`, {
    headers: { 'user-agent': BROWSER_USER_AGENT },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  if (!res.ok) return null

  const body = await res.text()
  const match = body.match(/"followerCount":(\d+)/)
  return match ? Number(match[1]) : null
}

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
