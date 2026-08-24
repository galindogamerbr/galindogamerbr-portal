import { useEffect, useState } from 'react'
import { getFarmStatus, type FarmStatusResponse } from '../lib/api/farmStatus'

const CACHE_KEY = 'ggb:farm-status'

function readCache(): FarmStatusResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const cached = raw ? (JSON.parse(raw) as FarmStatusResponse) : null
    return cached?.ok && cached.status ? cached : null
  } catch {
    return null
  }
}

// Sem polling de propósito (ao contrário de useLiveStatus/useCommunityStats)
// — o bot do Discord já fica atualizando a cada 30s por lá, aqui é só uma
// consulta ao entrar em /fazenda. Hidrata do localStorage pra evitar o
// flash "carregando" em quem já visitou antes.
export function useFarmStatus(): { data: FarmStatusResponse | null; loading: boolean } {
  const [data, setData] = useState<FarmStatusResponse | null>(() => readCache())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getFarmStatus()
      .then((response) => {
        if (!active || !response.ok || !response.status) return
        setData(response)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(response))
        } catch {
          // localStorage indisponível (modo privado, storage cheio etc.) — só não persiste
        }
      })
      .catch(() => {
        // Mantém o último status válido. Sem cache, o card mostra o estado
        // indisponível ao final da tentativa em vez de desaparecer da página.
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { data, loading }
}
