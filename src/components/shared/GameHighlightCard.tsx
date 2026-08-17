import { LinkButton } from '../ui/Button'

type Video = { videoId: string; title: string; thumbnailUrl: string }

// Cores por card — mesma paleta de marca usada nos <Button>, só que também
// precisamos da borda/selo/sombra combinando. Classes escritas por extenso
// (não montadas por template string) porque o Tailwind só gera no build o
// que encontra como texto literal no código-fonte.
const COLORS = {
  purple: {
    border: 'border-purple',
    badge: 'bg-purple text-white',
    shadow: 'shadow-[0_0_60px_-15px_rgba(100,71,232,0.35)]',
    hover: 'hover:border-purple',
  },
  blue: {
    border: 'border-blue',
    badge: 'bg-blue text-white',
    shadow: 'shadow-[0_0_60px_-15px_rgba(86,104,245,0.35)]',
    hover: 'hover:border-blue',
  },
  red: {
    border: 'border-red',
    badge: 'bg-red text-white',
    shadow: 'shadow-[0_0_60px_-15px_rgba(237,29,42,0.35)]',
    hover: 'hover:border-red',
  },
  green: {
    border: 'border-green',
    badge: 'bg-green text-white',
    shadow: 'shadow-[0_0_60px_-15px_rgba(22,163,74,0.35)]',
    hover: 'hover:border-green',
  },
} as const

type GameHighlightCardProps = {
  image: string
  title: string
  badgeEmoji: string
  badgeLabel: string
  description: string
  href: string
  variant: keyof typeof COLORS
  videos: Video[]
  // 'contain' pra artes com bastante espaço vazio ao redor da logo (ex:
  // Dicas do Galindo) — object-cover cortava a arte de forma perceptível.
  imageFit?: 'cover' | 'contain'
}

// Segundo/terceiro destaque de um jogo (não carro-chefe) — mesmo formato do
// teaser da Home (imagem+conteúdo 50/50, full width) usado pra Fúria Reborn
// e SnowRunner, com os últimos vídeos da playlist do jogo como cards menores.
export function GameHighlightCard({
  image,
  title,
  badgeEmoji,
  badgeLabel,
  description,
  href,
  variant,
  videos,
  imageFit = 'cover',
}: GameHighlightCardProps) {
  const colors = COLORS[variant]
  const fitClass = imageFit === 'contain' ? 'object-contain bg-bg' : 'object-cover'

  return (
    <div className={`grid grid-cols-1 overflow-hidden rounded-lg border-2 ${colors.border} ${colors.shadow} lg:grid-cols-2`}>
      <img src={image} alt={title} className={`aspect-video w-full ${fitClass} lg:aspect-auto lg:h-full`} />
      <div className="flex flex-col items-start justify-center gap-3 bg-panel p-6 sm:p-10">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${colors.badge}`}>
          {badgeEmoji} {badgeLabel}
        </span>
        <h2 className="text-2xl sm:text-3xl">{title}</h2>
        <p className="max-w-xl text-justify text-muted">{description}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <LinkButton variant={variant} href={href} target="_blank" rel="noopener noreferrer">
            Ver playlist completa
          </LinkButton>
        </div>

        {videos.length > 0 && (
          <div className="mt-2 w-full">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Últimos vídeos da playlist</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {videos.map((video) => (
                <a
                  key={video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-1 items-center gap-3 overflow-hidden rounded-md border border-line bg-panel2 p-2 transition ${colors.hover}`}
                >
                  <img src={video.thumbnailUrl} alt="" className="aspect-video w-20 shrink-0 rounded object-cover" />
                  <p className="line-clamp-2 text-xs font-semibold">{video.title}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
