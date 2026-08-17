import type { Env } from '../lib/env'
import { getRecentPlaylistVideos } from '../lib/youtube'
import { json } from '../lib/http'

// Playlist do Dicas do Galindo — ver src/data/games.ts. Só os 2 vídeos
// mais recentes, exibidos como cards menores ao lado do destaque.
const DICAS_PLAYLIST_ID = 'PLj6h86FobQUmOBGsW2WBorqwszTEJihie'

export const onRequestGet: PagesFunction<Env> = async () => {
  const videos = await getRecentPlaylistVideos(DICAS_PLAYLIST_ID, 2)
  return json({ videos })
}
