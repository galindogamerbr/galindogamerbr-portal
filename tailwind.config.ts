import type { Config } from 'tailwindcss'
import { theme } from './src/styles/theme'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Substitui os breakpoints padrão do Tailwind pelos herdados do site
    // atual, em vez de estender (evita ter sm:640 do Tailwind convivendo
    // com um sm:650 customizado, o que seria confuso).
    screens: theme.screens,
    extend: {
      colors: theme.colors,
      fontFamily: {
        display: theme.fonts.display,
        body: theme.fonts.body,
      },
      maxWidth: {
        container: theme.container.max,
      },
    },
  },
  plugins: [],
} satisfies Config
