import { useEffect, useState } from 'react'
import { getSnowrunnerVideos, type SnowrunnerVideo } from '../lib/api/snowrunner'

// Os 2 vídeos mais recentes da playlist do SnowRunner, do mais novo pro
// mais antigo — busca uma vez ao montar. [] enquanto carrega/se falhar.
export function useSnowrunnerVideos(): SnowrunnerVideo[] {
  const [videos, setVideos] = useState<SnowrunnerVideo[]>([])

  useEffect(() => {
    let active = true
    getSnowrunnerVideos().then((v) => {
      if (active) setVideos(v)
    })
    return () => {
      active = false
    }
  }, [])

  return videos
}
