import type { Env } from '../../lib/env'
import { getFarmWelcomeVideoId } from '../../lib/d1-farm'
import { json } from '../../lib/http'

const FALLBACK_VIDEO_ID = 'TcBrAo_A1Lc'

// Leitura pública: a página Fazenda precisa abrir o vídeo, mas só o endpoint
// /api/admin/farm/welcome-video pode trocá-lo.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const videoId = (await getFarmWelcomeVideoId(context.env.DB)) ?? FALLBACK_VIDEO_ID
  return json({ videoId })
}
