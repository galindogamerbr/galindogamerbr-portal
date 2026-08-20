import { getFlagshipVideos, type FlagshipVideo } from '../lib/api/flagship'
import { getLiveStatus } from '../lib/api/live'
import { useLocalStorageCachedVideos } from './useLocalStorageCachedVideos'

const CACHE_KEY = 'ggb:flagship-videos'

// Se o canal estiver ao vivo agora E essa live já for um vídeo da playlist
// da Fazenda Nova Aliança, ela vira o primeiro item (destaque) mesmo que a
// ordem da playlist não coloque ela em primeiro. /api/live é o status geral
// do canal (qualquer jogo) — nunca inventa uma entrada a partir dele sem
// checar se o videoId pertence mesmo a essa playlist, senão uma live de
// outro jogo (ex: Fúria Reborn) aparecia como se fosse o carro-chefe.
function withLiveFeatured(videos: FlagshipVideo[], live: Awaited<ReturnType<typeof getLiveStatus>>): FlagshipVideo[] {
  if (!live.isLive || !live.videoId) return videos

  const match = videos.find((v) => v.videoId === live.videoId)
  if (!match) return videos

  const rest = videos.filter((v) => v.videoId !== live.videoId)
  const liveVideo: FlagshipVideo = {
    videoId: live.videoId,
    title: live.title ?? match.title,
    thumbnailUrl: live.thumbnailUrl ?? match.thumbnailUrl,
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
