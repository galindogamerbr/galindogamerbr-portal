import { Link } from 'react-router-dom'
import { FOOTER_ITEMS } from './navItems'
import { Container } from '../ui/Container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-bg py-10">
      <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logos/galindogamerbr.webp" alt="Logo" className="h-[38px] w-[38px] rounded-full object-cover" />
          <strong>
            GALINDO<span className="text-gold">GAMERBR</span>
          </strong>
        </Link>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/70" aria-label="Rodapé">
          {FOOTER_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
      <p className="mt-6 text-center text-xs text-muted">© 2026 GalindoGamerBR — Todos os direitos reservados.</p>
    </footer>
  )
}
