import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { useSession } from '../../hooks/useSession'
import { logout } from '../../lib/api/auth'
import { getFlag } from '../../lib/api/flags'

const ALL_SECTIONS = [
  {
    label: 'Programação',
    description: 'Editor da grade de horários da semana.',
    to: '/admin/programacao',
    icon: '/assets/icons/schedule-icon-calendar.png',
  },
  {
    label: 'TikTok',
    description: 'Conectar a conta pra sincronizar seguidores.',
    to: '/admin/tiktok',
    icon: '/assets/icons/tiktok.svg',
  },
  {
    label: 'Instagram',
    description: 'Conectar a conta pra sincronizar seguidores.',
    to: '/admin/instagram',
    icon: '/assets/icons/instagram.svg',
    // Controlado por feature flag (Cloudflare Flagship, app
    // "Instagram-Admin") — liga/desliga pelo dashboard sem deploy.
    flag: 'admin-instagram-visible',
  },
]

export function AdminIndex() {
  const { email, loading, refresh } = useSession()
  const [instagramVisible, setInstagramVisible] = useState(false)

  useEffect(() => {
    if (!email) return
    getFlag('admin-instagram-visible').then(setInstagramVisible)
  }, [email])

  async function handleLogout() {
    await logout()
    refresh()
  }

  if (loading) return null
  if (!email) return <Navigate to="/admin/login" replace />

  const sections = ALL_SECTIONS.filter((section) => !section.flag || instagramVisible)

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

        <div className={`mt-8 grid grid-cols-1 gap-4 sm:${sections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {sections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="rounded-lg border border-line bg-panel p-6 transition-colors hover:border-gold/60"
            >
              <div className="flex items-center gap-3">
                <img src={section.icon} alt="" className="h-8 w-8 shrink-0 object-contain" />
                <span className="block text-base font-bold uppercase tracking-wide">{section.label}</span>
              </div>
              <span className="mt-2 block text-xs text-muted">{section.description}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
