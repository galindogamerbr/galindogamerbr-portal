import { getEts2Videos, type Ets2Video } from '../lib/api/ets2'
import { useLocalStorageCachedVideos } from './useLocalStorageCachedVideos'

// Os 2 vídeos mais recentes da playlist do ETS2, do mais novo pro mais
// antigo. Ver useLocalStorageCachedVideos pro comportamento de cache.
export function useEts2Videos(): Ets2Video[] {
  return useLocalStorageCachedVideos('ggb:ets2-videos', getEts2Videos)
}
