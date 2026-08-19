import { useEffect, useState } from 'react'
import { getLiveStatus, type LiveStatus } from '../lib/api/live'

const POLL_INTERVAL_MS = 60_000

// Polling compartilhado do status de live — usado por LiveBanner e a seção
// de métricas da Comunidade, pra não disparar 2 pollings independentes do
// mesmo /api/live.
export function useLiveStatus(): LiveStatus | null {
  const [status, setStatus] = useState<LiveStatus | null>(null)

  useEffect(() => {
    let active = true
    function load() {
      getLiveStatus().then((s) => {
        if (active) setStatus(s)
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
