import { useEffect, useState } from 'react'
import { DAYS } from '../../data/days'
import { getPublicSchedule, type PublicSchedule } from '../../lib/api/schedule'

const LETTERS = 'ABCDEFGHIJ'

function cycleLabel(index: number, total: number): string {
  // Ciclo de até 10 semanas usa "Semana A/B/C..." (nome familiar); além
  // disso cai pro genérico "Semana N" — não deve acontecer na prática.
  return total <= LETTERS.length ? `Semana ${LETTERS[index]}` : `Semana ${index + 1}`
}

// Reusado no teaser da Home e na página completa de Programação — busca
// direto de /api/schedule (editor no-code da Fase 3 escreve nesses dados).
export function ScheduleTabs() {
  const [schedule, setSchedule] = useState<PublicSchedule | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    getPublicSchedule().then(setSchedule)
  }, [])

  if (!schedule || schedule.weeks.length === 0) {
    return <div className="rounded-md border border-line bg-panel p-4 text-sm text-muted">Programação indisponível no momento.</div>
  }

  const week = schedule.weeks.find((w) => w.cycleIndex === active) ?? schedule.weeks[0]

  return (
    <div>
      {schedule.weeks.length > 1 && (
        <div role="tablist" aria-label="Escolha a semana" className="flex flex-wrap gap-2">
          {schedule.weeks.map((w) => (
            <button
              key={w.cycleIndex}
              type="button"
              role="tab"
              aria-selected={active === w.cycleIndex}
              onClick={() => setActive(w.cycleIndex)}
              className={`rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                active === w.cycleIndex ? 'bg-gold text-bg' : 'bg-panel2 text-white/70 hover:text-white'
              }`}
            >
              {cycleLabel(w.cycleIndex, schedule.weeks.length)}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 divide-y divide-line rounded-md border border-line bg-panel">
        {DAYS.map((day) => {
          const dayBlocks = week.blocks.filter((b) => b.dayOfWeek === day.value)
          return (
            <div key={day.value} className="flex items-center justify-between px-4 py-3 text-sm">
              <b className="text-white">{day.label}</b>
              {dayBlocks.length > 0 ? (
                <span className="text-muted">
                  {dayBlocks.map((b) => `${b.startTime}–${b.endTime}`).join(' | ')}
                </span>
              ) : (
                <span className="text-white/30">OFFLINE</span>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-muted">Horários de Brasília (GMT-3).</p>
    </div>
  )
}
