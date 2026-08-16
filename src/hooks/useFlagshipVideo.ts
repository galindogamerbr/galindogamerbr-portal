import { useEffect, useState } from 'react'
import { getFlagshipVideos, type FlagshipVideo } from '../lib/api/flagship'

// Episódios mais recentes da playlist do carro-chefe (Fazenda Nova Aliança),
// do mais novo pro mais antigo — busca uma vez ao montar. [] enquanto
// carrega/se a playlist não resolver.
export function useFlagshipVideos(): FlagshipVideo[] {
  const [videos, setVideos] = useState<FlagshipVideo[]>([])

  useEffect(() => {
    let active = true
    getFlagshipVideos().then((v) => {
      if (active) setVideos(v)
    })
    return () => {
      active = false
    }
  }, [])

  return videos
}
