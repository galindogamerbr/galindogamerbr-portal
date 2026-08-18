import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { LinkButton } from '../../components/ui/Button'
import { useSession } from '../../hooks/useSession'
import { logout } from '../../lib/api/auth'
import { getInstagramStatus, type InstagramStatus } from '../../lib/api/instagram'

// Conectar uma vez aqui autoriza o worker (workers/social-stats-cron) a
// buscar o número de seguidores via Instagram Graph API — ele renova o
// token sozinho a cada rodada (dura ~60 dias, renovação estende por mais
// 60), não precisa logar de novo depois desse passo inicial.
export function Instagram() {
  const { email, loading: sessionLoading, refresh } = useSession()
  const [status, setStatus] = useState<InstagramStatus | null>(null)

  useEffect(() => {
    if (!email) return
    getInstagramStatus().then(setStatus)
  }, [email])

  async function handleLogout() {
    await logout()
    refresh()
  }

  if (sessionLoading) return null
  if (!email) return <Navigate to="/admin/login" replace />

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-xl">
        <Eyebrow>Admin</Eyebrow>
        <h1 className="text-4xl">CONECTAR INSTAGRAM</h1>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-muted">Logado como {email}.</p>
          <button type="button" onClick={handleLogout} className="text-xs font-semibold uppercase text-white/50 hover:text-red">
            Sair
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-line bg-panel p-6">
          {status === null ? (
            <p className="text-sm text-muted">Carregando…</p>
          ) : status.connected ? (
            <>
              <p className="text-sm text-white">✅ Conectado.</p>
              <p className="mt-1 text-xs text-muted">Última renovação: {status.updatedAt}</p>
              <p className="text-xs text-muted">Expira em: {status.expiresAt}</p>
              <LinkButton variant="gold" size="sm" className="mt-4" href="/api/admin/instagram/authorize">
                Reconectar
              </LinkButton>
            </>
          ) : (
            <>
              <p className="text-sm text-white">Ainda não conectado.</p>
              <p className="mt-1 text-xs text-muted">
                Clica no botão abaixo, loga com a conta do Instagram do canal e autoriza — só precisa fazer isso uma
                vez.
              </p>
              <LinkButton variant="gold" size="sm" className="mt-4" href="/api/admin/instagram/authorize">
                Conectar Instagram
              </LinkButton>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
