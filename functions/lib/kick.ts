const KICK_USERNAME = 'galindogamerbr'
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

export type KickLiveStatus = { isLive: boolean; viewerCount: number | null }

// Endpoint não-oficial (o mesmo que workers/social-stats-cron usa pros
// seguidores) — o campo "livestream" vem null quando offline, e com
// is_live/viewer_count quando ao vivo. Sem auth, sem API oficial da Kick
// pra isso (a oficial nem expõe esse dado, ver README do worker).
export async function fetchKickLiveStatus(): Promise<KickLiveStatus | null> {
  const res = await fetch(`https://kick.com/api/v2/channels/${KICK_USERNAME}`, {
    headers: { 'user-agent': BROWSER_USER_AGENT },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  if (!res.ok) return null

  const data = (await res.json()) as { livestream?: { is_live?: boolean; viewer_count?: number } | null }
  if (!data.livestream) return { isLive: false, viewerCount: null }
  return { isLive: !!data.livestream.is_live, viewerCount: data.livestream.viewer_count ?? null }
}
