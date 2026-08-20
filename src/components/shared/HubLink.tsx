import { Link } from 'react-router-dom'
import { useTilt } from '../../hooks/useTilt'

type HubLinkProps = {
  icon: string
  eyebrow: string
  title: string
  description: string
  href: string
}

const CARD_CLASSNAME = 'group flex flex-col gap-3 rounded-lg border border-line bg-panel p-6 transition-colors hover:border-gold/60'

function HubLinkContent({ icon, eyebrow, title, description }: Omit<HubLinkProps, 'href'>) {
  return (
    <>
      <span className="text-3xl">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-widest text-gold">{eyebrow}</span>
      <h3 className="text-lg">{title}</h3>
      <p className="flex-1 text-sm text-muted">{description}</p>
      <span className="text-sm font-semibold text-white/70 group-hover:text-gold">Acessar →</span>
    </>
  )
}

// href começando com "/" é rota interna (ex: Mod Sync em /mods) — navega
// via react-router, sem nova aba nem recarregar a página. Qualquer outro
// href é link externo de verdade (WhatsApp, Discord, etc.), abre em aba nova.
export function HubLink({ icon, eyebrow, title, description, href }: HubLinkProps) {
  const tiltRef = useTilt<HTMLAnchorElement>()

  if (href.startsWith('/')) {
    return (
      <Link ref={tiltRef} to={href} className={CARD_CLASSNAME}>
        <HubLinkContent icon={icon} eyebrow={eyebrow} title={title} description={description} />
      </Link>
    )
  }

  return (
    <a ref={tiltRef} href={href} target="_blank" rel="noopener noreferrer" className={CARD_CLASSNAME}>
      <HubLinkContent icon={icon} eyebrow={eyebrow} title={title} description={description} />
    </a>
  )
}
