import { Container } from './Container'
import { Eyebrow } from './Eyebrow'

type PagePlaceholderProps = {
  eyebrow: string
  title: string
  note?: string
}

// Placeholder de rota da Fase 0 — conteúdo completo entra na Fase 1.
export function PagePlaceholder({ eyebrow, title, note }: PagePlaceholderProps) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {note && <p className="mt-4 max-w-2xl text-muted">{note}</p>}
      </Container>
    </section>
  )
}
