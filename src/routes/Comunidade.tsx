import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { HubLink } from '../components/shared/HubLink'
import { VipSteps } from '../components/shared/VipSteps'

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
      <section className="py-16 sm:py-24">
        <Reveal>
          <Container>
            <Eyebrow>Central da comunidade</Eyebrow>
            <h1 className="text-4xl sm:text-5xl">TODOS OS CAMINHOS</h1>
            <p className="mt-3 max-w-xl text-muted">Entre, participe e faça parte do universo GalindoGamerBR.</p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
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
