import type { PropsWithChildren } from 'react'
import { useReveal } from '../../hooks/useReveal'

export function Reveal({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}
