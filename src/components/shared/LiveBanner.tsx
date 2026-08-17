import { useEffect, useState } from 'react'
import { getLiveStatus, type LiveStatus } from '../../lib/api/live'
import { LinkButton } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { useFlagshipVideos } from '../../hooks/useFlagshipVideo'

const POLL_INTERVAL_MS = 60_000

// Estado da live domina a home quando ao vivo (Fase 2) — offline, embeda o
// último vídeo publicado (sem Shorts, ver functions/lib/youtube.ts); só cai
// pro fallback genérico se nem isso for encontrado (ex: enquanto /api/live
// ainda não respondeu).
export function LiveBanner() {
  const [status, setStatus] = useState<LiveStatus | null>(null)
  const [latestFlagship] = useFlagshipVideos()

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

  if (status?.videoId) {
    return (
      <div className="overflow-hidden rounded-lg border border-line bg-panel">
        <iframe
          src={`https://www.youtube.com/embed/${status.videoId}`}
          title={status.title ?? 'GalindoGamerBR'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full border-0"
        />
        <div className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            {status.isLive ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ao vivo agora
              </span>
            ) : (
              <Eyebrow>Último vídeo</Eyebrow>
            )}
            <h3 className="mt-2 text-xl">{status.title}</h3>
          </div>
          <LinkButton
            variant="red"
            href={`https://www.youtube.com/watch?v=${status.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            Ver no YouTube ↗
          </LinkButton>
        </div>
      </div>
    )
  }

  const loading = status === null

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      {latestFlagship?.thumbnailUrl && (
        <div className="relative aspect-video w-full">
          <img src={latestFlagship.thumbnailUrl} alt="" className="h-full w-full object-cover brightness-[0.35]" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col justify-between gap-3 p-6 sm:p-8">
        <div>
          <Eyebrow>Onde acompanhar</Eyebrow>
          <h3 className="text-2xl">Assista às lives ao vivo</h3>
          <p className="mt-2 text-muted">
            As transmissões acontecem em múltiplas plataformas — confira o canal que estiver no ar agora.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton variant="red" href="https://www.youtube.com/@galindogamerbr" target="_blank" rel="noopener noreferrer">
            Ver no YouTube ↗
          </LinkButton>
          <LinkButton variant="purple" href="https://www.twitch.tv/galindogamerbr" target="_blank" rel="noopener noreferrer">
            Ver na Twitch ↗
          </LinkButton>
        </div>
      </div>
    </div>
  )
}
