import { useEffect, useState } from 'react'
import { me } from '../lib/api/auth'

type SessionState = {
  email: string | null
  loading: boolean
  refresh: () => void
}

export function useSession(): SessionState {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    me()
      .then((session) => {
        if (active) setEmail(session?.email ?? null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [tick])

  return { email, loading, refresh: () => setTick((t) => t + 1) }
}
