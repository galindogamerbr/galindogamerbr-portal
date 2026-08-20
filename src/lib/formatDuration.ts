// Uptime do servidor vem como string livre da API ("3h 6min", "1d 2h",
// "45min"...) — extrai dias/horas/minutos com regex em vez de assumir um
// formato fixo, soma tudo em minutos.
function parseDurationToMinutes(text: string): number | null {
  const days = Number(text.match(/(\d+)\s*d/)?.[1] ?? 0)
  const hours = Number(text.match(/(\d+)\s*h/)?.[1] ?? 0)
  const minutes = Number(text.match(/(\d+)\s*min/)?.[1] ?? 0)
  if (!days && !hours && !minutes) return null
  return days * 24 * 60 + hours * 60 + minutes
}

function toHhMm(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}h`
}

// Uptime do servidor (status.uptime, string livre da API) exibido como
// hh:MMh no FarmStatusCard — jogadores individuais mostram só "Nmin" (mais
// compacto pra caber no chip, ver PlayerChip).
export function formatUptimeText(text: string): string {
  const totalMinutes = parseDurationToMinutes(text)
  return totalMinutes !== null ? toHhMm(totalMinutes) : text
}
