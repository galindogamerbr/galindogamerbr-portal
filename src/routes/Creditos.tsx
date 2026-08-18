import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

const ICON_CREDITS = [
  { label: 'Sun icons created by Magnific - Flaticon', href: 'https://www.flaticon.com/free-icons/sun' },
  { label: 'Sunset icons created by Magnific - Flaticon', href: 'https://www.flaticon.com/free-icons/sunset' },
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
          <div className="flex items-center gap-4">
            <img
              src="/assets/pedro-avatar.webp"
              alt="Pedro Henrique"
              className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
            />
            <div>
              <h2 className="text-lg text-white">Desenvolvimento</h2>
              <p className="mt-1">
                Site desenvolvido por{' '}
                <a
                  href="https://www.linkedin.com/in/pedrogmoreira/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  Pedro Henrique
                </a>
                .
              </p>
              <p className="mt-1 text-sm text-white/50">Discord: ph_brz</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg text-white">Ícones</h2>
            <ul className="mt-2 space-y-2">
              {ICON_CREDITS.map((credit) => (
                <li key={credit.href}>
                  <a href={credit.href} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
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
