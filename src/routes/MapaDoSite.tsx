import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { NAV_ITEMS, FOOTER_ITEMS } from '../components/layout/navItems'

const PAGE_DETAILS: Record<string, { icon: string; description: string }> = {
  '/': { icon: '⌂', description: 'O ponto de partida para acompanhar o canal, as lives e a comunidade.' },
  '/boasvindas': { icon: '👋', description: 'Uma mensagem do Galindo para quem está chegando agora.' },
  '/conteudos': { icon: '▶', description: 'Séries, vídeos recentes, dicas e todos os jogos do canal.' },
  '/mods': { icon: '⇄', description: 'Lista e sincronização dos mods utilizados na Fazenda Nova Aliança.' },
  '/fazenda': { icon: '🚜', description: 'Tudo para conhecer e participar da Fazenda Nova Aliança.' },
  '/comunidade': { icon: '◉', description: 'Números, canais e caminhos para fazer parte da comunidade.' },
  '/sobre': { icon: 'G', description: 'A história, as pessoas e o propósito por trás do canal.' },
  '/parceiros': { icon: '◆', description: 'Possibilidades para marcas que desejam crescer com o projeto.' },
  '/privacidade': { icon: '◎', description: 'Como o portal trata informações e protege sua privacidade.' },
  '/termos': { icon: '§', description: 'As condições essenciais para utilizar este portal.' },
  '/creditos': { icon: '✦', description: 'Desenvolvimento e atribuições dos recursos utilizados.' },
  '/admin': { icon: '⚙', description: 'Acesso reservado à administração do canal.' },
}

const PRIMARY_PAGES = [
  ...NAV_ITEMS.slice(0, 3),
  { label: 'Mods da Fazenda', to: '/mods' },
  ...NAV_ITEMS.slice(3),
]

function PageLink({ item }: { item: { label: string; to: string } }) {
  const details = PAGE_DETAILS[item.to]

  return (
    <li>
      <Link to={item.to} className="group flex h-full gap-4 rounded-xl border border-line bg-gradient-to-br from-panel to-panel2 p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_18px_45px_-32px_rgba(217,177,79,0.8)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-lg font-bold text-gold transition group-hover:bg-gold group-hover:text-bg">{details.icon}</span>
        <span>
          <strong className="block text-base text-white transition group-hover:text-gold">{item.label}</strong>
          <span className="mt-1 block text-sm leading-relaxed text-muted">{details.description}</span>
        </span>
      </Link>
    </li>
  )
}

export function MapaDoSite() {
  const secondaryPages = FOOTER_ITEMS.filter((item) => item.to !== '/mapa-do-site')

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_25%,rgba(217,177,79,0.14),transparent_32%),radial-gradient(circle_at_78%_55%,rgba(56,163,90,0.08),transparent_28%)]" />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Encontre seu caminho</Eyebrow>
            <h1 className="mt-2 text-4xl leading-none sm:text-6xl">TODO O UNIVERSO GALINDOGAMERBR</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">Todas as áreas do portal organizadas para você chegar ao conteúdo certo sem perder tempo.</p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Reveal>
          <Container>
            <div className="max-w-2xl">
              <Eyebrow>Explore o portal</Eyebrow>
              <h2 className="mt-1 text-3xl sm:text-4xl">PÁGINAS PRINCIPAIS</h2>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRIMARY_PAGES.map((item) => <PageLink key={item.to} item={item} />)}
            </ul>
          </Container>
        </Reveal>
      </section>

      <section className="border-t border-line bg-panel/35 py-16 sm:py-20">
        <Reveal>
          <Container>
            <div className="max-w-2xl">
              <Eyebrow>Informações e acesso</Eyebrow>
              <h2 className="mt-1 text-3xl sm:text-4xl">OUTRAS PÁGINAS</h2>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {secondaryPages.map((item) => <PageLink key={item.to} item={item} />)}
            </ul>
          </Container>
        </Reveal>
      </section>
    </>
  )
}
