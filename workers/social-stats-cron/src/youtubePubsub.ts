import type { Env } from './env'
import { YOUTUBE_CHANNEL_ID } from './constants'
import { logError } from './log'

const HUB_URL = 'https://pubsubhubbub.appspot.com/subscribe'
const TOPIC_URL = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`
const CALLBACK_URL = 'https://galindogamerbr.com.br/api/webhooks/youtube'

// Mesma chave que functions/lib/youtube.ts usa pra gravar o lease_seconds de
// verdade concedido pelo hub (ver recordPubsubLease, chamado a partir do GET
// de verificação em functions/api/webhooks/youtube.ts) — esse worker só lê.
const LEASE_CACHE_KEY = 'youtube:pubsub-lease'

// Renova com folga — o hub costuma conceder ~5 dias mesmo pedindo mais, e
// esse worker só roda a cada 20min, então checar bem antes do vencimento
// evita qualquer janela sem inscrição ativa.
const RENEW_MARGIN_MS = 24 * 60 * 60 * 1000

type LeaseState = { expiresAt: number }

// Inscrição WebSub do canal no hub do YouTube — sem isso, a única forma de
// saber que uma live começou/terminou é o polling em
// functions/lib/youtube.ts (até 60s de atraso). Gatilho simples, "feliz no
// simples": nenhum worker/cron novo, só mais um passo dentro do ciclo que já
// existe, gated pelo KV pra não bater no hub sem necessidade a cada 20min.
export async function renewYoutubeSubscriptionIfNeeded(env: Env): Promise<void> {
  const lease = await env.PUBLIC_CACHE.get<LeaseState>(LEASE_CACHE_KEY, 'json')
  if (lease && lease.expiresAt - Date.now() > RENEW_MARGIN_MS) return

  const body = new URLSearchParams({
    'hub.callback': CALLBACK_URL,
    'hub.topic': TOPIC_URL,
    'hub.mode': 'subscribe',
    'hub.verify': 'async',
    'hub.secret': env.YOUTUBE_PUBSUB_SECRET,
    'hub.lease_seconds': '828000',
  })

  try {
    const res = await fetch(HUB_URL, { method: 'POST', body })
    if (!res.ok) logError('youtube-pubsub', 'Inscrição WebSub recusada pelo hub', { status: res.status })
  } catch (error) {
    logError('youtube-pubsub', 'Falha ao chamar o hub WebSub', { error })
  }
}
