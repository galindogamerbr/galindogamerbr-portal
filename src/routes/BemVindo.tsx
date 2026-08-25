import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { VideoEmbed } from '../components/shared/VideoEmbed'
import { getFarmWelcomeVideo } from '../lib/api/farm'

const FALLBACK_WELCOME_VIDEO_ID = 'TcBrAo_A1Lc'

const LINK_CARDS = [
  {
    to: '/fazenda',
    icon: '🚜',
    title: 'Fazenda Nova Aliança',
    text: 'Conheça o servidor, assista às regras e veja o que é necessário para participar da fazenda.',
    cta: 'Conhecer a fazenda →',
  },
  {
    to: '/comunidade',
    icon: '🤝',
    title: 'Comunidade',
    text: 'Encontre o Discord, WhatsApp, grupo VIP e todos os espaços oficiais da comunidade.',
    cta: 'Ver comunidade →',
  },
  {
    to: '/conteudos',
    icon: '🎮',
    title: 'Conteúdos do canal',
    text: 'Fazenda Nova Aliança, Fúria Reborn, ETS2, SnowRunner e muito mais.',
    cta: 'Conhecer os conteúdos →',
  },
] as const

export function BemVindo() {
  const [welcomeVideoId, setWelcomeVideoId] = useState(FALLBACK_WELCOME_VIDEO_ID)

  useEffect(() => {
    getFarmWelcomeVideo().then(setWelcomeVideoId).catch(() => {})
  }, [])

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Eyebrow>Novo por aqui?</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">BOAS-VINDAS</h1>
        <p className="mt-3 text-lg text-muted sm:text-xl">
          Antes de entrar de cabeça na comunidade, veja um resumo de como tudo funciona por aqui.
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-panel">
          <VideoEmbed videoId={welcomeVideoId} title="Vídeo de boas-vindas — GalindoGamerBR" />
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
                <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-white">{card.title}</h2>
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
