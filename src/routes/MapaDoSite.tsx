import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { NAV_ITEMS, FOOTER_ITEMS } from '../components/layout/navItems'

// Lista completa de páginas, separada por grupo (menu principal vs. rodapé)
// — existe porque o rodapé agora só mostra o que não está na navbar, então
// não tem mais um lugar único com todos os links pra quem quiser ver tudo.
export function MapaDoSite() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Navegação</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">MAPA DO SITE</h1>
        <p className="mt-3 text-muted">Todas as páginas do site, num lugar só.</p>

        <div className="mt-8 space-y-6 rounded-lg border border-line bg-panel p-6 sm:p-8">
          <div>
            <h2 className="text-lg text-white">Menu principal</h2>
            <ul className="mt-2 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gold hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg text-white">Outras páginas</h2>
            <ul className="mt-2 space-y-2">
              {FOOTER_ITEMS.filter((item) => item.to !== '/mapa-do-site').map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gold hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
