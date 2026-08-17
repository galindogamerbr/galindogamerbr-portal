import { useEffect, useState } from 'react'
import { getEts2Videos, type Ets2Video } from '../lib/api/ets2'

// Os 2 vídeos mais recentes da playlist do ETS2, do mais novo pro mais
// antigo — busca uma vez ao montar. [] enquanto carrega/se falhar.
export function useEts2Videos(): Ets2Video[] {
  const [videos, setVideos] = useState<Ets2Video[]>([])

  useEffect(() => {
    let active = true
    getEts2Videos().then((v) => {
      if (active) setVideos(v)
    })
    return () => {
      active = false
    }
  }, [])

  return videos
}
