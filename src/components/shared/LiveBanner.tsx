import { useEffect, useState } from 'react'
import { getLiveStatus, type LiveStatus } from '../../lib/api/live'
import { LinkButton } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'

const POLL_INTERVAL_MS = 60_000

// Estado da live domina a home quando ao vivo (Fase 2) — fora do ar,
// cai pro fallback estático com link direto pros canais.
export function LiveBanner() {
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

  if (status?.isLive && status.videoId) {
    return (
      <div className="flex flex-col justify-between rounded-lg border border-red bg-panel p-6 sm:p-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ao vivo agora
          </span>
          <h3 className="mt-3 text-2xl">{status.title}</h3>
        </div>
        <LinkButton
          variant="red"
          href={`https://www.youtube.com/watch?v=${status.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6"
        >
          Assistir agora ↗
        </LinkButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between rounded-lg border border-line bg-panel p-6 sm:p-8">
      <div>
        <Eyebrow>Onde acompanhar</Eyebrow>
        <h3 className="text-2xl">Assista às lives ao vivo</h3>
        <p className="mt-2 text-muted">
          As transmissões acontecem em múltiplas plataformas — confira o canal que estiver no ar agora.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton variant="red" href="https://www.youtube.com/@galindogamerbr" target="_blank" rel="noopener noreferrer">
          Ver no YouTube ↗
        </LinkButton>
        <LinkButton variant="purple" href="https://www.twitch.tv/galindogamerbr" target="_blank" rel="noopener noreferrer">
          Ver na Twitch ↗
        </LinkButton>
      </div>
    </div>
  )
}
