import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { ScheduleTabs } from '../components/shared/ScheduleTabs'
import { PublicScheduleExportButton } from '../components/shared/PublicScheduleExportButton'
import { LinkButton } from '../components/ui/Button'

const PLATFORMS = [
  { name: 'YouTube', href: 'https://www.youtube.com/@galindogamerbr', note: 'Lives e vídeos', icon: 'youtube', variant: 'red' as const },
  { name: 'Twitch', href: 'https://www.twitch.tv/galindogamerbr', note: 'Lives', icon: 'twitch', variant: 'purple' as const },
  { name: 'Kick', href: 'https://kick.com/galindogamerbr', note: 'Lives', icon: 'kick', variant: 'green' as const },
  { name: 'TikTok', href: 'https://www.tiktok.com/@galindogamerbr', note: 'Cortes e novidades', icon: 'tiktok', variant: 'default' as const },
]

export function Programacao() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Reveal>
          <Container className="max-w-2xl">
            <Eyebrow>Agenda</Eyebrow>
            <h1 className="text-4xl sm:text-5xl">PROGRAMAÇÃO SEMANAL</h1>
            <p className="mt-3 text-muted">
              Horários de Brasília (GMT-3). A programação alterna entre a Semana A e a Semana B.
            </p>
            <div className="mt-8">
              <ScheduleTabs />
            </div>
            <div className="mt-4">
              <PublicScheduleExportButton />
            </div>
            <p className="mt-6 rounded-md border border-line bg-panel p-4 text-sm text-muted">
              <strong className="text-white">Importante:</strong> por causa do trabalho na cidade, o cronograma pode
              sofrer alterações. Todos os domingos, a programação é atualizada no TikTok, Instagram e YouTube.
            </p>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div className="rounded-lg border border-line bg-panel p-6 sm:p-8">
              <Eyebrow>Onde acompanhar</Eyebrow>
              <h2 className="text-2xl sm:text-3xl">MULTIPLATAFORMA</h2>
              <p className="mt-2 max-w-xl text-muted">
                As lives e os conteúdos do GalindoGamerBR estão distribuídos entre as principais redes.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PLATFORMS.map((platform) => (
                  <LinkButton
                    key={platform.name}
                    variant={platform.variant}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-col items-start gap-1 normal-case"
                  >
                    <img src={`/assets/icons/${platform.icon}.svg`} alt="" className="h-5 w-5" />
                    <span className="font-semibold">{platform.name}</span>
                    <span className="text-xs font-normal opacity-80">{platform.note}</span>
                  </LinkButton>
                ))}
              </div>
            </div>
          </Container>
        </Reveal>
      </section>
    </>
  )
}
