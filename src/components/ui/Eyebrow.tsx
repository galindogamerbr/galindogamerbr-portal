import type { PropsWithChildren } from 'react'

export function Eyebrow({ children }: PropsWithChildren) {
  return <div className="text-sm font-semibold uppercase tracking-widest text-gold">{children}</div>
}
