import { useEffect, useRef, useState } from 'react'
import { getLiveStatus, type LiveStatus } from '../lib/api/live'

const POLL_INTERVAL_MS = 60_000
const CACHE_KEY = 'ggb:live-status'

function readCache(): LiveStatus | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as LiveStatus) : null
  } catch {
    return null
  }
}

// Polling compartilhado do status de live — usado por LiveBanner e a seção
// de métricas da Comunidade, pra não disparar 2 pollings independentes do
// mesmo /api/live. Hidrata o estado inicial do localStorage (evita o flash
// "carregando" -> "ao vivo" em quem já tinha visto a live rolando há pouco,
// mesma ideia do useLocalStorageCachedVideos) — o fetch de verdade ainda
// roda ao montar e a cada 60s, só não começa do zero.
export function useLiveStatus(): LiveStatus | null {
  const [status, setStatus] = useState<LiveStatus | null>(() => readCache())
  const statusRef = useRef(status)
  statusRef.current = status

  useEffect(() => {
    let active = true
    function load() {
      getLiveStatus().then((s) => {
        if (!active) return
        setStatus(s)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(s))
        } catch {
          // localStorage indisponível (modo privado, storage cheio etc.) — só não persiste
        }
      })
    }
    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return status
}
