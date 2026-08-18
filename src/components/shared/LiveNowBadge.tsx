import { useLiveStatus } from '../../hooks/useLiveStatus'

// Selo isolado (fora do card do vídeo) pra anunciar a live logo acima dos
// cards de "Ao vivo e em destaque" — some sozinho quando não está ao vivo.
export function LiveNowBadge() {
  const status = useLiveStatus()

  if (!status?.isLive) return null

  return (
    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ao vivo neste momento
      {status.viewerCount !== null && (
        <span className="font-normal normal-case tracking-normal opacity-90">
          · {status.viewerCount.toLocaleString('pt-BR')} assistindo
        </span>
      )}
    </span>
  )
}
