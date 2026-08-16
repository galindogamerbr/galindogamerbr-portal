import type { Env } from '../../lib/env'
import { extractVideoId } from '../../lib/atom'
import { resolveVideoState } from '../../lib/youtube'
import { upsertLiveState } from '../../lib/d1-live'

// Handshake de verificação do WebSub: o hub confirma a inscrição/renovação
// fazendo um GET com hub.challenge, que precisamos ecoar de volta.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const challenge = url.searchParams.get('hub.challenge')
  if (!challenge) return new Response('missing hub.challenge', { status: 400 })
  return new Response(challenge, { status: 200, headers: { 'content-type': 'text/plain' } })
}

// Notificação de push: o YouTube manda um Atom XML com o vídeo que mudou
// (publicado, atualizado ou que passou a estar ao vivo).
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const xml = await request.text()

  const videoId = extractVideoId(xml)
  if (!videoId) return new Response('ok', { status: 200 }) // notificação de exclusão ou payload inesperado — ignora

  try {
    const state = await resolveVideoState(env, videoId)
    if (state) await upsertLiveState(env.DB, state)
  } catch (err) {
    // Não derruba o webhook por causa de uma falha pontual na API do YouTube
    // — o cron de reconciliação (Fase 2, rede de segurança) cobre isso depois.
    console.error('Falha ao resolver estado do vídeo via webhook', err)
  }

  return new Response('ok', { status: 200 })
}
