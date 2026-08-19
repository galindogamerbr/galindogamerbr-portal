import { useState } from 'react'

function thumbnailUrl(videoId: string, quality: 'maxresdefault' | 'hqdefault'): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
}

type VideoEmbedProps = {
  videoId: string
  title: string
  autoplay?: boolean
  className?: string
}

// Thumbnail (pequena, cacheável pelo navegador) sob o iframe do YouTube —
// aparece na hora enquanto o player pesado ainda carrega, em vez de deixar
// só um fundo escuro/spinner até o iframe terminar de montar. maxresdefault
// nem sempre existe (vídeos antigos/baixa resolução) — sem fallback, a
// imagem falhava silenciosamente e ficava invisível pra sempre.
export function VideoEmbed({ videoId, title, autoplay = false, className = '' }: VideoEmbedProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-panel2 ${className}`}>
      <img
        src={thumbnailUrl(videoId, thumbFailed ? 'hqdefault' : 'maxresdefault')}
        alt=""
        fetchPriority="high"
        onError={() => setThumbFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <iframe
        src={`https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1&mute=1' : ''}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setIframeLoaded(true)}
        className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
