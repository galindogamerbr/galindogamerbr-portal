import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import { SocialLinks } from './SocialLinks'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-container items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="GalindoGamerBR — início">
          <img
            src="/assets/logos/galindogamerbr.webp"
            alt="Logo GalindoGamerBR"
            className="h-[52px] w-[52px] rounded-full object-cover"
          />
          <div className="leading-tight">
            <strong className="block text-sm tracking-wide">GALINDOGAMERBR</strong>
            <small className="block text-[10px] uppercase tracking-widest text-muted">Streaming Community</small>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Menu principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-wide transition hover:text-gold ${
                  isActive ? 'text-gold' : 'text-white/80'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:block">
          <SocialLinks />
        </div>

        <button
          type="button"
          className="rounded-md border border-line px-3 py-2 text-xl leading-none xl:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
