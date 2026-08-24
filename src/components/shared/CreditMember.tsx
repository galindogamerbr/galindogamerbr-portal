type CreditMemberLink = {
  label: string
  href: string
  icon: string
}

type CreditMemberProps = {
  name: string
  description: string
  avatar: string
  links: CreditMemberLink[]
}

export function CreditMember({ name, description, avatar, links }: CreditMemberProps) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={avatar}
        alt={name}
        className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
      />
      <div>
        <p>
          {description} <span className="text-gold">{name}</span>.
        </p>
        <div className="mt-3 flex items-center gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} de ${name}`}
              title={link.label}
              className="rounded-md border border-line p-2 transition-colors hover:border-gold/60"
            >
              <img src={link.icon} alt="" className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
