// ISO 8601: 1=segunda ... 7=domingo — mesma convenção do schema (schedule_blocks.day_of_week).
export const DAYS = [
  { value: 1, label: 'SEG' },
  { value: 2, label: 'TER' },
  { value: 3, label: 'QUA' },
  { value: 4, label: 'QUI' },
  { value: 5, label: 'SEX' },
  { value: 6, label: 'SÁB' },
  { value: 7, label: 'DOM' },
] as const
