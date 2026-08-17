import type { Env } from '../lib/env'
import { getRecentPlaylistVideos } from '../lib/youtube'
import { json } from '../lib/http'
import { getFlagshipVideoCache, upsertFlagshipVideoCache } from '../lib/d1'

// Playlist da série Fazenda Nova Aliança (Farming Simulator 25) — o
// carro-chefe do canal, ver src/data/games.ts. 1 em destaque + o resto
// empilhado na lateral (mais que o necessário pra sempre preencher a
// altura do card em destaque, que é mais alto por causa do texto).
const FLAGSHIP_PLAYLIST_ID = 'PLj6h86FobQUn2vIz-FSyMlL_ldV6_kzrN'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const videos = await getRecentPlaylistVideos(FLAGSHIP_PLAYLIST_ID, 7)

  if (videos.length > 0) {
    // Salva o mais recente em D1 só quando muda — serve de fallback se a
    // busca ao vivo falhar numa próxima request (feed do YouTube fora do
    // ar, etc.), em vez de cair numa imagem estática genérica.
    const latest = videos[0]
    const cached = await getFlagshipVideoCache(context.env.DB)
    if (!cached || cached.video_id !== latest.videoId) {
      await upsertFlagshipVideoCache(context.env.DB, {
        videoId: latest.videoId,
        title: latest.title,
        thumbnailUrl: latest.thumbnailUrl,
      })
    }
    return json({ videos })
  }

  const cached = await getFlagshipVideoCache(context.env.DB)
  if (cached) {
    return json({ videos: [{ videoId: cached.video_id, title: cached.title, thumbnailUrl: cached.thumbnail_url }] })
  }
  return json({ videos: [] })
}
