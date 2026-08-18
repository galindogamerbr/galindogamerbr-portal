import { SOCIALS } from '../../data/socials'

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Redes sociais">
      {SOCIALS.map((social) => (
        <a
          key={social.platform}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="opacity-80 transition hover:opacity-100"
        >
          <img src={`/assets/logos/${social.logo}`} alt={social.name} className="h-5 w-5 rounded object-contain" />
        </a>
      ))}
    </div>
  )
}
