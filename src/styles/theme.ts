// Fonte única de verdade para cores/fontes/breakpoints da marca.
// Consumido por: tailwind.config.ts (classes utilitárias) e código React puro
// (ex: template de exportação de imagem da Programação, Fase 3, que não tem
// acesso a classes Tailwind em contextos de renderização offscreen/canvas).

export const theme = {
  colors: {
    bg: '#03070b',
    panel: '#08111a',
    panel2: '#0b151f',
    line: '#243443',
    muted: '#9eacb9',
    white: '#f3f5f7',
    gold: '#d9b14f',
    red: '#ed1d2a',
    purple: '#6447e8',
    green: '#16a34a',
    blue: '#5668f5',
  },
  fonts: {
    display: ['Bebas Neue', 'Impact', 'sans-serif'],
    body: ['Inter', 'Arial', 'sans-serif'],
  },
  container: {
    max: '1410px',
  },
  // Breakpoints herdados do site atual (style.css). Mobile-first: cada
  // token abaixo vira um `min-width` no Tailwind, do menor pro maior.
  screens: {
    xs: '540px',
    sm: '650px',
    md: '820px',
    lg: '900px',
    xl: '1180px', // header colapsa para o menu hambúrguer abaixo deste breakpoint
    '2xl': '1200px',
    '3xl': '1450px',
  },
} as const

export type Theme = typeof theme

export function fontStack(key: keyof typeof theme.fonts): string {
  return theme.fonts[key].join(', ')
}
