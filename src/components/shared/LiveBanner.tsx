import { useEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'
import { useLiveStatus } from '../../hooks/useLiveStatus'
import { LinkButton } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'

function thumbnailUrl(videoId: string, quality: 'maxresdefault' | 'hqdefault'): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
}

// Estado da live domina a home quando ao vivo (Fase 2) — offline (ou ainda
// carregando), mostra o último vídeo enviado (a mesma API já devolve
// videoId/title/thumbnailUrl mesmo com isLive: false, ver
// functions/api/live.ts) na mesma casca de card o tempo todo, com um
// skeleton no lugar da thumbnail/título até chegar dado de verdade — evita
// o layout pular de um card pequeno de "Carregando…" pro card grande do
// vídeo assim que os dados chegam. maxresdefault.jpg nem sempre existe
// (vídeos mais antigos/baixa resolução não têm essa thumb gerada) — sem
// fallback, a imagem falhava silenciosamente e ficava invisível pra
// sempre; troca pra hqdefault.jpg (essa sempre existe) no onError.
export function LiveBanner() {
  const status = useLiveStatus()
  const [thumbLoaded, setThumbLoaded] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const [isInlinePlayerActive, setIsInlinePlayerActive] = useState(false)
  const displayedVideoIdRef = useRef<string | null>(null)

  // useLiveStatus faz polling a cada 60s — a maioria das vezes devolve o
  // mesmo videoId de antes, e nesse caso não deve acontecer nada (a
  // thumbnail já carregada continua na tela, sem re-render de "carregando").
  // Só quando o videoId muda de verdade (novo upload virou "último vídeo",
  // ou o canal ficou ao vivo agora) é que reseta o estado de loading pra
  // mostrar o spinner até a nova imagem carregar — e dispara o preload dela
  // assim que o videoId chega, antes mesmo de decidir trocar a UI, pra
  // minimizar esse tempo de spinner.
  useEffect(() => {
    if (!status?.videoId) return
    preload(thumbnailUrl(status.videoId, 'maxresdefault'), { as: 'image' })

    if (status.videoId === displayedVideoIdRef.current) return
    displayedVideoIdRef.current = status.videoId
    setThumbLoaded(false)
    setThumbFailed(false)
  }, [status?.videoId])

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

  // Falha total (raro): status já resolveu e não tem vídeo nenhum pra
  // mostrar. Único caso com uma casca de card diferente da final.
  if (status !== null && !status.videoId) {
    return (
      <div className="flex h-full flex-col justify-center gap-3 rounded-lg border border-line bg-panel p-6 sm:p-8">
        <Eyebrow>Onde acompanhar</Eyebrow>
        <h3 className="text-2xl">Não está ao vivo agora</h3>
        <div>
          <LinkButton variant="red" href="https://www.youtube.com/@galindogamerbr" target="_blank" rel="noopener noreferrer">
            Ver no YouTube ↗
          </LinkButton>
        </div>
      </div>
    )
  }

  // Carregando (status === null) ou offline com último vídeo (status.videoId)
  // — mesma casca de card nos dois casos, só o conteúdo troca de skeleton
  // pro dado real conforme chega. Clicar na thumbnail toca o vídeo embutido
  // ali mesmo (troca pro iframe) em vez de navegar pro YouTube — só o botão
  // "Ver no YouTube" abre em outra aba.
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      {isInlinePlayerActive && status?.videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${status.videoId}?autoplay=1`}
          title={status.title ?? 'GalindoGamerBR'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => status?.videoId && setIsInlinePlayerActive(true)}
          disabled={!status?.videoId}
          className="group block w-full"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-panel2">
            {!thumbLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-gold" />
              </div>
            )}
            {status?.videoId && (
              <>
                <img
                  src={thumbnailUrl(status.videoId, thumbFailed ? 'hqdefault' : 'maxresdefault')}
                  alt=""
                  width={1280}
                  height={720}
                  fetchPriority="high"
                  onLoad={() => setThumbLoaded(true)}
                  onError={() => {
                    if (!thumbFailed) setThumbFailed(true)
                    else setThumbLoaded(true)
                  }}
                  className={`h-full w-full object-cover transition-opacity duration-300 group-hover:scale-105 ${thumbLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                {thumbLoaded && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red/90 shadow-lg transition group-hover:scale-110">
                      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </button>
      )}
      <div className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="min-w-0">
          <Eyebrow>{status ? 'Último vídeo' : 'Onde acompanhar'}</Eyebrow>
          {status ? (
            <h3 className="mt-2 text-xl">{status.title}</h3>
          ) : (
            <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-panel2" />
          )}
        </div>
        {status && (
          <LinkButton
            variant="red"
            href={`https://www.youtube.com/watch?v=${status.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            Ver no YouTube ↗
          </LinkButton>
        )}
      </div>
    </div>
  )
}
