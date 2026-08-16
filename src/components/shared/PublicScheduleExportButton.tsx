import { useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { ScheduleExportTemplate } from './ScheduleExportTemplate'
import { exportScheduleImage } from '../../lib/exportScheduleImage'
import { getPublicSchedule } from '../../lib/api/schedule'
import type { ScheduleBlock } from '../../lib/api/schedule'

// Versão pública do botão de exportação — busca a programação publicada
// na hora do clique, em vez de receber blocos já carregados (como o
// editor admin faz).
export function PublicScheduleExportButton() {
  const templateRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [cycleLength, setCycleLength] = useState(0)
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])

  async function handleExport() {
    setExporting(true)
    try {
      const schedule = await getPublicSchedule()
      const flatBlocks: ScheduleBlock[] = schedule.weeks.flatMap((week) =>
        week.blocks.map((block) => ({ ...block, cycleIndex: week.cycleIndex })),
      )
      setCycleLength(schedule.cycleLength)
      setBlocks(flatBlocks)

      // Espera o template re-renderizar com os dados novos antes de capturar.
      await new Promise((resolve) => requestAnimationFrame(resolve))
      if (templateRef.current) await exportScheduleImage(templateRef.current)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Button variant="default" onClick={handleExport} disabled={exporting}>
        {exporting ? 'Gerando imagem...' : 'Baixar imagem da programação →'}
      </Button>
      <div style={{ position: 'fixed', top: 0, left: -9999, pointerEvents: 'none' }} aria-hidden="true">
        <ScheduleExportTemplate ref={templateRef} cycleLength={cycleLength} blocks={blocks} />
      </div>
    </>
  )
}
