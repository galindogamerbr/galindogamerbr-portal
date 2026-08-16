import { Container } from '../components/ui/Container'
import { SectionHead } from '../components/ui/SectionHead'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { GameCard } from '../components/shared/GameCard'
import { LinkButton } from '../components/ui/Button'
import { GAMES, FAZENDA_NOVA_ALIANCA } from '../data/games'
import { useTilt } from '../hooks/useTilt'

const OTHER_GAMES = GAMES.filter((game) => !game.flagship)

export function Jogos() {
  const tiltRef = useTilt<HTMLDivElement>()

  return (
    <>
      <section className="py-16 sm:py-24">
        <Container>
          <Eyebrow>Conteúdo</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">NOSSOS JOGOS</h1>
        </Container>
      </section>

      {/* Carro-chefe do canal — destaque acima de tudo o resto. */}
      <section id="fazenda-nova-alianca" className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div
              ref={tiltRef}
              className="overflow-hidden rounded-lg border-2 border-gold bg-panel shadow-[0_0_60px_-15px_rgba(217,177,79,0.35)]"
            >
              <img
                src={FAZENDA_NOVA_ALIANCA.image}
                alt="Fazenda Nova Aliança"
                className="max-h-[460px] w-full object-cover"
              />
              <div className="p-6 sm:p-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-bg">
                  🚜 Carro-chefe do canal
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl">Farming Simulator 25 — Fazenda Nova Aliança</h2>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-gold">
                  {FAZENDA_NOVA_ALIANCA.episodeLabel}
                </span>
                <p className="mt-3 max-w-2xl text-lg text-muted">{FAZENDA_NOVA_ALIANCA.title}</p>
                <p className="mt-2 max-w-2xl text-muted">{FAZENDA_NOVA_ALIANCA.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <LinkButton variant="green" href={FAZENDA_NOVA_ALIANCA.href} target="_blank" rel="noopener noreferrer">
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
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <SectionHead eyebrow="Mais conteúdo" title="OUTROS JOGOS DO CANAL" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
