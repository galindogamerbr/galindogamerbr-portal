import { fetchWithTimeout } from './http'
import { logWarn, logError } from './log'
import { BROWSER_USER_AGENT, TIKTOK_USERNAME } from './socialConstants'

export type TiktokLiveStatus = { isLive: boolean; viewerCount: number | null }

type TiktokRoomResponse = {
  data?: {
    liveRoom?: {
      status?: number
      liveRoomStats?: { userCount?: number }
    }
  }
}

// Endpoint interno (não documentado) do TikTok, usado pelo próprio site/app
// pra checar se um criador está ao vivo — mesmo espírito do scrape de
// /channel/{id}/live do YouTube (ver resolveChannelLiveState em youtube.ts):
// sem autenticação, uma chamada HTTP só. status:2 em data.liveRoom = ao vivo
// agora; liveRoomStats.userCount já vem nessa mesma resposta, então dá pra
// pegar o viewer count com uma consulta pontual, sem manter conexão
// WebSocket aberta (diferente de libs tipo TikTok-Live-Connector, feitas
// pra receber eventos em tempo real — não é o que precisamos aqui, só um
// snapshot). Já existiu uma versão disso com cron externo + webhook + tabela
// no D1 (removida por complexidade demais pra esse dado, ver commit
// "Remove infra do TikTok live") — essa aqui é só uma chamada, sem infra.
export async function fetchTiktokLiveStatus(): Promise<TiktokLiveStatus | null> {
  try {
    const res = await fetchWithTimeout(
      `https://www.tiktok.com/api-live/user/room/?aid=1988&sourceType=54&uniqueId=${TIKTOK_USERNAME}`,
      { headers: { 'user-agent': BROWSER_USER_AGENT } },
    )
    if (!res.ok) {
      logWarn('tiktokLive', 'endpoint retornou erro', { status: res.status })
      return null
    }

    const data = (await res.json()) as TiktokRoomResponse
    const room = data.data?.liveRoom
    const isLive = room?.status === 2
    return { isLive, viewerCount: isLive ? (room?.liveRoomStats?.userCount ?? null) : null }
  } catch (err) {
    logError('tiktokLive', 'fetchTiktokLiveStatus falhou', { err })
    return null
  }
}
