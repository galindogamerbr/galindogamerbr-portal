import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { Button } from '../../components/ui/Button'
import { useSession } from '../../hooks/useSession'
import { logout } from '../../lib/api/auth'
import { DAYS } from '../../data/days'
import {
  createVersion,
  getVersion,
  listVersions,
  publishVersion,
  saveBlocks,
  updateVersion,
  type ScheduleBlock,
} from '../../lib/api/schedule'
import { ScheduleExportButton } from '../../components/shared/ScheduleExportButton'
import { ScheduleExportTemplate } from '../../components/shared/ScheduleExportTemplate'
import { renderScheduleImage } from '../../lib/exportScheduleImage'

// Editor no-code da programação — puramente semanal (sem Semana A/B), pra
// ajustar toda semana com facilidade. v1 edita direto a versão publicada
// (não expõe rascunhos/histórico na UI ainda, embora o backend ainda suporte
// múltiplas versões via schedule_versions/schedule_blocks).
export function Schedule() {
  const { email, loading: sessionLoading, refresh } = useSession()
  const [versionId, setVersionId] = useState<number | null>(null)
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const discordPortraitRef = useRef<HTMLDivElement>(null)

  async function bootstrap() {
    try {
      const { versions } = await listVersions()
      let published = versions.find((v) => v.isPublished)

      if (!published) {
        const { id } = await createVersion('Programação', 1)
        await publishVersion(id)
        published = { id, label: 'Programação', cycleLength: 1, isPublished: true, createdAt: '' }
      }

      const detail = await getVersion(published.id)

      // Migra versões antigas de Semana A/B (cycle_length > 1) pra uma
      // única semana, descartando os blocos de ciclos extras.
      const weekBlocks = detail.blocks.filter((b) => b.cycleIndex === 0)
      if (detail.cycleLength !== 1) {
        await updateVersion(detail.id, { cycleLength: 1, label: 'Programação' })
      }

      setVersionId(detail.id)
      setBlocks(weekBlocks)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!email) return
    void bootstrap()
  }, [email])

  function addBlock(dayOfWeek: number, startTime: string, endTime: string) {
    setBlocks((prev) => [...prev, { cycleIndex: 0, dayOfWeek, startTime, endTime, note: null }])
  }

  async function handleLogout() {
    await logout()
    refresh()
  }

  function updateBlock(index: number, field: 'startTime' | 'endTime', value: string) {
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, [field]: value } : block)))
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!versionId) return
    setSaving(true)
    setMessage(null)
    try {
      const portraitImageDataUrl = discordPortraitRef.current
        ? await renderScheduleImage(discordPortraitRef.current)
        : undefined
      const result = await saveBlocks(versionId, blocks, portraitImageDataUrl)
      setMessage(
        result.discordPublished
          ? 'Programação salva na home e publicada no Discord.'
          : 'Programação salva. Não houve alteração para publicar no Discord.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (sessionLoading) return null
  if (!email) return <Navigate to="/admin/login" replace />
  if (loading) return null

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <AdminHeader title="EDITOR DE PROGRAMAÇÃO" email={email} onLogout={handleLogout} backTo="/admin" />

        <div className="mt-4 space-y-3">
          {DAYS.map((day) => {
            const dayBlocks = blocks
              .map((block, index) => ({ block, index }))
              .filter(({ block }) => block.dayOfWeek === day.value)
              .sort((a, b) => a.block.startTime.localeCompare(b.block.startTime))
            const canAddMore = dayBlocks.length < 2
            const hasMorning = dayBlocks.some(({ block }) => block.startTime < '12:00')
            const hasAfternoon = dayBlocks.some(({ block }) => block.startTime >= '12:00')

            return (
              <div key={day.value} className="rounded-md border border-line bg-panel p-4">
                <div className="flex items-center justify-between">
                  <b className="text-sm uppercase tracking-wide">{day.label}</b>
                  {canAddMore && (!hasMorning || !hasAfternoon) && (
                    <div className="flex gap-3">
                      {!hasMorning && (
                        <button
                          type="button"
                          onClick={() => addBlock(day.value, '08:00', '12:00')}
                          className="text-xs font-semibold uppercase text-gold hover:underline"
                        >
                          + manhã
                        </button>
                      )}
                      {!hasAfternoon && (
                        <button
                          type="button"
                          onClick={() => addBlock(day.value, '14:00', '18:00')}
                          className="text-xs font-semibold uppercase text-gold hover:underline"
                        >
                          + tarde
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {dayBlocks.length === 0 ? (
                  <p className="mt-2 text-xs text-white/30">OFFLINE</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {dayBlocks.map(({ block, index }) => (
                      <div key={index} className="flex items-center gap-2 rounded-md border border-line bg-panel2 px-3 py-2">
                        <input
                          type="time"
                          value={block.startTime}
                          onChange={(e) => updateBlock(index, 'startTime', e.target.value)}
                          className="bg-transparent text-sm text-white outline-none"
                        />
                        <span className="text-white/40">até</span>
                        <input
                          type="time"
                          value={block.endTime}
                          onChange={(e) => updateBlock(index, 'endTime', e.target.value)}
                          className="bg-transparent text-sm text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeBlock(index)}
                          aria-label="Remover horário"
                          className="ml-1 text-white/40 hover:text-red"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button variant="gold" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar programação'}
          </Button>
          <ScheduleExportButton blocks={blocks} />
          {message && <span className="text-sm text-muted">{message}</span>}
        </div>
        <div style={{ position: 'fixed', top: 0, left: -9999, pointerEvents: 'none' }} aria-hidden="true">
          <ScheduleExportTemplate ref={discordPortraitRef} blocks={blocks} variant="portrait" />
        </div>
      </Container>
    </section>
  )
}
