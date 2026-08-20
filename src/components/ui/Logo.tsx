type LogoProps = {
  className?: string
  alt?: string
}

// Logo do canal (galindogamerbr.webp) — mesmo arquivo usado no Header, no
// Hero da Home, no PartnershipModal e no PartnershipTeaser; className
// controla o tamanho em cada lugar (só rounded-full/object-cover é fixo
// aqui). alt vazio pra usos puramente decorativos (ex: Hero, onde o texto
// ao lado já identifica o canal).
export function Logo({ className = 'h-10 w-10', alt = 'Logo GalindoGamerBR' }: LogoProps) {
  return <img src="/assets/logos/galindogamerbr.webp" alt={alt} className={`rounded-full object-cover ${className}`} />
}
