import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './routes/Home'
import { ComeceAqui } from './routes/ComeceAqui'
import { Conteudos } from './routes/Conteudos'
import { Comunidade } from './routes/Comunidade'
import { Sobre } from './routes/Sobre'
// TODO: reativar rota /parceiros (import + registro abaixo) quando a página/fluxo de parceiros estiver pronto
// import { Parceiros } from './routes/Parceiros'
import { Contato } from './routes/Contato'
import { Privacidade } from './routes/Privacidade'
import { NotFound } from './routes/NotFound'
import { Login } from './routes/admin/Login'
import { Schedule } from './routes/admin/Schedule'

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/boas-vindas', element: <ComeceAqui /> },
      { path: '/comece-aqui', element: <Navigate to="/boas-vindas" replace /> },
      { path: '/conteudos', element: <Conteudos /> },
      { path: '/jogos', element: <Navigate to="/conteudos" replace /> },
      { path: '/comunidade', element: <Comunidade /> },
      { path: '/sobre', element: <Sobre /> },
      // { path: '/parceiros', element: <Parceiros /> },
      { path: '/contato', element: <Contato /> },
      { path: '/privacidade', element: <Privacidade /> },
      { path: '/admin', element: <Navigate to="/admin/login" replace /> },
      { path: '/admin/login', element: <Login /> },
      { path: '/admin/programacao', element: <Schedule /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
