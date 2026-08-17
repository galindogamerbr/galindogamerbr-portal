export type Game = {
  slug: string
  title: string
  tag: string
  icon: string | null
  description: string
  image: string
  href: string
  flagship?: boolean
}

export const GAMES: Game[] = [
  {
    slug: 'fs25',
    title: 'Farming Simulator 25',
    tag: 'Carro-chefe',
    icon: '/assets/logos/trator.webp',
    description: 'Fazendas, máquinas, produção, mods e histórias da comunidade — inclui a série Fazenda Nova Aliança.',
    image: '/assets/banners/fs25.webp',
    href: 'https://www.youtube.com/playlist?list=PLj6h86FobQUn2vIz-FSyMlL_ldV6_kzrN',
    flagship: true,
  },
  {
    slug: 'furia-reborn-rp',
    title: 'Fúria Reborn • GTA RP',
    tag: 'Roleplay',
    icon: '/assets/logos/furia_reborn_rp.webp',
    description: 'Roleplay imersivo, histórias e experiências na comunidade.',
    image: '/assets/banners/furia_rp.webp',
    href: 'https://www.youtube.com/playlist?list=PLJtoEQhBWmWI',
  },
  {
    slug: 'snowrunner',
    title: 'SnowRunner',
    tag: 'Simulação',
    icon: '/assets/logos/caminhao.webp',
    description: 'Expedições, lama, carga pesada e desafios extremos.',
    image: '/assets/banners/snowrunner.webp',
    href: 'https://www.youtube.com/playlist?list=PLDv3gOgRACDY',
  },
  {
    slug: 'ets2',
    title: 'Euro Truck Simulator 2',
    tag: 'Estradas',
    icon: '/assets/logos/cavalo.webp',
    description: 'Viagens, caminhões e muita estrada.',
    image: '/assets/banners/ets2.webp',
    href: 'https://www.youtube.com/playlist?list=PLj6h86FobQUkbejSJ6f1D0eob6leKJAur',
  },
  {
    slug: 'dicas',
    title: 'Dicas do Galindo',
    tag: 'Tutoriais',
    icon: null,
    description: 'Tutoriais, truques, configurações e dicas que fazem a diferença.',
    image: '/assets/banners/dicas.webp',
    href: 'https://www.youtube.com/playlist?list=PLj6h86FobQUmOBGsW2WBorqwszTEJihie',
  },
]

export const FAZENDA_NOVA_ALIANCA = {
  // Episódio/thumbnail reais vêm de /api/flagship (src/hooks/useFlagshipVideo.ts),
  // sempre o mais recente da playlist — os campos abaixo são só o fallback
  // enquanto isso carrega (ou se a busca falhar).
  description:
    'Uma saga que já passa de 200 episódios: a Fazenda Nova Aliança nasceu pequena e virou um verdadeiro império rural, construído pouco a pouco, transmissão após transmissão — decisões de gestão, novas máquinas, expansão de terras e os imprevistos do campo, tudo ao vivo com a comunidade acompanhando cada passo da história.',
  image: '/assets/farm-live.webp',
  href: 'https://www.youtube.com/playlist?list=PLj6h86FobQUn2vIz-FSyMlL_ldV6_kzrN',
}
