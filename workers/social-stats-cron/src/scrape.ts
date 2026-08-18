import { BROWSER_USER_AGENT } from './constants'
import { parseAbbreviatedCount } from './parseCount'

// As três redes mais frágeis do lote — layout pode mudar, bloqueio
// anti-scraping pode aparecer a qualquer momento. Tratadas como melhor
// esforço: falha aqui nunca derruba as outras redes (ver Promise.allSettled
// em src/index.ts) nem apaga o último valor conhecido em D1.

// Instagram: og:description da página pública de perfil ainda costuma trazer
// "1,2 mi Seguidores, 200 Seguindo, 50 Publicações - ..." mesmo deslogado.
export async function fetchInstagramFollowers(username: string): Promise<number | null> {
  const res = await fetch(`https://www.instagram.com/${username}/`, {
    headers: { 'user-agent': BROWSER_USER_AGENT },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  if (!res.ok) return null

  const body = await res.text()
  const match = body.match(/<meta property="og:description" content="([\d.,]+\s*\w*)\s+[Ff]ollowers/) ??
    body.match(/<meta property="og:description" content="([\d.,]+\s*\w*)\s+[Ss]eguidores/)
  if (!match) return null

  return parseAbbreviatedCount(match[1])
}

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
