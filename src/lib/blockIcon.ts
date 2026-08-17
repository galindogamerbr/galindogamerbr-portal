export type BlockIconKind = 'sun' | 'sunset'

// Sol se o bloco começa antes do meio-dia, pôr-do-sol caso contrário —
// decidido pelo horário real do bloco, não pela posição/ordem dele no dia.
// Usado só na exportação de imagem (ScheduleExportTemplate) — o site
// (ScheduleTabs) não usa ícones aqui.
export function blockIconKind(startTime: string): BlockIconKind {
  return startTime < '12:00' ? 'sun' : 'sunset'
}
