import { useLiveStatus } from '../../hooks/useLiveStatus'
import { LinkButton } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'

// Estado da live domina a home quando ao vivo (Fase 2) — offline, só avisa
// que não tá ao vivo agora (o carro-chefe já tem seção própria na home,
// não repete thumbnail/título aqui).
export function LiveBanner() {
  const status = useLiveStatus()

  if (status?.isLive && status.videoId) {
    return (
      <div className="overflow-hidden rounded-lg border border-line bg-panel">
        <iframe
          src={`https://www.youtube.com/embed/${status.videoId}?autoplay=1&mute=1`}
          title={status.title ?? 'GalindoGamerBR'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full border-0"
        />
        <div className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ao vivo agora
              {status.viewerCount !== null && (
                <span className="font-normal normal-case tracking-normal opacity-90">
                  · {status.viewerCount.toLocaleString('pt-BR')} assistindo
                </span>
              )}
            </span>
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
    <div className="flex h-full flex-col justify-center gap-3 rounded-lg border border-line bg-panel p-6 sm:p-8">
      <Eyebrow>Onde acompanhar</Eyebrow>
      <h3 className="text-2xl">{loading ? 'Carregando…' : 'Não está ao vivo agora'}</h3>
      <div>
        <LinkButton variant="red" href="https://www.youtube.com/@galindogamerbr" target="_blank" rel="noopener noreferrer">
          Ver no YouTube ↗
        </LinkButton>
      </div>
    </div>
  )
}
