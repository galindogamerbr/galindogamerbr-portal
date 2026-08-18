export type SocialPlatform = 'youtube' | 'twitch' | 'kick' | 'tiktok' | 'instagram' | 'discord'

export type Social = {
  platform: SocialPlatform
  name: string
  href: string
  icon: string
  // Cor de marca oficial de cada rede — usada no indicador de "ao vivo"
  // (CommunityStatsGrid), pra ficar reconhecível qual plataforma tá com
  // aquele número de espectadores.
  color: string
}

// Fonte única das redes do canal — usado tanto pelos links estáticos
// (SocialLinks) quanto pelos cards de seguidores (CommunityStatsGrid), pra
// não duplicar URL/ícone em dois lugares.
export const SOCIALS: Social[] = [
  { platform: 'youtube', name: 'YouTube', href: 'https://www.youtube.com/@galindogamerbr', icon: 'youtube', color: '#FF0000' },
  { platform: 'twitch', name: 'Twitch', href: 'https://www.twitch.tv/galindogamerbr', icon: 'twitch', color: '#9146FF' },
  { platform: 'kick', name: 'Kick', href: 'https://kick.com/galindogamerbr', icon: 'kick', color: '#53FC18' },
  { platform: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@galindogamerbr', icon: 'tiktok', color: '#FE2C55' },
  { platform: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/galindogamerbr', icon: 'instagram', color: '#E1306C' },
  { platform: 'discord', name: 'Discord', href: 'https://discord.com/invite/JggtZ7qGY3', icon: 'discord', color: '#5865F2' },
]
