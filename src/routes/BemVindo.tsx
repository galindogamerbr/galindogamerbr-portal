import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

const LINK_CARDS = [
  {
    to: '/fazenda',
    icon: '🚜',
    title: 'Regras da Fazenda Nova Aliança',
    text: 'O que pode e o que não pode dentro do servidor de Farming Simulator — conteúdo a publicar pelo Galindo. Se tem interesse em participar, confira como contribuir com a fazenda.',
    cta: 'Conhecer a fazenda →',
  },
  {
    to: '/comunidade',
    icon: '🤝',
    title: 'Boas práticas da comunidade',
    text: 'Como a resenha funciona por aqui: respeito, bom humor e espaço pra todo mundo jogar junto. Discord, WhatsApp, mods e o grupo VIP, tudo no hub da comunidade.',
    cta: 'Ver hub da comunidade →',
  },
  {
    to: '/conteudos',
    icon: '🎮',
    title: 'Conteúdos do canal',
    text: 'Fazenda Nova Aliança, Fúria Reborn, ETS2, SnowRunner e mais.',
    cta: 'Conhecer os conteúdos →',
  },
] as const

export function BemVindo() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Eyebrow>Novo por aqui?</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">BOAS-VINDAS</h1>
        <p className="mt-3 text-lg text-muted sm:text-xl">
          Antes de entrar de cabeça na comunidade, um resumo rápido de como tudo funciona por aqui.
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-panel">
          <iframe
            src="https://www.youtube.com/embed/TcBrAo_A1Lc"
            title="Vídeo de boas-vindas — GalindoGamerBR"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="aspect-video w-full border-0"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {LINK_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group flex flex-col justify-between rounded-lg border border-line bg-panel p-5 transition-colors hover:border-gold"
            >
              <div>
                <span className="inline-block w-fit text-2xl transition duration-300 group-hover:scale-110">{card.icon}</span>
                <h4 className="mt-2 text-sm font-semibold uppercase tracking-wide text-white">{card.title}</h4>
                <p className="mt-1 text-sm text-muted">{card.text}</p>
              </div>
              <span className="mt-3 text-xs font-semibold text-gold group-hover:underline">{card.cta}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
