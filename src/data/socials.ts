export type SocialPlatform = 'youtube' | 'twitch' | 'kick' | 'tiktok' | 'instagram' | 'discord'

export type Social = {
  platform: SocialPlatform
  name: string
  href: string
  icon: string
}

// Fonte única das redes do canal — usado tanto pelos links estáticos
// (SocialLinks) quanto pelos cards de seguidores (CommunityStatsGrid), pra
// não duplicar URL/ícone em dois lugares.
export const SOCIALS: Social[] = [
  { platform: 'youtube', name: 'YouTube', href: 'https://www.youtube.com/@galindogamerbr', icon: 'youtube' },
  { platform: 'twitch', name: 'Twitch', href: 'https://www.twitch.tv/galindogamerbr', icon: 'twitch' },
  { platform: 'kick', name: 'Kick', href: 'https://kick.com/galindogamerbr', icon: 'kick' },
  { platform: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@galindogamerbr', icon: 'tiktok' },
  { platform: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/galindogamerbr', icon: 'instagram' },
  { platform: 'discord', name: 'Discord', href: 'https://discord.com/invite/JggtZ7qGY3', icon: 'discord' },
]
