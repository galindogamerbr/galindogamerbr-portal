import { lazy, Suspense, type ReactElement } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './routes/Home'
import { BemVindo } from './routes/BemVindo'
import { Conteudos } from './routes/Conteudos'
import { Comunidade } from './routes/Comunidade'
import { Sobre } from './routes/Sobre'
// TODO: reativar rota /parceiros (import + registro abaixo) quando a página/fluxo de parceiros estiver pronto
// import { Parceiros } from './routes/Parceiros'
import { Contato } from './routes/Contato'
import { Privacidade } from './routes/Privacidade'
import { Termos } from './routes/Termos'
import { Creditos } from './routes/Creditos'
import { NotFound } from './routes/NotFound'

// Rotas /admin/*: ninguém que não seja o próprio admin visita — importar
// estático colocava Login/editor de programação/TikTok no bundle de
// qualquer visitante da Home. Um único Suspense pro grupo inteiro (a
// navegação entre elas já é rara o suficiente pra não precisar de
// granularidade por rota).
const Login = lazy(() => import('./routes/admin/Login').then((m) => ({ default: m.Login })))
const AdminIndex = lazy(() => import('./routes/admin/Index').then((m) => ({ default: m.AdminIndex })))
const Schedule = lazy(() => import('./routes/admin/Schedule').then((m) => ({ default: m.Schedule })))
const TikTok = lazy(() => import('./routes/admin/TikTok').then((m) => ({ default: m.TikTok })))

function AdminRouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-gold" />
    </div>
  )
}

function withAdminSuspense(element: ReactElement): ReactElement {
  return <Suspense fallback={<AdminRouteFallback />}>{element}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/boas-vindas', element: <BemVindo /> },
      { path: '/comece-aqui', element: <Navigate to="/boas-vindas" replace /> },
      { path: '/conteudos', element: <Conteudos /> },
      { path: '/jogos', element: <Navigate to="/conteudos" replace /> },
      { path: '/comunidade', element: <Comunidade /> },
      { path: '/sobre', element: <Sobre /> },
      // { path: '/parceiros', element: <Parceiros /> },
      { path: '/contato', element: <Contato /> },
      { path: '/privacidade', element: <Privacidade /> },
      { path: '/termos', element: <Termos /> },
      { path: '/creditos', element: <Creditos /> },
      { path: '/admin', element: withAdminSuspense(<AdminIndex />) },
      { path: '/admin/login', element: withAdminSuspense(<Login />) },
      { path: '/admin/programacao', element: withAdminSuspense(<Schedule />) },
      { path: '/admin/tiktok', element: withAdminSuspense(<TikTok />) },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
