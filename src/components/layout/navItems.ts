export const NAV_ITEMS = [
  { label: 'Início', to: '/' },
  { label: 'Comece Aqui', to: '/comece-aqui' },
  { label: 'Jogos', to: '/jogos' },
  { label: 'Programação', to: '/programacao' },
  { label: 'Comunidade', to: '/comunidade' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Parceiros', to: '/parceiros' },
] as const

export const FOOTER_ITEMS = [
  ...NAV_ITEMS,
  { label: 'Contato', to: '/contato' },
  { label: 'Privacidade', to: '/privacidade' },
] as const
