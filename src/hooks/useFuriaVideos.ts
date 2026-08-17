import { useEffect, useState } from 'react'
import { getFuriaVideos, type FuriaVideo } from '../lib/api/furia'

// Os 2 vídeos mais recentes da playlist do Fúria Reborn, do mais novo pro
// mais antigo — busca uma vez ao montar. [] enquanto carrega/se falhar.
export function useFuriaVideos(): FuriaVideo[] {
  const [videos, setVideos] = useState<FuriaVideo[]>([])

  useEffect(() => {
    let active = true
    getFuriaVideos().then((v) => {
      if (active) setVideos(v)
    })
    return () => {
      active = false
    }
  }, [])

  return videos
}
