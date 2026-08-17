import type { Env } from '../lib/env'
import { getRecentPlaylistVideos } from '../lib/youtube'
import { json } from '../lib/http'

// Playlist do SnowRunner — ver src/data/games.ts. Só os 2 vídeos mais
// recentes, exibidos como cards menores ao lado do destaque.
const SNOWRUNNER_PLAYLIST_ID = 'PLDv3gOgRACDY'

export const onRequestGet: PagesFunction<Env> = async () => {
  const videos = await getRecentPlaylistVideos(SNOWRUNNER_PLAYLIST_ID, 2)
  return json({ videos })
}
