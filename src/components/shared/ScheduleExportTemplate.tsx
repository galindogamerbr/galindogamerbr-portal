import { forwardRef } from 'react'
import { theme, fontStack } from '../../styles/theme'
import { DAYS } from '../../data/days'
import type { ScheduleBlock } from '../../lib/api/schedule'

const LETTERS = 'ABCDEFGHIJ'

type ScheduleExportTemplateProps = {
  cycleLength: number
  blocks: ScheduleBlock[]
}

// Template offscreen renderizado pra exportação de imagem (ScheduleExportButton).
// Usa valores literais de theme.ts em vez de classes Tailwind — o
// html-to-image precisa que os estilos computados sejam resolvidos de
// forma previsível no clone do DOM, então evitamos depender do pipeline
// de utilitários aqui (ver plano, Fase 3).
export const ScheduleExportTemplate = forwardRef<HTMLDivElement, ScheduleExportTemplateProps>(function ScheduleExportTemplate(
  { cycleLength, blocks },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        padding: 56,
        backgroundColor: theme.colors.bg,
        color: theme.colors.white,
        fontFamily: fontStack('body'),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <img src="/assets/logos/galindogamerbr.webp" alt="" width={56} height={56} />
        <div>
          <div style={{ fontFamily: fontStack('display'), fontSize: 28, letterSpacing: 1 }}>
            GALINDO<span style={{ color: theme.colors.gold }}>GAMERBR</span>
          </div>
          <div style={{ fontSize: 16, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: 2 }}>
            Programação semanal
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {Array.from({ length: cycleLength }, (_, cycleIndex) => (
          <div key={cycleIndex}>
            <div
              style={{
                fontFamily: fontStack('display'),
                fontSize: 24,
                color: theme.colors.gold,
                marginBottom: 12,
                letterSpacing: 1,
              }}
            >
              SEMANA {LETTERS[cycleIndex] ?? cycleIndex + 1}
            </div>
            <div style={{ border: `1px solid ${theme.colors.line}`, borderRadius: 10, overflow: 'hidden' }}>
              {DAYS.map((day, dayIndex) => {
                const dayBlocks = blocks.filter((b) => b.cycleIndex === cycleIndex && b.dayOfWeek === day.value)
                return (
                  <div
                    key={day.value}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      backgroundColor: theme.colors.panel,
                      borderTop: dayIndex === 0 ? 'none' : `1px solid ${theme.colors.line}`,
                      fontSize: 18,
                    }}
                  >
                    <b>{day.label}</b>
                    {dayBlocks.length > 0 ? (
                      <span style={{ color: theme.colors.muted }}>
                        {dayBlocks.map((b) => `${b.startTime}–${b.endTime}`).join(' | ')}
                      </span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>OFFLINE</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, fontSize: 14, color: theme.colors.muted, textAlign: 'center' }}>
        Horários de Brasília (GMT-3) • youtube.com/@galindogamerbr
      </div>
    </div>
  )
})
