import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { useSession } from '../../hooks/useSession'
import { getAdminFarmVideos, setFarmVideos } from '../../lib/api/farm'
import { logout } from '../../lib/api/auth'

export function FarmWelcomeVideo() {
  const { email, loading: sessionLoading, refresh } = useSession()
  const [welcomeInput, setWelcomeInput] = useState('')
  const [rulesInput, setRulesInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!email) return
    getAdminFarmVideos()
      .then((videos) => {
        setWelcomeInput(`https://www.youtube.com/watch?v=${videos.welcomeVideoId}`)
        setRulesInput(`https://www.youtube.com/watch?v=${videos.rulesVideoId}`)
      })
      .catch(() => setError('Não foi possível carregar os vídeos atuais.'))
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
    const result = await setFarmVideos(welcomeInput, rulesInput)
    setSaving(false)

    if (!result.ok) {
      setError('Informe uma URL válida do YouTube ou o ID do vídeo.')
      return
    }

    setWelcomeInput(`https://www.youtube.com/watch?v=${result.videos.welcomeVideoId}`)
    setRulesInput(`https://www.youtube.com/watch?v=${result.videos.rulesVideoId}`)
    setSaved(true)
  }

  if (sessionLoading) return null
  if (!email) return <Navigate to="/admin/login" replace />

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-xl">
        <AdminHeader title="CONFIGURAÇÃO DE VÍDEOS" email={email} onLogout={handleLogout} backTo="/admin" />

        <div className="mt-6 space-y-6 rounded-lg border border-line bg-panel p-6">
          <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="farm-welcome-video">
            Vídeo de boas vindas
          </label>
          <input
            id="farm-welcome-video"
            type="text"
            value={welcomeInput}
            onChange={(event) => setWelcomeInput(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-2 w-full rounded-lg border border-line bg-panel2 px-4 py-2 text-sm text-white outline-none focus:border-gold"
            disabled={loading}
          />
            <p className="mt-2 text-xs text-muted">Exibido na página Boas vindas.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="farm-rules-video">
              Vídeo das regras da Fazenda
            </label>
            <input
              id="farm-rules-video"
              type="text"
              value={rulesInput}
              onChange={(event) => setRulesInput(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-2 w-full rounded-lg border border-line bg-panel2 px-4 py-2 text-sm text-white outline-none focus:border-gold"
              disabled={loading}
            />
            <p className="mt-2 text-xs text-muted">Exibido no card de requisitos da página Fazenda.</p>
          </div>

          <p className="text-xs text-muted">Os campos aceitam link normal, youtu.be, embed, Shorts ou o ID de 11 caracteres.</p>
          {error && <p className="mt-3 text-xs text-red">{error}</p>}
          {saved && <p className="text-xs text-gold">Configuração de vídeos atualizada.</p>}
          <Button
            variant="gold"
            size="sm"
            onClick={handleSave}
            disabled={loading || saving || !welcomeInput.trim() || !rulesInput.trim()}
          >
            {saving ? 'Salvando…' : 'Salvar configuração'}
          </Button>
        </div>
      </Container>
    </section>
  )
}
