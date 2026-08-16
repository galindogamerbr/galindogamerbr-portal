import { useTilt } from '../../hooks/useTilt'

type HubLinkProps = {
  icon: string
  eyebrow: string
  title: string
  description: string
  href: string
}

export function HubLink({ icon, eyebrow, title, description, href }: HubLinkProps) {
  const tiltRef = useTilt<HTMLAnchorElement>()

  return (
    <a
      ref={tiltRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-lg border border-line bg-panel p-6 transition-colors hover:border-gold/60"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-widest text-gold">{eyebrow}</span>
      <h3 className="text-lg">{title}</h3>
      <p className="flex-1 text-sm text-muted">{description}</p>
      <span className="text-sm font-semibold text-white/70 group-hover:text-gold">Acessar →</span>
    </a>
  )
}
