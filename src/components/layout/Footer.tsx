import { Link } from 'react-router-dom'
import { FOOTER_ITEMS } from './navItems'
import { Container } from '../ui/Container'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line py-10">
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
      <p className="mt-6 text-center text-xs text-muted">
        © 2026 GalindoGamerBR — Todos os direitos reservados.{' '}
        <Link to="/admin/programacao" className="text-white/20 hover:text-white/50">
          admin
        </Link>
      </p>
      <p className="mt-2 text-center text-[11px] text-white/30">
        <a href="https://www.flaticon.com/free-icons/sun" title="sun icons" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">
          Sun icons created by Magnific - Flaticon
        </a>{' '}
        ·{' '}
        <a href="https://www.flaticon.com/free-icons/sunset" title="sunset icons" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">
          Sunset icons created by Magnific - Flaticon
        </a>
      </p>
    </footer>
  )
}
