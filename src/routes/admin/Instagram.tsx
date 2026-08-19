import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { Button } from '../../components/ui/Button'
import { useSession } from '../../hooks/useSession'
import { logout } from '../../lib/api/auth'
import { connectInstagram, disconnectInstagram, getInstagramStatus, type InstagramStatus } from '../../lib/api/instagram'

// Sem fluxo OAuth próprio — o token de acesso do Instagram é gerado
// manualmente no App Dashboard da Meta (Casos de uso → Gerenciar
// mensagens e conteúdo no Instagram → "Gerar tokens de acesso") e colado
// aqui uma vez. O worker (workers/social-stats-cron) renova sozinho depois.
export function Instagram() {
  const { email, loading: sessionLoading, refresh } = useSession()
  const [status, setStatus] = useState<InstagramStatus | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [igUserId, setIgUserId] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!email) return
    getInstagramStatus().then(setStatus)
  }, [email])

  async function handleLogout() {
    await logout()
    refresh()
  }

  async function handleDisconnect() {
    if (!window.confirm('Desvincular a conta do Instagram? A sincronização de seguidores para de funcionar até reconectar.')) return
    setDisconnecting(true)
    await disconnectInstagram()
    setStatus(await getInstagramStatus())
    setDisconnecting(false)
  }

  async function handleConnect(event: FormEvent) {
    event.preventDefault()
    setConnecting(true)
    setError(null)
    const result = await connectInstagram(accessToken, igUserId)
    if (result.ok) {
      setAccessToken('')
      setIgUserId('')
      setStatus(await getInstagramStatus())
    } else {
      setError('Token ou ID inválido — confere se copiou certo e tenta de novo.')
    }
    setConnecting(false)
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
              <div className="flex items-center gap-3">
                {status.avatarUrl && (
                  <img src={status.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                )}
                <p className="text-sm text-white">
                  ✅ Conectado{status.username ? <> como <span className="font-semibold">@{status.username}</span></> : null}.
                </p>
              </div>
              <p className="mt-2 text-xs text-muted">Última renovação: {status.updatedAt}</p>
              <p className="text-xs text-muted">Expira em: {status.expiresAt}</p>
              <Button variant="red" size="sm" className="mt-4" onClick={handleDisconnect} disabled={disconnecting}>
                {disconnecting ? 'Desvinculando…' : 'Desvincular'}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-white">Ainda não conectado.</p>
              <p className="mt-1 text-xs text-muted">
                Gera um token no App Dashboard da Meta (Casos de uso → Gerenciar mensagens e conteúdo no Instagram →
                "Gerar tokens de acesso" → conta do canal → "Gerar token") e cola os dois campos abaixo.
              </p>
            </>
          )}

          <form onSubmit={handleConnect} className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Token de acesso
              <input
                type="text"
                required
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="rounded-md border border-line bg-panel2 px-3 py-2 text-sm text-white outline-none focus:border-gold"
                placeholder="IGAA..."
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              ID da conta
              <input
                type="text"
                required
                value={igUserId}
                onChange={(e) => setIgUserId(e.target.value)}
                className="rounded-md border border-line bg-panel2 px-3 py-2 text-sm text-white outline-none focus:border-gold"
                placeholder="17841401077724198"
              />
            </label>
            {error && <p className="text-xs text-red">{error}</p>}
            <Button type="submit" variant="gold" size="sm" disabled={connecting} className="self-start">
              {connecting ? 'Conectando…' : status?.connected ? 'Reconectar' : 'Conectar'}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  )
}
