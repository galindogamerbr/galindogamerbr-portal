import { useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { ScheduleExportTemplate } from './ScheduleExportTemplate'
import { exportScheduleImage } from '../../lib/exportScheduleImage'
import type { ScheduleBlock } from '../../lib/api/schedule'

type ScheduleExportButtonProps = {
  cycleLength: number
  blocks: ScheduleBlock[]
}

export function ScheduleExportButton({ cycleLength, blocks }: ScheduleExportButtonProps) {
  const templateRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (!templateRef.current) return
    setExporting(true)
    try {
      await exportScheduleImage(templateRef.current)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Button variant="default" onClick={handleExport} disabled={exporting}>
        {exporting ? 'Gerando imagem...' : 'Baixar imagem →'}
      </Button>
      {/* Renderizado fora da tela (não display:none — html-to-image precisa de layout real pra capturar). */}
      <div style={{ position: 'fixed', top: 0, left: -9999, pointerEvents: 'none' }} aria-hidden="true">
        <ScheduleExportTemplate ref={templateRef} cycleLength={cycleLength} blocks={blocks} />
      </div>
    </>
  )
}
