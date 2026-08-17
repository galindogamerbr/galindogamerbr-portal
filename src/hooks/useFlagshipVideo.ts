import { useEffect, useState } from 'react'
import { getFlagshipVideos, type FlagshipVideo } from '../lib/api/flagship'

const CACHE_KEY = 'ggb:flagship-videos'

function readCache(): FlagshipVideo[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as FlagshipVideo[]) : []
  } catch {
    return []
  }
}

// Episódios mais recentes da playlist do carro-chefe (Fazenda Nova Aliança),
// do mais novo pro mais antigo — busca uma vez ao montar. Parte do estado
// inicial do último resultado salvo em localStorage, pra evitar o flash de
// loading em visitas repetidas; só troca quando o fetch traz algo novo.
export function useFlagshipVideos(): FlagshipVideo[] {
  const [videos, setVideos] = useState<FlagshipVideo[]>(() => readCache())

  useEffect(() => {
    let active = true
    getFlagshipVideos().then((v) => {
      if (!active || v.length === 0) return
      setVideos(v)
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(v))
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
