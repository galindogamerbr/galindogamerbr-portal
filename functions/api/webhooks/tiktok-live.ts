import type { Env } from '../../lib/env'
import { upsertTiktokLiveCache } from '../../lib/d1-community'
import { json } from '../../lib/http'

// Chamado só pelo job externo em scripts/tiktok-live-poll (GitHub Actions,
// roda o tiktok-live-connector de verdade — o TikTok não tem API oficial
// pra status "ao vivo"/espectadores, e o Worker não consegue conectar nesse
// WebSocket sozinho). Protegido pelo mesmo esquema de secret que
// workers/social-stats-cron já usa (x-trigger-secret).
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const secret = context.request.headers.get('x-trigger-secret')
  if (!secret || secret !== context.env.TIKTOK_LIVE_WEBHOOK_SECRET) {
    return new Response('Not found', { status: 404 })
  }

  let body: { isLive?: unknown; viewerCount?: unknown; roomHash?: unknown } = {}
  try {
    body = await context.request.json()
  } catch {
    return json({ ok: false }, { status: 400 })
  }

  await upsertTiktokLiveCache(context.env.DB, {
    isLive: body.isLive === true,
    viewerCount: typeof body.viewerCount === 'number' ? body.viewerCount : null,
    roomHash: typeof body.roomHash === 'string' ? body.roomHash : null,
  })

  return json({ ok: true })
}
