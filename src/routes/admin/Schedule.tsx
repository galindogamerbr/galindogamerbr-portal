import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { Eyebrow } from '../../components/ui/Eyebrow'
import { Button } from '../../components/ui/Button'
import { useSession } from '../../hooks/useSession'
import { DAYS } from '../../data/days'
import {
  createVersion,
  getVersion,
  listVersions,
  publishVersion,
  saveBlocks,
  type ScheduleBlock,
} from '../../lib/api/schedule'
import { ScheduleExportButton } from '../../components/shared/ScheduleExportButton'

const LETTERS = 'ABCDEFGHIJ'

// Editor no-code da programação — v1 edita direto a versão publicada
// (não expõe rascunhos/histórico na UI ainda, embora o backend já suporte
// múltiplas versões via schedule_versions/schedule_blocks).
export function Schedule() {
  const { email, loading: sessionLoading } = useSession()
  const [versionId, setVersionId] = useState<number | null>(null)
  const [cycleLength, setCycleLength] = useState(2)
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [activeCycle, setActiveCycle] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!email) return
    void bootstrap()
  }, [email])

  async function bootstrap() {
    setLoading(true)
    try {
      const { versions } = await listVersions()
      let published = versions.find((v) => v.isPublished)

      if (!published) {
        const { id } = await createVersion('Programação', 2)
        await publishVersion(id)
        published = { id, label: 'Programação', cycleLength: 2, isPublished: true, createdAt: '' }
      }

      const detail = await getVersion(published.id)
      setVersionId(detail.id)
      setCycleLength(detail.cycleLength)
      setBlocks(detail.blocks)
    } finally {
      setLoading(false)
    }
  }

  function addBlock(dayOfWeek: number) {
    setBlocks((prev) => [...prev, { cycleIndex: activeCycle, dayOfWeek, startTime: '09:00', endTime: '12:00', note: null }])
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
      await saveBlocks(versionId, blocks)
      setMessage('Programação salva — já está no ar em /programacao.')
    } finally {
      setSaving(false)
    }
  }

  if (sessionLoading || loading) return null
  if (!email) return <Navigate to="/admin/login" replace />

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>Admin</Eyebrow>
        <h1 className="text-4xl">EDITOR DE PROGRAMAÇÃO</h1>
        <p className="mt-2 text-sm text-muted">Logado como {email}.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {Array.from({ length: cycleLength }, (_, cycleIndex) => (
            <button
              key={cycleIndex}
              type="button"
              onClick={() => setActiveCycle(cycleIndex)}
              className={`rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                activeCycle === cycleIndex ? 'bg-gold text-bg' : 'bg-panel2 text-white/70 hover:text-white'
              }`}
            >
              Semana {LETTERS[cycleIndex] ?? cycleIndex + 1}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {DAYS.map((day) => {
            const dayBlocks = blocks
              .map((block, index) => ({ block, index }))
              .filter(({ block }) => block.cycleIndex === activeCycle && block.dayOfWeek === day.value)

            return (
              <div key={day.value} className="rounded-md border border-line bg-panel p-4">
                <div className="flex items-center justify-between">
                  <b className="text-sm uppercase tracking-wide">{day.label}</b>
                  <button
                    type="button"
                    onClick={() => addBlock(day.value)}
                    className="text-xs font-semibold uppercase text-gold hover:underline"
                  >
                    + adicionar horário
                  </button>
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
                        <span className="text-white/40">–</span>
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
          <ScheduleExportButton cycleLength={cycleLength} blocks={blocks} />
          {message && <span className="text-sm text-muted">{message}</span>}
        </div>
      </Container>
    </section>
  )
}
