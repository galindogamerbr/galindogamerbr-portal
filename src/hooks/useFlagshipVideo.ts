import { useEffect, useState } from 'react'
import { getFlagshipVideos, type FlagshipVideo } from '../lib/api/flagship'
import { getLiveStatus } from '../lib/api/live'

const CACHE_KEY = 'ggb:flagship-videos'

function readCache(): FlagshipVideo[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as FlagshipVideo[]) : []
  } catch {
    return []
  }
}

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

// Episódios mais recentes da playlist do carro-chefe (Fazenda Nova Aliança),
// do mais novo pro mais antigo — busca uma vez ao montar. Parte do estado
// inicial do último resultado salvo em localStorage, pra evitar o flash de
// loading em visitas repetidas; só troca quando o fetch traz algo novo.
// Se estiver ao vivo, a live vira o primeiro item (ver withLiveFeatured).
export function useFlagshipVideos(): FlagshipVideo[] {
  const [videos, setVideos] = useState<FlagshipVideo[]>(() => readCache())

  useEffect(() => {
    let active = true

    Promise.all([getFlagshipVideos(), getLiveStatus()]).then(([v, live]) => {
      if (!active || v.length === 0) return
      const ordered = withLiveFeatured(v, live)
      setVideos(ordered)
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(ordered))
      } catch {
        // localStorage indisponível (modo privado, storage cheio etc.) — só não persiste
      }
    })

    return () => {
      active = false
    }
  }, [])

  return videos
}
