import { useEffect, useState } from 'react'
import { getDicasVideos, type DicasVideo } from '../lib/api/dicas'

// Os 2 vídeos mais recentes da playlist do Dicas do Galindo, do mais novo
// pro mais antigo — busca uma vez ao montar. [] enquanto carrega/se falhar.
export function useDicasVideos(): DicasVideo[] {
  const [videos, setVideos] = useState<DicasVideo[]>([])

  useEffect(() => {
    let active = true
    getDicasVideos().then((v) => {
      if (active) setVideos(v)
    })
    return () => {
      active = false
    }
  }, [])

  return videos
}
