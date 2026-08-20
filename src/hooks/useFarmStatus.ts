import { useEffect, useState } from 'react'
import { getFarmStatus, type FarmStatusResponse } from '../lib/api/farmStatus'

const CACHE_KEY = 'ggb:farm-status'

function readCache(): FarmStatusResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as FarmStatusResponse) : null
  } catch {
    return null
  }
}

// Sem polling de propósito (ao contrário de useLiveStatus/useCommunityStats)
// — o bot do Discord já fica atualizando a cada 30s por lá, aqui é só uma
// consulta ao entrar em /fazenda. Hidrata do localStorage pra evitar o
// flash "carregando" em quem já visitou antes.
export function useFarmStatus(): FarmStatusResponse | null {
  const [status, setStatus] = useState<FarmStatusResponse | null>(() => readCache())

  useEffect(() => {
    let active = true
    getFarmStatus().then((s) => {
      if (!active) return
      setStatus(s)
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(s))
      } catch {
        // localStorage indisponível (modo privado, storage cheio etc.) — só não persiste
      }
    })
    return () => {
      active = false
    }
  }, [])

  return status
}
