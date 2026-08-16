import type { Env } from './env'

const HUB_URL = 'https://pubsubhubbub.appspot.com/subscribe'

export function feedTopicUrl(channelId: string): string {
  return `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`
}

export function callbackUrl(env: Env): string {
  return `${env.PUBLIC_BASE_URL}/api/webhooks/youtube`
}

// Inscreve (ou renova) a assinatura WebSub do canal — precisa de uma
// PUBLIC_BASE_URL alcançável pela internet, então só funciona pós-deploy.
// O hub confirma via GET no callback (ver functions/api/webhooks/youtube.ts).
export async function subscribe(env: Env): Promise<void> {
  const body = new URLSearchParams({
    'hub.mode': 'subscribe',
    'hub.topic': feedTopicUrl(env.YOUTUBE_CHANNEL_ID),
    'hub.callback': callbackUrl(env),
    'hub.lease_seconds': '432000', // 5 dias — o máximo que o hub do YouTube costuma conceder
    'hub.verify': 'async',
  })

  const res = await fetch(HUB_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    throw new Error(`Falha ao inscrever no WebSub: ${res.status}`)
  }
}
