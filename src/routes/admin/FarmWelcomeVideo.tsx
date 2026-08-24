import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { useSession } from '../../hooks/useSession'
import { getAdminFarmWelcomeVideo, setFarmWelcomeVideo } from '../../lib/api/farm'
import { logout } from '../../lib/api/auth'

export function FarmWelcomeVideo() {
  const { email, loading: sessionLoading, refresh } = useSession()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!email) return
    getAdminFarmWelcomeVideo()
      .then((videoId) => setInput(`https://www.youtube.com/watch?v=${videoId}`))
      .catch(() => setError('Não foi possível carregar o vídeo atual.'))
      .finally(() => setLoading(false))
  }, [email])

  async function handleLogout() {
    await logout()
    refresh()
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)
    const result = await setFarmWelcomeVideo(input)
    setSaving(false)

    if (!result.ok) {
      setError('Informe uma URL válida do YouTube ou o ID do vídeo.')
      return
    }

    setInput(`https://www.youtube.com/watch?v=${result.videoId}`)
    setSaved(true)
  }

  if (sessionLoading) return null
  if (!email) return <Navigate to="/admin/login" replace />

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-xl">
        <AdminHeader title="VÍDEO DE BOAS-VINDAS" email={email} onLogout={handleLogout} backTo="/admin" />

        <div className="mt-6 rounded-lg border border-line bg-panel p-6">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="farm-welcome-video">
            Vídeo do YouTube
          </label>
          <input
            id="farm-welcome-video"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-2 w-full rounded-lg border border-line bg-panel2 px-4 py-2 text-sm text-white outline-none focus:border-gold"
            disabled={loading}
          />
          <p className="mt-3 text-xs text-muted">Aceita link normal, youtu.be, embed, Shorts ou o ID de 11 caracteres do vídeo.</p>
          {error && <p className="mt-3 text-xs text-red">{error}</p>}
          {saved && <p className="mt-3 text-xs text-gold">Vídeo atualizado. A página Fazenda já usará a nova configuração.</p>}
          <Button variant="gold" size="sm" className="mt-5" onClick={handleSave} disabled={loading || saving || !input.trim()}>
            {saving ? 'Salvando…' : 'Salvar vídeo'}
          </Button>
        </div>
      </Container>
    </section>
  )
}
