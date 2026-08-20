const compactFormatter = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })

export function formatCompactNumber(value: number): string {
  return compactFormatter.format(value)
}

const fullFormatter = new Intl.NumberFormat('pt-BR')

// Número completo, com separador de milhar — usado onde um valor
// arredondado tipo "1,2 mil" tira a graça de um contador (ex: total de
// visitas desde sempre, ver LifetimeVisitsBanner.tsx).
export function formatNumber(value: number): string {
  return fullFormatter.format(value)
}
