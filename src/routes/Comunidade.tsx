import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { HubLink } from '../components/shared/HubLink'
import { VipSteps } from '../components/shared/VipSteps'
import { CommunityStatsGrid } from '../components/shared/CommunityStatsGrid'
import { SiteVisitsCard } from '../components/shared/SiteVisitsCard'
import { LiveNowBadge } from '../components/shared/LiveNowBadge'

const HUB_LINKS = [
  {
    icon: '🚜',
    eyebrow: 'Farming Simulator 25',
    title: 'MODS DA FAZENDA',
    description: 'Central de mods da Fazenda Nova Aliança.',
    href: 'https://modsync.phmoreira.dev/',
  },
  {
    icon: '💬',
    eyebrow: 'WhatsApp',
    title: 'GRUPO DOS SEGUIDORES',
    description: 'Grupo geral para acompanhar a comunidade e trocar ideia.',
    href: 'https://chat.whatsapp.com/JM27GGiEFzRFtUyuc8wUdk',
  },
  {
    icon: '🎮',
    eyebrow: 'Discord oficial',
    title: 'SERVIDOR DA COMUNIDADE',
    description: 'Regras, avisos e os espaços oficiais do canal.',
    href: 'https://discord.com/invite/JggtZ7qGY3',
  },
]

// Hub de links para quem já é engajado — o onboarding de quem está
// chegando agora vive em /boas-vindas (ver plano, revisão de UX).
export function Comunidade() {
  return (
    <>
      <section className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        <Reveal>
          <Container>
            <Eyebrow>Central da comunidade</Eyebrow>
            <h1 className="text-4xl sm:text-5xl">TODOS OS CAMINHOS</h1>
            <p className="mt-3 max-w-xl text-muted">Entre, participe e faça parte do universo GalindoGamerBR.</p>
          </Container>
        </Reveal>
      </section>

      <section id="numeros" className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <Eyebrow>Comunidade em números</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">A GALERA CRESCENDO</h2>
            <p className="mt-3 max-w-xl text-muted">
              Seguidores em cada rede, atualizados a cada hora, e as visitas do site — tudo num só lugar.
            </p>
            <LiveNowBadge />
            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_14rem]">
              <CommunityStatsGrid />
              <SiteVisitsCard />
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {HUB_LINKS.map((link) => (
                <HubLink key={link.title} {...link} />
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section id="vip" className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <VipSteps variant="full" />
          </Container>
        </Reveal>
      </section>
    </>
  )
}
