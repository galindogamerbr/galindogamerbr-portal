import type { Env } from './env'
import { KICK_USERNAME } from './socialConstants'
import { fetchWithTimeout } from './http'
import { logWarn, logError } from './log'

export type KickLiveStatus = { isLive: boolean; viewerCount: number | null }

// App Access Token (client_credentials) — mesmo espírito de twitch.ts, sem
// OAuth de usuário. A Kick lançou uma API oficial documentada
// (docs.kick.com) — usa ela aqui pro status ao vivo. followers_count não
// existe nessa API oficial (só o endpoint interno não-documentado tem esse
// campo, ver workers/social-stats-cron/src/scrape.ts), então seguidores
// continua vindo de lá.
async function getAppAccessToken(env: Env): Promise<string | null> {
  const res = await fetchWithTimeout('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.KICK_CLIENT_ID,
      client_secret: env.KICK_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as { access_token?: string }
  return data.access_token ?? null
}

export async function fetchKickLiveStatus(env: Env): Promise<KickLiveStatus | null> {
  try {
    const accessToken = await getAppAccessToken(env)
    if (!accessToken) {
      logWarn('kick', 'Falha ao obter access token')
      return null
    }

    const url = new URL('https://api.kick.com/public/v1/channels')
    url.searchParams.set('slug', KICK_USERNAME)

    const res = await fetchWithTimeout(url.toString(), { headers: { authorization: `Bearer ${accessToken}` } })
    if (!res.ok) {
      logWarn('kick', 'public/v1/channels retornou erro', { status: res.status })
      return null
    }

    const data = (await res.json()) as { data?: [{ stream?: { is_live?: boolean; viewer_count?: number } }] }
    const stream = data.data?.[0]?.stream
    return { isLive: !!stream?.is_live, viewerCount: stream?.viewer_count ?? null }
  } catch (err) {
    logError('kick', 'fetchKickLiveStatus falhou', { err })
    return null
  }
}
