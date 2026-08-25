import { Container } from '../components/ui/Container'
import { SectionHead } from '../components/ui/SectionHead'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { GameCard } from '../components/shared/GameCard'
import { GameHighlightCard } from '../components/shared/GameHighlightCard'
import { VideoEmbed } from '../components/shared/VideoEmbed'
import { LinkButton, NavButton } from '../components/ui/Button'
import { GAMES, FAZENDA_NOVA_ALIANCA, FURIA_REBORN, DICAS, ETS2, SNOWRUNNER, CONTRABAND_POLICE } from '../data/games'
import { useFlagshipVideos } from '../hooks/useFlagshipVideo'
import { useFuriaVideos } from '../hooks/useFuriaVideos'
import { useDicasVideos } from '../hooks/useDicasVideos'
import { useEts2Videos } from '../hooks/useEts2Videos'
import { useSnowrunnerVideos } from '../hooks/useSnowrunnerVideos'
import { useContrabandPoliceVideos } from '../hooks/useContrabandPoliceVideos'
import { useLiveStatus } from '../hooks/useLiveStatus'

const OTHER_GAMES = GAMES.filter(
  (game) =>
    !game.flagship &&
    game.slug !== 'furia-reborn-rp' &&
    game.slug !== 'dicas' &&
    game.slug !== 'ets2' &&
    game.slug !== 'snowrunner' &&
    game.slug !== 'contraband-police',
)

export function Conteudos() {
  const [flagship, ...recent] = useFlagshipVideos()
  // Mesmo polling de /api/live que o LiveBanner usa — evita um segundo
  // poller independente rodando em paralelo nesta rota.
  const live = useLiveStatus()
  const flagshipHref = flagship?.videoId ? `https://www.youtube.com/watch?v=${flagship.videoId}` : FAZENDA_NOVA_ALIANCA.href
  const furiaVideos = useFuriaVideos()
  const dicasVideos = useDicasVideos()
  const ets2Videos = useEts2Videos()
  const snowrunnerVideos = useSnowrunnerVideos()
  const contrabandPoliceVideos = useContrabandPoliceVideos()

  const isLiveNow = live?.isLive && live.videoId === flagship?.videoId

  // Fúria Reborn, ETS2, SnowRunner — se o canal estiver ao vivo com um vídeo
  // que já apareceu na playlist recente de um desses jogos (mesma checagem
  // de pertencimento usada no carro-chefe, ver useFlagshipVideo.ts), esse
  // jogo sobe pra cima do carro-chefe, em destaque, com a live embutida em
  // vez da imagem estática (liveVideoId, ver GameHighlightCard.tsx) — sai da
  // lista normal de "Outros jogos" enquanto estiver promovido.
  const otherGameHighlights = [
    {
      slug: 'furia-reborn-rp',
      image: FURIA_REBORN.image,
      title: 'FÚRIA REBORN | GTA RP',
      badgeEmoji: '🎮',
      badgeLabel: 'Roleplay do canal',
      description: FURIA_REBORN.description,
      href: FURIA_REBORN.href,
      variant: 'purple' as const,
      videos: furiaVideos,
    },
    {
      slug: 'ets2',
      image: ETS2.image,
      title: 'EURO TRUCK SIMULATOR 2',
      badgeEmoji: '🚚',
      badgeLabel: 'Estradas do canal',
      description: ETS2.description,
      href: ETS2.href,
      variant: 'red' as const,
      videos: ets2Videos,
    },
    {
      slug: 'snowrunner',
      image: SNOWRUNNER.image,
      title: 'SNOWRUNNER',
      badgeEmoji: '🚛',
      badgeLabel: 'Simulação fora de estrada',
      description: SNOWRUNNER.description,
      href: SNOWRUNNER.href,
      variant: 'blue' as const,
      videos: snowrunnerVideos,
    },
    {
      slug: 'contraband-police',
      image: CONTRABAND_POLICE.image,
      title: 'CONTRABAND POLICE',
      badgeEmoji: '🛂',
      badgeLabel: 'Fiscalização de fronteira',
      description: CONTRABAND_POLICE.description,
      href: CONTRABAND_POLICE.href,
      variant: 'red' as const,
      videos: contrabandPoliceVideos,
    },
  ].map((game) => ({
    ...game,
    liveVideoId: live?.isLive && game.videos.some((video) => video.videoId === live.videoId) ? live.videoId : null,
  }))
  const liveHighlightIndex = otherGameHighlights.findIndex((game) => game.liveVideoId)
  const promotedLiveGame = liveHighlightIndex >= 0 ? otherGameHighlights[liveHighlightIndex] : null
  const remainingGameHighlights = otherGameHighlights.filter((_, index) => index !== liveHighlightIndex)

  return (
    <>
      <section className="pt-16 pb-8 sm:pt-24 sm:pb-12">
        <Container>
          <Eyebrow>Explore o canal</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">NOSSOS CONTEÚDOS</h1>
        </Container>
      </section>

      {/* Se tiver ao vivo com Fúria/ETS2/SnowRunner, esse destaque assume o
          topo da página, acima até do carro-chefe — "o que tá rolando agora"
          importa mais que o vídeo mais recente da série fixa. */}
      {promotedLiveGame && (
        <section className="pb-8 sm:pb-12">
          <Reveal>
            <Container>
              <Eyebrow>Ao vivo agora</Eyebrow>
              <GameHighlightCard {...promotedLiveGame} />
            </Container>
          </Reveal>
        </section>
      )}

      {/* Carro-chefe do canal — destaque acima de tudo o resto. */}
      <section id="fazenda-nova-alianca" className="pb-8 sm:pb-12">
        <Reveal>
          <Container>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <div className="group overflow-hidden rounded-lg border-2 border-gold bg-panel shadow-[0_0_60px_-15px_rgba(217,177,79,0.35)] lg:col-span-5">
                <div className="relative aspect-video w-full overflow-hidden">
                  <div className="h-full w-full transition duration-500 group-hover:scale-105">
                    {flagship?.videoId ? (
                      <VideoEmbed videoId={flagship.videoId} title={flagship.title} autoplay={isLiveNow} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-panel2">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-bg">
                    🚜 Carro-chefe do canal
                  </span>
                  {isLiveNow && (
                    <span className="ml-2 inline-flex items-center gap-2 rounded-full bg-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ao vivo agora
                    </span>
                  )}
                  <h2 className="mt-3 text-2xl sm:text-3xl">Farming Simulator 25 | Fazenda Nova Aliança</h2>
                  {flagship?.title && (
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-gold">
                      {flagship.title}
                    </span>
                  )}
                  <p className="mt-3 text-justify text-muted">{FAZENDA_NOVA_ALIANCA.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <LinkButton variant="green" href={flagshipHref} target="_blank" rel="noopener noreferrer">
                      Assistir no YouTube
                    </LinkButton>
                    <LinkButton
                      variant="gold"
                      href="https://www.youtube.com/playlist?list=PLj6h86FobQUn2vIz-FSyMlL_ldV6_kzrN"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver playlist completa
                    </LinkButton>
                    <NavButton variant="blue" to="/mods">
                      Sincronize seus mods
                    </NavButton>
                    <NavButton variant="purple" to="/fazenda">
                      Participe da Fazenda
                    </NavButton>
                  </div>
                </div>
              </div>

              <div className="hidden flex-col gap-3 lg:col-span-2 lg:flex">
                {recent.map((video) => (
                  <a
                    key={video.videoId}
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center gap-3 overflow-hidden rounded-md border border-line bg-panel p-3 transition hover:border-gold"
                  >
                    <img src={video.thumbnailUrl} alt="" className="aspect-video w-32 shrink-0 rounded object-cover sm:w-40" />
                    <p className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold">{video.title}</p>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      {/* Dicas do Galindo — logo abaixo do carro-chefe, antes do "Descubra mais". */}
      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <GameHighlightCard
              image={DICAS.image}
              title="DICAS DO GALINDO"
              badgeEmoji="💡"
              badgeLabel="Tutoriais do canal"
              description={DICAS.description}
              href={DICAS.href}
              variant="green"
              videos={dicasVideos}
              imageFit="contain"
            />
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <SectionHead eyebrow="Descubra mais" title="OUTROS JOGOS DO CANAL" />

            {/* Fúria Reborn, ETS2 e SnowRunner — destaques secundários, mesmo
                formato do teaser da Home (imagem+conteúdo 50/50, full width).
                O que estiver ao vivo agora não aparece aqui — está promovido
                acima do carro-chefe (ver promotedLiveGame). */}
            <div className="mt-8 flex flex-col gap-6">
              {remainingGameHighlights.map((game) => (
                <GameHighlightCard key={game.slug} {...game} />
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {OTHER_GAMES.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </Container>
        </Reveal>
      </section>
    </>
  )
}
