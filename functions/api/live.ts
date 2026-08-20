import type { Env } from '../lib/env'
import { resolveChannelLiveState } from '../lib/youtube'
import { logError } from '../lib/log'
import { json } from '../lib/http'
import { withEdgeCache } from '../lib/edgeCache'

// isLive/videoId/title/thumbnailUrl/viewerCount vêm todos de
// resolveChannelLiveState, que já é cache-first no KV (ver
// functions/lib/youtube.ts) — não precisa de mais nenhum cache aqui.
export const onRequestGet: PagesFunction<Env> = async (context) =>
  // context.waitUntil passado solto (sem o context como receiver) quebra em
  // runtime — é um método nativo que exige o this original, não uma função
  // livre. O wrapper abaixo preserva o binding.
  withEdgeCache(context.request, (promise) => context.waitUntil(promise), async () => {
    // Nunca deixa uma falha aqui (timeout, exceção) derrubar o request do
    // visitante com 500/524 — todo fetch externo já tem timeout (ver
    // fetchWithTimeout em lib/http.ts), mas esse catch é o último resort.
    let state
    try {
      state = await resolveChannelLiveState(context.env)
    } catch (err) {
      logError('live', 'resolveChannelLiveState falhou', { err })
      state = null
    }
    if (!state) {
      return json({ isLive: false, videoId: null, title: null, thumbnailUrl: null, viewerCount: null }, { publicCacheSeconds: 30 })
    }

    return json(
      {
        isLive: state.isLive,
        videoId: state.videoId,
        title: state.title,
        thumbnailUrl: state.thumbnailUrl,
        viewerCount: state.viewerCount,
      },
      { publicCacheSeconds: 30 },
    )
  })
