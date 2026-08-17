import type { PropsWithChildren } from 'react'

export function Eyebrow({ children, className = 'text-sm' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`font-semibold uppercase tracking-widest text-gold ${className}`}>{children}</div>
}
