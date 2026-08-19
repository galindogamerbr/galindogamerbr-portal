// Import dinâmico: html-to-image só é usado quando o usuário clica em
// "Baixar imagem" (ScheduleExportButton.tsx) — carregar estático colocava a
// lib inteira no bundle de qualquer visitante da página de programação.
export async function exportScheduleImage(node: HTMLElement): Promise<void> {
  const { toPng } = await import('html-to-image')
  const dataUrl = await toPng(node, { pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'programacao-galindogamerbr.png'
  link.click()
}
