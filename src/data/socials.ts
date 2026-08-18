export type SocialPlatform = 'youtube' | 'twitch' | 'kick' | 'tiktok' | 'instagram' | 'discord'

export type Social = {
  platform: SocialPlatform
  name: string
  href: string
  // Nome-base do SVG monocromático em /assets/icons (fill="#fff") — usado
  // só como máscara CSS no CommunityStatsGrid pra preencher com `color`.
  icon: string
  // Arquivo colorido (logo de verdade, com as cores da marca) em
  // /assets/logos — usado nos links diretos (SocialLinks), onde a cor já
  // vem embutida na imagem.
  logo: string
  // Cor de marca oficial de cada rede — usada no indicador de "ao vivo"
  // (CommunityStatsGrid), pra ficar reconhecível qual plataforma tá com
  // aquele número de espectadores.
  color: string
}

// Fonte única das redes do canal — usado tanto pelos links estáticos
// (SocialLinks) quanto pelos cards de seguidores (CommunityStatsGrid), pra
// não duplicar URL/ícone em dois lugares.
export const SOCIALS: Social[] = [
  { platform: 'youtube', name: 'YouTube', href: 'https://www.youtube.com/@galindogamerbr', icon: 'youtube', logo: 'youtube.png', color: '#FF0000' },
  { platform: 'twitch', name: 'Twitch', href: 'https://www.twitch.tv/galindogamerbr', icon: 'twitch', logo: 'twitch.png', color: '#9146FF' },
  { platform: 'kick', name: 'Kick', href: 'https://kick.com/galindogamerbr', icon: 'kick', logo: 'kick.svg', color: '#53FC18' },
  { platform: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@galindogamerbr', icon: 'tiktok', logo: 'tiktok.png', color: '#FE2C55' },
  { platform: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/galindogamerbr', icon: 'instagram', logo: 'instagram.png', color: '#E1306C' },
  { platform: 'discord', name: 'Discord', href: 'https://discord.com/invite/JggtZ7qGY3', icon: 'discord', logo: 'discord.png', color: '#5865F2' },
]
