import { getDicasVideos, type DicasVideo } from '../lib/api/dicas'
import { useLocalStorageCachedVideos } from './useLocalStorageCachedVideos'

// Os 2 vídeos mais recentes da playlist do Dicas do Galindo, do mais novo
// pro mais antigo. Ver useLocalStorageCachedVideos pro comportamento de cache.
export function useDicasVideos(): DicasVideo[] {
  return useLocalStorageCachedVideos('ggb:dicas-videos', getDicasVideos)
}
