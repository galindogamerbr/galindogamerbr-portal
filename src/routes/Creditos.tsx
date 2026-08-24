import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { CreditMember } from '../components/shared/CreditMember'

const CREDIT_MEMBERS = [
  {
    name: 'Pedro Henrique',
    description: 'Site desenvolvido por',
    avatar: '/assets/pedro-avatar.webp',
    links: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/pedrogmoreira/',
        icon: '/assets/icons/linkedin.svg',
      },
      {
        label: 'Discord',
        href: 'https://discord.com/users/276859538349752321',
        icon: '/assets/icons/discord.svg',
      },
    ],
  },
]

const ICON_CREDITS = [
  {
    label: 'Sun icons created by Magnific - Flaticon',
    href: 'https://www.flaticon.com/free-icons/sun',
    icon: '/assets/icons/schedule-icon-sun.png',
  },
  {
    label: 'Sunset icons created by Magnific - Flaticon',
    href: 'https://www.flaticon.com/free-icons/sunset',
    icon: '/assets/icons/schedule-icon-sunset.png',
  },
  {
    label: 'Instagram icons created by Magnific - Flaticon',
    href: 'https://www.flaticon.com/br/icones-gratis/instagram',
    icon: '/assets/logos/instagram.png',
  },
  {
    label: 'Youtube icons created by Magnific - Flaticon',
    href: 'https://www.flaticon.com/br/icones-gratis/youtube',
    icon: '/assets/logos/youtube.png',
  },
  {
    label: 'Tik tok icons created by Magnific - Flaticon',
    href: 'https://www.flaticon.com/br/icones-gratis/tik-tok',
    icon: '/assets/logos/tiktok.png',
  },
  {
    label: 'Twitch icons created by Laisa Islam Ani - Flaticon',
    href: 'https://www.flaticon.com/free-icons/twitch',
    icon: '/assets/logos/twitch.png',
  },
]

// Lista de créditos de ícones/assets de terceiros usados no site — página
// própria em vez de lotar o rodapé, já que essa lista só tende a crescer.
export function Creditos() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">CRÉDITOS</h1>
        <p className="mt-3 text-muted">Quem ajudou a construir este site, e os assets de terceiros usados nele.</p>

        <div className="mt-8 space-y-6 rounded-lg border border-line bg-panel p-6 text-muted sm:p-8">
          <div>
            <h2 className="text-lg text-white">Desenvolvimento</h2>
            <div className="mt-2 space-y-4">
              {CREDIT_MEMBERS.map((member) => (
                <CreditMember key={member.name} {...member} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg text-white">Ícones</h2>
            <ul className="mt-2 space-y-2">
              {ICON_CREDITS.map((credit) => (
                <li key={credit.href}>
                  <a
                    href={credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gold hover:underline"
                  >
                    <img src={credit.icon} alt="" className="h-8 w-8 shrink-0 object-contain" />
                    {credit.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
