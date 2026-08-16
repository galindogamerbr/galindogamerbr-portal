import { forwardRef } from 'react'
import { fontStack } from '../../styles/theme'
import type { ScheduleBlock } from '../../lib/api/schedule'

// Resolução nativa do template de fundo (public/assets/schedule-export-template.png).
const IMG_W = 864
const IMG_H = 1821

const FULL_DAY_NAMES: Record<number, string> = {
  1: 'SEGUNDA',
  2: 'TERÇA',
  3: 'QUARTA',
  4: 'QUINTA',
  5: 'SEXTA',
  6: 'SÁBADO',
  7: 'DOMINGO',
}

// Posição de cada slot de horário (em px, na resolução nativa 864x1821) —
// medida via varredura de pixel nas bordas dos cards do template, não é
// um chute visual. Ver conversa/memória do projeto pra reproduzir se o
// template.png for atualizado.
const DAY_ROWS: Array<{ day: number; top: number; height: number }> = [
  { day: 1, top: 813, height: 84 },
  { day: 2, top: 908, height: 83 },
  { day: 3, top: 1003, height: 83 },
  { day: 4, top: 1097, height: 82 },
  { day: 5, top: 1192, height: 84 },
  { day: 6, top: 1287, height: 84 },
  { day: 7, top: 1382, height: 88 },
]

const BOX_LEFT = 314
const BOX_RIGHT = 758

// Rótulo do bloco pela ordem cronológica no dia — convenção do design
// original (1º horário = "LIVE", 2º = "TARDE"), não vem dos dados.
const BLOCK_LABELS = ['LIVE', 'TARDE', 'NOITE']

const LABEL_BLUE = '#5A8FF0'
const OFFLINE_GREEN = '#8FBF1F'

type ScheduleExportTemplateProps = {
  blocks: ScheduleBlock[]
}

// Template offscreen renderizado pra exportação de imagem (ScheduleExportButton
// / PublicScheduleExportButton). Usa a arte de fundo pronta (template.png) e só
// sobrepõe o texto de cada dia nas posições medidas acima — mais simples e mais
// fiel ao design de referência do que recriar o layout inteiro em CSS.
export const ScheduleExportTemplate = forwardRef<HTMLDivElement, ScheduleExportTemplateProps>(function ScheduleExportTemplate(
  { blocks },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: IMG_W,
        height: IMG_H,
        backgroundImage: 'url(/assets/schedule-export-template.png)',
        backgroundSize: `${IMG_W}px ${IMG_H}px`,
        fontFamily: fontStack('body'),
      }}
    >
      {DAY_ROWS.map(({ day, top, height }) => {
        const dayBlocks = blocks
          .filter((b) => b.dayOfWeek === day)
          .slice()
          .sort((a, b) => a.startTime.localeCompare(b.startTime))

        return (
          <div
            key={day}
            aria-label={FULL_DAY_NAMES[day]}
            style={{
              position: 'absolute',
              left: BOX_LEFT,
              top,
              width: BOX_RIGHT - BOX_LEFT,
              height,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 4,
              paddingLeft: 14,
              boxSizing: 'border-box',
            }}
          >
            {dayBlocks.length === 0 ? (
              <>
                <div style={{ fontSize: 22, fontWeight: 800, color: OFFLINE_GREEN, letterSpacing: 1 }}>OFF-LINE</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#f3f5f7', lineHeight: 1.35 }}>
                  DESCANSO E PREPARAÇÃO
                  <br />
                  PARA NOVAS LIVES!
                </div>
              </>
            ) : (
              dayBlocks.map((block, index) => (
                <div key={index} style={{ fontSize: 19, fontWeight: 700, letterSpacing: 0.3 }}>
                  <span style={{ color: LABEL_BLUE }}>{BLOCK_LABELS[index] ?? BLOCK_LABELS[BLOCK_LABELS.length - 1]}</span>{' '}
                  <span style={{ color: '#f3f5f7' }}>
                    DAS {block.startTime} ÀS {block.endTime}
                  </span>
                </div>
              ))
            )}
          </div>
        )
      })}
    </div>
  )
})
