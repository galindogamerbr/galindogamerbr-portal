import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Logo } from '../components/ui/Logo'
import { SectionHead } from '../components/ui/SectionHead'
import { Reveal } from '../components/ui/Reveal'
import { LinkButton, NavButton } from '../components/ui/Button'
import { HubLink } from '../components/shared/HubLink'
import { VipSteps } from '../components/shared/VipSteps'
import { ScheduleTabs } from '../components/shared/ScheduleTabs'
import { PublicScheduleExportButton } from '../components/shared/PublicScheduleExportButton'
import { LiveBanner } from '../components/shared/LiveBanner'
import { LifetimeVisitsBanner } from '../components/shared/LifetimeVisitsBanner'
import { useParallax } from '../hooks/useParallax'

const HUB_TEASER = [
  {
    icon: '🚜',
    eyebrow: 'Farming Simulator 25',
    title: 'MODS DA FAZENDA',
    description: 'Central de mods da Fazenda Nova Aliança.',
    href: '/mods',
  },
  {
    icon: '🎮',
    eyebrow: 'Discord oficial',
    title: 'SERVIDOR DA COMUNIDADE',
    description: 'Regras, avisos e os espaços oficiais do canal.',
    href: '/discord',
  },
]

export function Home() {
  return (
    <>
      <Hero />
      <FazendaTeaser />
      <TransmissoesTeaser />
      <JogosBannerCta />
      <ComunidadeTeaser />
      <SobreTeaser />
      <ParceirosTeaser />
      {/* <Newsletter /> */}
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
      <img
        ref={parallaxRef}
        src="/assets/background.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="hero-fade absolute inset-0" />
      <img
        src="/assets/galindo.webp"
        alt="Galindo, criador do GalindoGamerBR"
        fetchPriority="high"
        className="pointer-events-none absolute bottom-0 left-[62%] hidden h-[96%] w-auto max-w-[44%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)] lg:block xl:max-w-[34%]"
      />
      <Container className="relative z-10 flex h-full flex-col justify-center gap-4 py-16 xl:py-0">
        <div className="grid w-fit grid-cols-[auto_auto] items-center gap-x-3.5 gap-y-0.5">
          <span className="col-span-2 text-xs font-bold uppercase tracking-widest text-gold">Bem-vindo ao universo</span>
          <Logo alt="" className="row-span-2 h-16 w-16 sm:h-20 sm:w-20" />
          <h1 className="max-w-[600px] text-[clamp(32px,5.4vw,64px)] leading-[0.95]">
            GALINDO<span className="text-gold">GAMER</span>BR
          </h1>
          <p className="col-start-2 text-sm font-extrabold uppercase tracking-[0.1em] text-[#dfe6ec]">
            Simuladores <span className="text-gold">•</span> Games <span className="text-gold">•</span> Comunidade
          </p>
        </div>
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
        <LifetimeVisitsBanner />
      </Container>
    </section>
  )
}

function FazendaTeaser() {
  return (
    <section className="py-16 sm:py-24">
      <Reveal>
        <Container>
          <div className="rounded-lg border-2 border-gold bg-gradient-to-br from-panel to-panel2 p-8 shadow-[0_0_60px_-15px_rgba(217,177,79,0.35)] sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🚜</span>
                <div>
                  <Eyebrow>Fazenda Nova Aliança</Eyebrow>
                  <h2 className="text-3xl sm:text-4xl">VEIO PELA FAZENDA E QUER PARTICIPAR?</h2>
                  <p className="mt-2 max-w-xl text-muted">
                    Veja como funciona o servidor, o que você precisa para entrar e como fazer parte da lida com a
                    comunidade.
                  </p>
                </div>
              </div>
              <NavButton to="/fazenda" variant="gold" className="shrink-0 text-base">
                Ver como participar →
              </NavButton>
            </div>

            <div className="mt-8 flex flex-col items-start gap-4 border-t border-gold/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👋</span>
                <div>
                  <h3 className="text-lg">NOVO POR AQUI?</h3>
                  <p className="mt-1 text-sm text-muted">Dê uma olhada na mensagem de boas-vindas do nosso streamer.</p>
                </div>
              </div>
              <NavButton to="/boasvindas" variant="default" size="sm">
                Assistir à mensagem →
              </NavButton>
            </div>
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
          <SectionHead eyebrow="Transmissões" title="AO VIVO E EM DESTAQUE" />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="flex-1">
              <LiveBanner />
            </div>
            <div className="w-full lg:max-w-md lg:shrink-0">
              <h3 className="mb-4 text-2xl">Programação da semana</h3>
              <ScheduleTabs />
              <div className="mt-4">
                <PublicScheduleExportButton />
              </div>
              <p className="mt-4 rounded-md border border-line bg-panel p-4 text-sm text-muted sm:p-5">
                <strong className="text-white">Importante:</strong> por causa do trabalho na cidade, o cronograma
                pode sofrer alterações. Todos os domingos, a programação é atualizada no TikTok, Instagram e
                YouTube.
              </p>
            </div>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

// Chamada de largura cheia pra /jogos, logo abaixo do vídeo — antes do
// destaque específico da Fazenda Nova Aliança (JogosTeaser).
function JogosBannerCta() {
  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container>
          <Link to="/conteudos" className="group relative block overflow-hidden rounded-lg border border-line">
            <img
              src="/assets/banners/jogos-banner.webp"
              alt=""
              loading="lazy"
              className="aspect-[21/9] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 p-6 sm:p-10">
              <Eyebrow className="text-sm sm:text-lg">Todos os conteúdos do canal</Eyebrow>
              <h2 className="text-2xl sm:text-5xl">CONHEÇA OS CONTEÚDOS DO CANAL</h2>
              <span className="text-sm font-semibold uppercase tracking-wide text-gold sm:text-base">Ver todos →</span>
            </div>
          </Link>
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

// about-galindo.webp já vem com a metade direita escura, de propósito
// (mesmo espírito do Hero acima) — antes o texto ficava numa coluna
// separada ao lado da imagem, deixando esse espaço reservado vazio.
// Sobrepõe o texto ali a partir do lg; abaixo disso (sem espaço pra
// sobrepor sem cobrir o rosto) a imagem só mostra um recorte focado no
// Galindo, com o texto embaixo em fluxo normal.
function SobreTeaser() {
  return (
    <section className="pb-16 sm:pb-24">
      <Reveal>
        <Container>
          <div className="relative isolate overflow-hidden rounded-lg border border-line lg:min-h-[420px] xl:aspect-[2172/724] xl:min-h-0">
            <img
              src="/assets/about-galindo.webp"
              alt="GalindoGamerBR"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-left lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:w-full"
            />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-bg/40 to-bg/90 lg:block" />
            <div className="p-6 sm:p-8 lg:absolute lg:inset-y-0 lg:right-0 lg:z-10 lg:flex lg:w-full lg:max-w-lg lg:flex-col lg:justify-center lg:p-10">
              <Eyebrow>Sobre o Galindo</Eyebrow>
              <h2 className="text-3xl sm:text-4xl">POR TRÁS DA LIVE, EXISTE UMA HISTÓRIA.</h2>
              <p className="mt-3 text-muted">
                Sou apaixonado por simuladores e jogos desde sempre. Criei o GalindoGamerBR para compartilhar minha
                paixão, criar conteúdo de qualidade e construir uma comunidade incrível!
              </p>
              <p className="mt-3 text-muted">Aqui você encontra gameplay de verdade, diversão e aprendizado em cada interação!</p>
              <NavButton to="/sobre" variant="default" className="mt-6 self-start">
                Conheça minha história →
              </NavButton>
            </div>
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
          <div className="flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <Eyebrow>Parceiros e marcas</Eyebrow>
              <h2 className="text-2xl sm:text-3xl">UMA MARCA PRESENTE. UMA COMUNIDADE QUE RECONHECE.</h2>
              <p className="mt-3 max-w-2xl text-muted">
                Sua marca pode ganhar espaço onde o público já está: nas lives, nos vídeos e nas conversas que movem
                o universo GalindoGamerBR.
              </p>
              <p className="mt-3 max-w-2xl text-muted">
                Criamos ações com contexto, proximidade e propósito — muito mais do que apenas colocar uma logo na
                tela.
              </p>
              <NavButton to="/parceiros" variant="gold" className="mt-6">
                Conheça as possibilidades →
              </NavButton>
            </div>
            <div className="sm:flex sm:flex-1 sm:justify-center">
              <Logo alt="" className="h-28 w-28 shrink-0 sm:h-36 sm:w-36" />
            </div>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}

// TODO: definir e implementar a newsletter; depois reativar os imports de
// `useState`/`FormEvent`, o componente abaixo e sua chamada em Home().
/*
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
*/
// está no histórico do git (ver commit antes desta remoção).
