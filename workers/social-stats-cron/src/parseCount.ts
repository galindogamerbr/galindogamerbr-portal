// Várias redes só expõem a contagem já abreviada no HTML público ("1,2 mi",
// "823 mil", "1.2M") em vez do número exato — aproxima multiplicando pelo
// sufixo. Não é preciso, mas é o mesmo trade-off que o resto do scraping
// deste worker já assume (ver README.md).
const MULTIPLIERS: Record<string, number> = {
  mil: 1_000,
  k: 1_000,
  mi: 1_000_000,
  m: 1_000_000,
  milhão: 1_000_000,
  milhões: 1_000_000,
  bi: 1_000_000_000,
  b: 1_000_000_000,
  bilhão: 1_000_000_000,
  bilhões: 1_000_000_000,
}

export function parseAbbreviatedCount(text: string): number | null {
  const cleaned = text.trim().replace(/\./g, '').replace(',', '.')
  const match = cleaned.match(/^([\d.]+)\s*(mil|mi|milhões|milhão|bilhões|bilhão|bi|k|m|b)?/i)
  if (!match) return null

  const value = Number(match[1])
  if (Number.isNaN(value)) return null

  const suffix = match[2]?.toLowerCase()
  const multiplier = suffix ? (MULTIPLIERS[suffix] ?? 1) : 1
  return Math.round(value * multiplier)
}
