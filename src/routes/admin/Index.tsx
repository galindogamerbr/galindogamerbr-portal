import { Link, Navigate } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { useSession } from '../../hooks/useSession'
import { logout } from '../../lib/api/auth'

const SECTIONS = [
  { label: 'Programação', description: 'Editor da grade de horários da semana.', to: '/admin/programacao' },
  { label: 'Instagram', description: 'Conectar a conta pra sincronizar seguidores.', to: '/admin/instagram' },
  { label: 'TikTok', description: 'Conectar a conta pra sincronizar seguidores.', to: '/admin/tiktok' },
]

export function AdminIndex() {
  const { email, loading, refresh } = useSession()

  async function handleLogout() {
    await logout()
    refresh()
  }

  if (loading) return null
  if (!email) return <Navigate to="/admin/login" replace />

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>Admin</Eyebrow>
        <h1 className="text-4xl">PAINEL</h1>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-muted">Logado como {email}.</p>
          <button type="button" onClick={handleLogout} className="text-xs font-semibold uppercase text-white/50 hover:text-red">
            Sair
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="rounded-lg border border-line bg-panel p-6 transition-colors hover:border-gold/60"
            >
              <span className="block text-base font-bold uppercase tracking-wide">{section.label}</span>
              <span className="mt-1 block text-xs text-muted">{section.description}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
