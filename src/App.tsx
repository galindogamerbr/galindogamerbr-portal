import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './routes/Home'
import { ComeceAqui } from './routes/ComeceAqui'
import { Jogos } from './routes/Jogos'
import { Programacao } from './routes/Programacao'
import { Comunidade } from './routes/Comunidade'
import { Sobre } from './routes/Sobre'
import { Parceiros } from './routes/Parceiros'
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
      { path: '/comece-aqui', element: <ComeceAqui /> },
      { path: '/jogos', element: <Jogos /> },
      { path: '/programacao', element: <Programacao /> },
      { path: '/comunidade', element: <Comunidade /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/parceiros', element: <Parceiros /> },
      { path: '/contato', element: <Contato /> },
      { path: '/privacidade', element: <Privacidade /> },
      { path: '/admin/login', element: <Login /> },
      { path: '/admin/programacao', element: <Schedule /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
