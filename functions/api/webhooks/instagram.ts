import type { Env } from '../../lib/env'
import { timingSafeEqual } from '../../lib/crypto'
import { logWarn } from '../../lib/log'

// Único endpoint de Instagram no site — sem painel admin, o token de acesso
// é configurado direto como secret no worker (workers/social-stats-cron,
// ver README lá). Esse aqui é chamado pelos servidores da Meta (verificação
// do produto Webhooks e notificações de evento), nunca por um navegador —
// não pode exigir sessão. Não processamos nenhum evento de verdade ainda
// (não temos feature de responder comentário/DM), só implementa o
// handshake de verificação pra não ficar com erro no painel.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === context.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

// Corpo assinado com HMAC-SHA256 (x-hub-signature-256), chave = App Secret
// do app na Meta — confirma que a notificação veio da Meta de verdade, não
// de qualquer um que descobrisse essa URL. Só rejeita quando
// INSTAGRAM_APP_SECRET está configurado: como ainda não processamos nenhum
// evento de verdade (ver onRequestPost abaixo), não faz sentido travar o
// handshake de quem ainda não configurou esse secret — ver comentário em
// functions/lib/env.ts.
export async function verifyHmacSha256(secret: string, body: string, signatureHeader: string | null): Promise<boolean> {
  if (!signatureHeader?.startsWith('sha256=')) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const expectedHex = Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return timingSafeEqual(expectedHex, signatureHeader.slice(7))
}

// A Meta manda POST pra cada notificação de evento (comentário, menção,
// etc). Como não processamos nada ainda, só confirma recebimento — sem
// isso a Meta reenvia repetidamente por até 36h.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const secret = context.env.INSTAGRAM_APP_SECRET
  if (secret) {
    const body = await context.request.text()
    const signature = context.request.headers.get('x-hub-signature-256')
    if (!(await verifyHmacSha256(secret, body, signature))) {
      logWarn('instagram-webhook', 'Assinatura inválida ou ausente', { hasSignature: !!signature })
      return new Response('Forbidden', { status: 403 })
    }
  }

  return new Response(null, { status: 200 })
}
