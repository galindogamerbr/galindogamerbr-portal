// Consulta se o canal está ao vivo no TikTok agora e manda o resultado pro
// site — roda via GitHub Actions (.github/workflows/tiktok-live-poll.yml),
// não faz parte do backend (Cloudflare Workers não roda os pacotes que
// fazem essa conexão, ver README nesta pasta).
//
// TikTok não tem API oficial pra status "ao vivo"/espectadores (diferente
// de YouTube/Twitch/Kick) — usa o tiktok-live-connector (não-oficial,
// conecta no WebSocket real do TikTok LIVE) só pra ler o room info, sem
// ficar escutando eventos. Se não estiver ao vivo (ou a conexão falhar),
// manda isLive: false — o job simplesmente não rodar já é coberto pelo
// fetched_at do lado do site (nunca trava "ao vivo" preso).
import { TikTokLiveConnection } from 'tiktok-live-connector'

const UNIQUE_ID = process.env.TIKTOK_UNIQUE_ID ?? 'galindogamerbr'
const WEBHOOK_URL = process.env.TIKTOK_LIVE_WEBHOOK_URL
const WEBHOOK_SECRET = process.env.TIKTOK_LIVE_WEBHOOK_SECRET
const CONNECT_TIMEOUT_MS = 25_000

const result = { isLive: false, viewerCount: null, roomHash: null }

async function resolveLiveStatus() {
  const connection = new TikTokLiveConnection(UNIQUE_ID, {})

  try {
    const state = await Promise.race([
      connection.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), CONNECT_TIMEOUT_MS)),
    ])

    const data = state.roomInfo?.data
    // status 2 = ao vivo (visto em roomInfo.data.status durante teste manual
    // com uma live rolando de verdade).
    result.isLive = data?.status === 2
    result.viewerCount = typeof data?.user_count === 'number' ? data.user_count : null
    result.roomHash = state.roomId ?? null
  } catch (e) {
    // Canal offline ou conexão bloqueada — nos dois casos o resultado
    // correto é isLive: false (já é o valor inicial de `result`).
    console.log(`sem live agora (ou falha de conexão): ${e?.message ?? e}`)
  } finally {
    try {
      connection.disconnect()
    } catch {
      // ignora — já não tem conexão pra derrubar
    }
  }
}

async function postResult() {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-trigger-secret': WEBHOOK_SECRET },
    body: JSON.stringify(result),
  })
  console.log('webhook status:', res.status)
}

await resolveLiveStatus()
console.log('RESULT:', JSON.stringify(result))
await postResult()
