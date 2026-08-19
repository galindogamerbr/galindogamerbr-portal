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
import { Login } from './routes/admin/Login'
import { AdminIndex } from './routes/admin/Index'
import { Schedule } from './routes/admin/Schedule'
import { TikTok } from './routes/admin/TikTok'

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
      { path: '/admin', element: <AdminIndex /> },
      { path: '/admin/login', element: <Login /> },
      { path: '/admin/programacao', element: <Schedule /> },
      { path: '/admin/tiktok', element: <TikTok /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
