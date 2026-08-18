import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageBackground } from './PageBackground'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Fundo padrão de todas as páginas — uma página específica pode
          sobrepor renderizando seu próprio <PageBackground> (ex.: Sobre.tsx),
          que vence por vir depois no DOM, mesmo z-index. */}
      <PageBackground image="/assets/body-bg.webp" />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
