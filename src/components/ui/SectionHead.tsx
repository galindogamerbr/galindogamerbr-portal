import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'

type SectionHeadProps = {
  eyebrow: string
  title: string
  action?: ReactNode
}

export function SectionHead({ eyebrow, title, action }: SectionHeadProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}
