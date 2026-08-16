import type { Env } from '../../lib/env'
import { getLatestUploadedVideoId, resolveVideoState } from '../../lib/youtube'
import { upsertLiveState } from '../../lib/d1-live'
import { json } from '../../lib/http'

// Rede de segurança do WebSub — chamado periodicamente por fora (ex: um
// cron do GitHub Actions batendo aqui, reaproveitando o padrão que o site
// atual já usa em .github/workflows/update-live.yml, só que mais espaçado
// já que o WebSub cobre o caso comum). Protegido por secret compartilhado,
// não por sessão de admin, porque quem chama é uma máquina, não uma pessoa.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  if (request.headers.get('x-internal-secret') !== env.INTERNAL_API_SECRET) {
    return json({ error: 'unauthorized' }, { status: 401 })
  }

  const videoId = await getLatestUploadedVideoId(env)
  if (!videoId) return json({ ok: false, reason: 'no_video_found' })

  const state = await resolveVideoState(env, videoId)
  if (!state) return json({ ok: false, reason: 'video_not_resolved' })

  await upsertLiveState(env.DB, state)
  return json({ ok: true, videoId: state.videoId, isLive: state.isLive })
}
