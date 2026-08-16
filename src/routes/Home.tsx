import { useState, type FormEvent } from 'react'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { SectionHead } from '../components/ui/SectionHead'
import { Reveal } from '../components/ui/Reveal'
import { LinkButton, NavButton } from '../components/ui/Button'
import { HubLink } from '../components/shared/HubLink'
import { VipSteps } from '../components/shared/VipSteps'
import { ScheduleTabs } from '../components/shared/ScheduleTabs'
import { LiveBanner } from '../components/shared/LiveBanner'
import { FAZENDA_NOVA_ALIANCA } from '../data/games'
import { useParallax } from '../hooks/useParallax'
import { useTilt } from '../hooks/useTilt'

const HUB_TEASER = [
  {
    icon: '🚜',
    eyebrow: 'Farming Simulator 25',
    title: 'MODS DA FAZENDA',
    description: 'Central de mods da Fazenda Nova Aliança.',
    href: 'https://modsync.phmoreira.dev/',
  },
  {
    icon: '🎮',
    eyebrow: 'Discord oficial',
    title: 'SERVIDOR DA COMUNIDADE',
    description: 'Regras, avisos e os espaços oficiais do canal.',
    href: 'https://discord.com/invite/JggtZ7qGY3',
  },
]

export function Home() {
  return (
    <>
      <Hero />
      <ComeceAquiTeaser />
      <TransmissoesTeaser />
      <JogosTeaser />
      <ComunidadeTeaser />
      <SobreTeaser />
      <ParceirosTeaser />
      <Newsletter />
    </>
  )
}

// Fiel ao .reference-hero do site atual: banner de proporção fixa no
// desktop (2365:665), retrato do Galindo ancorado à direita/embaixo,
// gradiente de contraste em duas camadas (.hero-fade, em global.css).
function Hero() {
  const parallaxRef = useParallax<HTMLImageElement>(0.15)

  return (
    <section id="inicio" className="relative isolate min-h-[560px] overflow-hidden bg-bg xl:aspect-[2365/665] xl:min-h-0">
      <img ref={parallaxRef} src="/assets/background.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="hero-fade absolute inset-0" />
      <img
        src="/assets/galindo.webp"
        alt="Galindo, criador do GalindoGamerBR"
        className="pointer-events-none absolute bottom-0 left-[62%] hidden h-[96%] w-auto max-w-[44%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)] lg:block xl:max-w-[34%]"
      />
      <Container className="relative z-10 flex h-full flex-col justify-center gap-4 py-16 xl:py-0">
        <div className="flex items-center gap-3.5">
          <img src="/assets/logos/galindogamerbr.webp" alt="" className="h-10 w-10 rounded-full object-cover sm:h-[58px] sm:w-[58px]" />
          <span className="text-xs font-bold uppercase tracking-widest text-gold">Bem-vindo ao universo</span>
        </div>
        <h1 className="max-w-[600px] text-[clamp(32px,5.4vw,64px)] leading-[0.95]">
          GALINDO<span className="text-gold">GAMERBR</span>
        </h1>
        <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-[#dfe6ec]">
          Simuladores <span className="text-gold">•</span> Games <span className="text-gold">•</span> Comunidade
        </p>
        <p className="max-w-[480px] text-sm text-[#c3cdd6]">
          Lives, séries e muita diversão todos os dias. Junte-se à nossa comunidade e faça parte dessa jornada.
        </p>
        <div className="mt-2 flex max-w-[460px] flex-wrap gap-2">
          <LinkButton variant="purple" size="sm" href="https://www.twitch.tv/galindogamerbr" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/twitch.svg" alt="" className="h-4 w-4" /> Twitch
          </LinkButton>
          <LinkButton variant="green" size="sm" href="https://kick.com/galindogamerbr" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/kick.svg" alt="" className="h-4 w-4" /> Kick
          </LinkButton>
          <LinkButton variant="red" size="sm" href="https://www.youtube.com/@galindogamerbr" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/youtube.svg" alt="" className="h-4 w-4" /> YouTube
          </LinkButton>
          <LinkButton variant="default" size="sm" href="https://www.tiktok.com/@galindogamerbr" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/tiktok.svg" alt="" className="h-4 w-4" /> TikTok
          </LinkButton>
        </div>
      </Container>
    </section>
  )
}

function ComeceAquiTeaser() {
  return (
    <section className="py-16 sm:py-24">
      <Reveal>
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-lg border-2 border-gold bg-gradient-to-br from-panel to-panel2 p-8 shadow-[0_0_60px_-15px_rgba(217,177,79,0.35)] sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="flex items-start gap-4">
              <span className="text-4xl">👋</span>
              <div>
                <Eyebrow>Novo por aqui?</Eyebrow>
                <h2 className="text-3xl sm:text-4xl">COMECE AQUI</h2>
                <p className="mt-2 max-w-xl text-muted">
                  Antes de entrar de cabeça: vídeo de boas-vindas, regras da fazenda e boas práticas da comunidade,
                  tudo em um só lugar.
                </p>
              </div>
            </div>
            <NavButton to="/comece-aqui" variant="gold" className="shrink-0 text-base">
              Ver guia de boas-vindas →
            </NavButton>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

function TransmissoesTeaser() {
  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container>
          <SectionHead
            eyebrow="Transmissões"
            title="AO VIVO E EM DESTAQUE"
            action={
              <NavButton to="/programacao" variant="default">
                Ver programação
              </NavButton>
            }
          />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
            <LiveBanner />
            <ScheduleTabs />
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

// Farming Simulator 25 / Fazenda Nova Aliança é o carro-chefe do canal —
// ganha destaque próprio na home, não só mais um item entre outros jogos.
function JogosTeaser() {
  const tiltRef = useTilt<HTMLDivElement>()

  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container>
          <div
            ref={tiltRef}
            className="relative overflow-hidden rounded-lg border-2 border-gold shadow-[0_0_60px_-15px_rgba(217,177,79,0.35)]"
          >
            <img src={FAZENDA_NOVA_ALIANCA.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/55" />
            <div className="relative flex flex-col items-start gap-3 p-6 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-bg">
                🚜 Carro-chefe do canal
              </span>
              <h2 className="text-2xl sm:text-3xl">FARMING SIMULATOR 25 — FAZENDA NOVA ALIANÇA</h2>
              <p className="max-w-xl text-muted">{FAZENDA_NOVA_ALIANCA.description}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <LinkButton variant="green" href={FAZENDA_NOVA_ALIANCA.href} target="_blank" rel="noopener noreferrer">
                  Assistir no YouTube
                </LinkButton>
                <NavButton to="/jogos" variant="default">
                  Ver todos os jogos →
                </NavButton>
              </div>
            </div>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

function ComunidadeTeaser() {
  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container>
          <SectionHead
            eyebrow="Central da comunidade"
            title="TODOS OS CAMINHOS"
            action={
              <NavButton to="/comunidade" variant="default">
                Ver comunidade
              </NavButton>
            }
          />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {HUB_TEASER.map((link) => (
              <HubLink key={link.title} {...link} />
            ))}
          </div>
          <div className="mt-6">
            <VipSteps variant="compact" />
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

function SobreTeaser() {
  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <img src="/assets/about-galindo.webp" alt="GalindoGamerBR" className="w-full rounded-lg border border-line object-cover" />
          <div>
            <Eyebrow>Sobre o Galindo</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">POR TRÁS DA LIVE, EXISTE UMA HISTÓRIA.</h2>
            <p className="mt-3 text-muted">
              41 anos, casado, trabalha na cidade e continua sendo aquele cara que se apaixonou por jogos quando
              ainda era criança. O canal nasceu para criar encontros, não só transmissões.
            </p>
            <NavButton to="/sobre" variant="default" className="mt-6">
              Conheça minha história →
            </NavButton>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

function ParceirosTeaser() {
  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container>
          <div className="rounded-lg border border-gold/40 bg-panel p-6 sm:p-8">
            <Eyebrow>Parceiros e marcas</Eyebrow>
            <h2 className="text-2xl sm:text-3xl">UMA COMUNIDADE REAL TAMBÉM PODE GERAR VALOR PARA QUEM CAMINHA JUNTO.</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Não quero apenas colocar uma logo no site. Quero criar presença, relacionamento e uma história que a
              comunidade reconheça.
            </p>
            <NavButton to="/parceiros" variant="gold" className="mt-6">
              Quero ser parceiro →
            </NavButton>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'soon'>('idle')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    // Ainda sem backend de e-mail marketing conectado — só confirma o
    // interesse por enquanto (ver plano: possível integração com Resend).
    setStatus('soon')
  }

  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-lg border border-line bg-panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <Eyebrow>Fique por dentro</Eyebrow>
              <h2 className="text-2xl">NOVIDADES E LIVES</h2>
              <p className="mt-2 text-muted">Receba avisos, novidades e conteúdos da comunidade.</p>
            </div>
            {status === 'idle' ? (
              <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:w-auto">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  aria-label="Seu melhor e-mail"
                  className="w-full rounded-md border border-line bg-panel2 px-4 py-3 text-sm text-white outline-none focus:border-gold sm:w-64"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-md bg-gold px-5 py-3 text-sm font-semibold uppercase tracking-wide text-bg transition hover:brightness-110"
                >
                  Quero receber
                </button>
              </form>
            ) : (
              <p className="text-sm text-muted">Cadastro em breve — essa área ainda está sendo conectada.</p>
            )}
          </div>
        </Container>
      </Reveal>
    </section>
  )
}
