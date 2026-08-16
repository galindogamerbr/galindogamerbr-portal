import { toPng } from 'html-to-image'

export async function exportScheduleImage(node: HTMLElement): Promise<void> {
  const dataUrl = await toPng(node, { pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'programacao-galindogamerbr.png'
  link.click()
}
