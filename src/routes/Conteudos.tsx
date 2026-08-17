import { Container } from '../components/ui/Container'
import { SectionHead } from '../components/ui/SectionHead'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { GameCard } from '../components/shared/GameCard'
import { GameHighlightCard } from '../components/shared/GameHighlightCard'
import { LinkButton } from '../components/ui/Button'
import { GAMES, FAZENDA_NOVA_ALIANCA, FURIA_REBORN, DICAS, ETS2, SNOWRUNNER } from '../data/games'
import { useTilt } from '../hooks/useTilt'
import { useFlagshipVideos } from '../hooks/useFlagshipVideo'
import { useFuriaVideos } from '../hooks/useFuriaVideos'
import { useDicasVideos } from '../hooks/useDicasVideos'
import { useEts2Videos } from '../hooks/useEts2Videos'
import { useSnowrunnerVideos } from '../hooks/useSnowrunnerVideos'

const OTHER_GAMES = GAMES.filter(
  (game) =>
    !game.flagship && game.slug !== 'furia-reborn-rp' && game.slug !== 'dicas' && game.slug !== 'ets2' && game.slug !== 'snowrunner',
)

export function Conteudos() {
  const tiltRef = useTilt<HTMLDivElement>()
  const [flagship, ...recent] = useFlagshipVideos()
  const flagshipHref = flagship?.videoId ? `https://www.youtube.com/watch?v=${flagship.videoId}` : FAZENDA_NOVA_ALIANCA.href
  const furiaVideos = useFuriaVideos()
  const dicasVideos = useDicasVideos()
  const ets2Videos = useEts2Videos()
  const snowrunnerVideos = useSnowrunnerVideos()

  return (
    <>
      <section className="pt-16 pb-8 sm:pt-24 sm:pb-12">
        <Container>
          <Eyebrow>Explore o canal</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">NOSSOS CONTEÚDOS</h1>
        </Container>
      </section>

      {/* Carro-chefe do canal — destaque acima de tudo o resto. */}
      <section id="fazenda-nova-alianca" className="pb-8 sm:pb-12">
        <Reveal>
          <Container>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
              <div
                ref={tiltRef}
                className="overflow-hidden rounded-lg border-2 border-gold bg-panel shadow-[0_0_60px_-15px_rgba(217,177,79,0.35)] lg:col-span-5"
              >
                <img
                  src={flagship?.thumbnailUrl}
                  alt="Fazenda Nova Aliança"
                  className="aspect-video w-full object-cover"
                />
                <div className="p-5 sm:p-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-bg">
                    🚜 Carro-chefe do canal
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl">Farming Simulator 25 — Fazenda Nova Aliança</h2>
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
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:col-span-2">
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
                formato do teaser da Home (imagem+conteúdo 50/50, full width). */}
            <div className="mt-8 flex flex-col gap-6">
              <GameHighlightCard
                image={FURIA_REBORN.image}
                title="FÚRIA REBORN — GTA RP"
                badgeEmoji="🎮"
                badgeLabel="Roleplay do canal"
                description={FURIA_REBORN.description}
                href={FURIA_REBORN.href}
                variant="purple"
                videos={furiaVideos}
              />
              <GameHighlightCard
                image={ETS2.image}
                title="EURO TRUCK SIMULATOR 2"
                badgeEmoji="🚚"
                badgeLabel="Estradas do canal"
                description={ETS2.description}
                href={ETS2.href}
                variant="red"
                videos={ets2Videos}
              />
              <GameHighlightCard
                image={SNOWRUNNER.image}
                title="SNOWRUNNER"
                badgeEmoji="🚛"
                badgeLabel="Simulação off-road"
                description={SNOWRUNNER.description}
                href={SNOWRUNNER.href}
                variant="blue"
                videos={snowrunnerVideos}
              />
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
