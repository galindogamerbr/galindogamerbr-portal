import { useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { ScheduleExportTemplate } from './ScheduleExportTemplate'
import { exportScheduleImage } from '../../lib/exportScheduleImage'
import { getPublicSchedule } from '../../lib/api/schedule'
import type { ScheduleBlock } from '../../lib/api/schedule'

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}

// Versão pública do botão de exportação — busca a programação publicada
// na hora do clique, em vez de receber blocos já carregados (como o
// editor admin faz).
export function PublicScheduleExportButton() {
  const templateRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])

  async function handleExport() {
    setExporting(true)
    try {
      const schedule = await getPublicSchedule()
      const week = schedule.weeks[0]
      setBlocks(week ? week.blocks.map((block) => ({ ...block, cycleIndex: week.cycleIndex })) : [])

      // Espera o template re-renderizar com os dados novos antes de capturar.
      await new Promise((resolve) => requestAnimationFrame(resolve))
      if (templateRef.current) await exportScheduleImage(templateRef.current)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Button variant="default" className="w-full" onClick={handleExport} disabled={exporting}>
        {!exporting && <DownloadIcon />}
        {exporting ? 'Gerando imagem...' : 'Baixar imagem da programação'}
      </Button>
      <div style={{ position: 'fixed', top: 0, left: -9999, pointerEvents: 'none' }} aria-hidden="true">
        <ScheduleExportTemplate ref={templateRef} blocks={blocks} />
      </div>
    </>
  )
}
