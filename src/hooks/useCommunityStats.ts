import { useEffect, useState } from 'react'
import { getCommunityStats, type CommunityStats } from '../lib/api/communityStats'

const CACHE_KEY = 'ggb:community-stats'
// O cache de origem (D1) só atualiza de hora em hora (worker de cron) ou a
// cada ~10min (visitas do site) — pollar mais rápido que isso no cliente
// não traria dado novo, só desperdiçaria requests.
const POLL_INTERVAL_MS = 5 * 60_000

function readCache(): CommunityStats | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CommunityStats) : null
  } catch {
    return null
  }
}

export function useCommunityStats(): CommunityStats | null {
  const [stats, setStats] = useState<CommunityStats | null>(() => readCache())

  useEffect(() => {
    let active = true
    function load() {
      getCommunityStats().then((s) => {
        if (!active || !s) return
        setStats(s)
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

  return stats
}
