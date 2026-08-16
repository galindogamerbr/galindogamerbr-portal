import type { Env } from '../lib/env'
import { getRecentPlaylistVideos } from '../lib/youtube'
import { json } from '../lib/http'

// Playlist da série Fazenda Nova Aliança (Farming Simulator 25) — o
// carro-chefe do canal, ver src/data/games.ts. 1 em destaque + o resto
// empilhado na lateral (mais que o necessário pra sempre preencher a
// altura do card em destaque, que é mais alto por causa do texto).
const FLAGSHIP_PLAYLIST_ID = 'PLj6h86FobQUn2vIz-FSyMlL_ldV6_kzrN'

export const onRequestGet: PagesFunction<Env> = async () => {
  const videos = await getRecentPlaylistVideos(FLAGSHIP_PLAYLIST_ID, 8)
  return json({ videos })
}
