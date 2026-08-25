import type { ReactNode } from 'react'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { Reveal } from '../ui/Reveal'

export type LegalSection = { title: string; content: ReactNode }

type LegalDocumentProps = {
  eyebrow: string
  title: string
  introduction: string
  updatedAt: string
  sections: LegalSection[]
}

export function LegalDocument({ eyebrow, title, introduction, updatedAt, sections }: LegalDocumentProps) {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_28%,rgba(217,177,79,0.13),transparent_32%),radial-gradient(circle_at_82%_54%,rgba(86,104,245,0.09),transparent_28%)]" />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-2 text-4xl leading-none sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{introduction}</p>
            <span className="mt-6 inline-flex rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">Atualizado em {updatedAt}</span>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Reveal>
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr] lg:gap-12">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>Neste documento</Eyebrow>
                <ol className="mt-5 space-y-3 border-l border-line pl-5">
                  {sections.map((section, index) => (
                    <li key={section.title} className="flex gap-3 text-sm text-muted">
                      <span className="font-bold text-gold">{String(index + 1).padStart(2, '0')}</span>
                      <span>{section.title}</span>
                    </li>
                  ))}
                </ol>
              </aside>
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <article key={section.title} className="rounded-xl border border-line bg-gradient-to-br from-panel to-panel2 p-6 sm:p-8">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Seção {String(index + 1).padStart(2, '0')}</span>
                    <h2 className="mt-2 text-2xl text-white">{section.title}</h2>
                    <div className="mt-4 leading-relaxed text-muted">{section.content}</div>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </Reveal>
      </section>
    </>
  )
}
