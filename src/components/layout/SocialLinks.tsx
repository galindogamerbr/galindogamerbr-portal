const SOCIALS = [
  { name: 'YouTube', href: 'https://www.youtube.com/@galindogamerbr', icon: 'youtube' },
  { name: 'Twitch', href: 'https://www.twitch.tv/galindogamerbr', icon: 'twitch' },
  { name: 'Kick', href: 'https://kick.com/galindogamerbr', icon: 'kick' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@galindogamerbr', icon: 'tiktok' },
  { name: 'Instagram', href: 'https://www.instagram.com/galindogamerbr', icon: 'instagram' },
  { name: 'Discord', href: 'https://discord.com/invite/JggtZ7qGY3', icon: 'discord' },
] as const

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Redes sociais">
      {SOCIALS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="opacity-80 transition hover:opacity-100"
        >
          <img src={`/assets/icons/${social.icon}.svg`} alt={social.name} className="h-5 w-5" />
        </a>
      ))}
    </div>
  )
}
