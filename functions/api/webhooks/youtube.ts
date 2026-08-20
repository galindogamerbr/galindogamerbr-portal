import type { Env } from '../../lib/env'
import { extractVideoIds } from '../../lib/atom'
import { updateLiveStateFromWebhook, recordPubsubLease } from '../../lib/youtube'
import { logWarn } from '../../lib/log'

const TOPIC_URL_PREFIX = 'https://www.youtube.com/xml/feeds/videos.xml?channel_id='

// WebSub (PubSubHubbub) do YouTube — o hub (pubsubhubbub.appspot.com) manda
// esse GET pra confirmar que quem pediu a inscrição (workers/social-stats-cron,
// ver src/youtubePubsub.ts) controla mesmo essa URL, antes de começar a
// mandar notificação de verdade. Também é aqui que descobrimos o
// lease_seconds concedido de verdade (o Google costuma ignorar o valor
// pedido no POST /subscribe), pra saber quando o worker precisa renovar.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const mode = url.searchParams.get('hub.mode')
  const topic = url.searchParams.get('hub.topic')
  const challenge = url.searchParams.get('hub.challenge')
  const leaseSeconds = url.searchParams.get('hub.lease_seconds')

  const expectedTopic = `${TOPIC_URL_PREFIX}${context.env.YOUTUBE_CHANNEL_ID}`
  if ((mode !== 'subscribe' && mode !== 'unsubscribe') || topic !== expectedTopic || !challenge) {
    return new Response('Forbidden', { status: 403 })
  }

  if (mode === 'subscribe' && leaseSeconds) {
    await recordPubsubLease(context.env, Number(leaseSeconds))
  }

  return new Response(challenge, { status: 200 })
}

// Notificação de mudança (live começou/terminou, vídeo novo publicado) — o
// hub manda um Atom com o(s) vídeo(s) que mudaram. Corpo assinado com
// HMAC-SHA1 (hub.secret combinado no /subscribe, mesmo YOUTUBE_PUBSUB_SECRET
// dos dois lados) pra garantir que veio do hub de verdade, não de qualquer
// um que descobrisse essa URL.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.text()

  const signature = context.request.headers.get('x-hub-signature')
  if (!(await verifyHmacSha1(context.env.YOUTUBE_PUBSUB_SECRET, body, signature))) {
    logWarn('youtube-webhook', 'Assinatura inválida ou ausente', { hasSignature: !!signature })
    return new Response('Forbidden', { status: 403 })
  }

  const [videoId] = extractVideoIds(body)
  if (videoId) {
    context.waitUntil(updateLiveStateFromWebhook(context.env, videoId))
  }

  return new Response(null, { status: 200 })
}

async function verifyHmacSha1(secret: string, body: string, signatureHeader: string | null): Promise<boolean> {
  if (!signatureHeader?.startsWith('sha1=')) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const expectedHex = Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return expectedHex === signatureHeader.slice(5)
}
