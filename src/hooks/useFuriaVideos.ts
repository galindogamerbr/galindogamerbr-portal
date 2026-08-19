import { getFuriaVideos, type FuriaVideo } from '../lib/api/furia'
import { useLocalStorageCachedVideos } from './useLocalStorageCachedVideos'

// Os 2 vídeos mais recentes da playlist do Fúria Reborn, do mais novo pro
// mais antigo. Ver useLocalStorageCachedVideos pro comportamento de cache.
export function useFuriaVideos(): FuriaVideo[] {
  return useLocalStorageCachedVideos('ggb:furia-videos', getFuriaVideos)
}
