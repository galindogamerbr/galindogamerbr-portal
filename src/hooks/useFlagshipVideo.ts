import { getFlagshipVideos, type FlagshipVideo } from '../lib/api/flagship'
import { getLiveStatus } from '../lib/api/live'
import { useLocalStorageCachedVideos } from './useLocalStorageCachedVideos'

const CACHE_KEY = 'ggb:flagship-videos'

// Se o canal estiver ao vivo agora, a live vira o primeiro item (destaque)
// mesmo que a ordem da playlist não coloque ela em primeiro — cria uma
// entrada a partir do /api/live quando a live ainda não aparece na playlist.
function withLiveFeatured(videos: FlagshipVideo[], live: Awaited<ReturnType<typeof getLiveStatus>>): FlagshipVideo[] {
  if (!live.isLive || !live.videoId) return videos

  const rest = videos.filter((v) => v.videoId !== live.videoId)
  const liveVideo: FlagshipVideo = {
    videoId: live.videoId,
    title: live.title ?? videos.find((v) => v.videoId === live.videoId)?.title ?? '',
    thumbnailUrl: live.thumbnailUrl ?? `https://i.ytimg.com/vi/${live.videoId}/maxresdefault.jpg`,
  }
  return [liveVideo, ...rest]
}

async function fetchFlagshipVideosWithLive(): Promise<FlagshipVideo[]> {
  const [videos, live] = await Promise.all([getFlagshipVideos(), getLiveStatus()])
  return withLiveFeatured(videos, live)
}

// Episódios mais recentes da playlist do carro-chefe (Fazenda Nova Aliança),
// do mais novo pro mais antigo — busca uma vez ao montar. Parte do estado
// inicial do último resultado salvo em localStorage, pra evitar o flash de
// loading em visitas repetidas; só troca quando o fetch traz algo novo.
// Se estiver ao vivo, a live vira o primeiro item (ver withLiveFeatured).
export function useFlagshipVideos(): FlagshipVideo[] {
  return useLocalStorageCachedVideos(CACHE_KEY, fetchFlagshipVideosWithLive)
}
