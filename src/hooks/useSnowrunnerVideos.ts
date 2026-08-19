import { getSnowrunnerVideos, type SnowrunnerVideo } from '../lib/api/snowrunner'
import { useLocalStorageCachedVideos } from './useLocalStorageCachedVideos'

// Os 2 vídeos mais recentes da playlist do SnowRunner, do mais novo pro
// mais antigo. Ver useLocalStorageCachedVideos pro comportamento de cache.
export function useSnowrunnerVideos(): SnowrunnerVideo[] {
  return useLocalStorageCachedVideos('ggb:snowrunner-videos', getSnowrunnerVideos)
}
