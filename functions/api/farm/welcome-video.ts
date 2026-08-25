import type { Env } from '../../lib/env'
import { getFarmVideoIds } from '../../lib/d1-farm'
import { json } from '../../lib/http'

const FALLBACK_VIDEOS = { welcomeVideoId: 'tfoJW_5GJ3A', rulesVideoId: 'TcBrAo_A1Lc' }

// Leitura pública para Boas-vindas e Fazenda; somente o endpoint admin pode
// trocar as duas configurações.
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const videos = (await getFarmVideoIds(context.env.DB)) ?? FALLBACK_VIDEOS
  return json(videos)
}
