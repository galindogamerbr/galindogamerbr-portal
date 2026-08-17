import { forwardRef } from 'react'
import { fontStack } from '../../styles/theme'
import type { ScheduleBlock } from '../../lib/api/schedule'
import { blockIconKind, type BlockIconKind } from '../../lib/blockIcon'

// Resolução nativa do template de fundo (public/assets/schedule-export-template.png).
const IMG_W = 1024
const IMG_H = 1536

const FULL_DAY_NAMES: Record<number, string> = {
  1: 'SEGUNDA',
  2: 'TERÇA',
  3: 'QUARTA',
  4: 'QUINTA',
  5: 'SEXTA',
  6: 'SÁBADO',
  7: 'DOMINGO',
}

// Posição de cada slot de horário (em px, na resolução nativa 1024x1536) —
// medida via varredura de pixel nas bordas dos cards do template (v3, sem
// o selo quadrado à esquerda — removido da arte), não é um chute visual.
// As linhas de TERÇA e QUINTA já nascem mais altas na própria arte
// (108/104px vs ~85-92px das demais) porque são os dois dias com dois
// blocos de horário. Ver conversa/memória do projeto pra reproduzir se o
// template.png for atualizado de novo.
const DAY_ROWS: Array<{ day: number; top: number; height: number; nudge?: number }> = [
  { day: 1, top: 615, height: 92 },
  { day: 2, top: 720, height: 108 },
  { day: 3, top: 844, height: 91 },
  { day: 4, top: 945, height: 104 },
  { day: 5, top: 1068, height: 85 },
  { day: 6, top: 1175, height: 86, nudge: 1 },
  { day: 7, top: 1275, height: 88, nudge: 2 },
]

const BOX_LEFT = 506
const BOX_RIGHT = 955

const OFFLINE_GREEN = '#8FBF1F'
const ICON_SIZE = 32
const ICON_GAP = 10

// Selo maior à esquerda do nome do dia (na faixa em branco que sobrou depois
// que o selo quadrado saiu da arte de fundo) — calendário quando o dia tem
// programação, X quando é OFF-LINE.
const DAY_ICON_LEFT = 46
const DAY_ICON_SIZE = 128

// Ícones dos ícones do Flaticon (Magnific — "sun"/"sunset" packs, indicados
// pelo Pedro) recoloridos pra dourado da marca e salvos como PNG comuns em
// public/assets — <img> é o único tipo de elemento confirmado confiável com
// html-to-image nesse projeto (emoji e <svg>/<div> decorativo sumiam no PNG
// exportado; os selos de dia antigos usavam <img> e sempre apareceram certo).
function TimeIcon({ kind }: { kind: BlockIconKind }) {
  return (
    <img
      src={kind === 'sun' ? '/assets/schedule-icon-sun.png' : '/assets/schedule-icon-sunset.png'}
      alt=""
      style={{ width: ICON_SIZE, height: ICON_SIZE, flexShrink: 0 }}
    />
  )
}

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
      {DAY_ROWS.map(({ day, top, height, nudge }) => {
        const dayBlocks = blocks
          .filter((b) => b.dayOfWeek === day)
          .slice()
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
        const isOffline = dayBlocks.length === 0

        return (
          <div key={day} style={{ transform: nudge ? `translateY(${nudge}px)` : undefined }}>
            <img
              src={isOffline ? '/assets/schedule-icon-offline.png' : '/assets/schedule-icon-calendar.png'}
              alt=""
              style={{
                position: 'absolute',
                left: DAY_ICON_LEFT,
                top: top + (height - DAY_ICON_SIZE) / 2,
                width: DAY_ICON_SIZE,
                height: DAY_ICON_SIZE,
              }}
            />
            <div
              aria-label={FULL_DAY_NAMES[day]}
              style={{
                position: 'absolute',
                left: BOX_LEFT,
                top,
                width: BOX_RIGHT - BOX_LEFT,
                height,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 14,
                paddingRight: 10,
                boxSizing: 'border-box',
              }}
            >
              {isOffline ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: OFFLINE_GREEN, letterSpacing: 1, flexShrink: 0 }}>OFF-LINE</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#f3f5f7', lineHeight: 1.3 }}>
                    Descanso e preparação
                    <br />
                    para novas lives!
                  </div>
                </div>
              ) : dayBlocks.length === 1 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: ICON_GAP }}>
                  <TimeIcon kind={blockIconKind(dayBlocks[0].startTime)} />
                  <span style={{ fontSize: 22, fontWeight: 1000, letterSpacing: 0.1, color: '#f3f5f7', whiteSpace: 'nowrap' }}>
                    {dayBlocks[0].startTime} às {dayBlocks[0].endTime}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {dayBlocks.map((block, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: ICON_GAP }}>
                      <TimeIcon kind={blockIconKind(block.startTime)} />
                      <span style={{ fontSize: 22, fontWeight: 1000, letterSpacing: 0.1, color: '#f3f5f7', whiteSpace: 'nowrap' }}>
                        {block.startTime} às {block.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})
