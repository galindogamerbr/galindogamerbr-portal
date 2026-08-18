import type { Env } from '../../lib/env'

// Endpoint separado de functions/api/admin/instagram/callback.ts de
// propósito: esse aqui é chamado pelos servidores da Meta (verificação do
// produto Webhooks e notificações de evento), nunca pelo navegador de um
// admin logado — não pode exigir sessão. Não processamos nenhum evento de
// verdade ainda (não temos feature de responder comentário/DM), só
// implementa o handshake de verificação pra não ficar com erro no painel.
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

// A Meta manda POST pra cada notificação de evento (comentário, menção,
// etc). Como não processamos nada ainda, só confirma recebimento — sem
// isso a Meta reenvia repetidamente por até 36h.
export const onRequestPost: PagesFunction<Env> = async () => {
  return new Response(null, { status: 200 })
}
