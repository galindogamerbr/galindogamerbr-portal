import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { Button, NavButton } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { PartnershipModal } from '../components/shared/PartnershipModal'
import { CommunityStatsGrid } from '../components/shared/CommunityStatsGrid'

const PARTNERSHIP_FORMATS = [
  { icon: '🎮', eyebrow: 'Conteúdo integrado', title: 'PRODUTO EM DESTAQUE', text: 'Seu produto participa do conteúdo de forma natural, dentro das experiências que a comunidade já acompanha.' },
  { icon: '📺', eyebrow: 'Vídeos e transmissões', title: 'CONTEÚDO E LIVES', text: 'Presença em vídeos, transmissões ao vivo e conteúdos conectados a games, simuladores e entretenimento.' },
  { icon: '🏷️', eyebrow: 'Resultados acompanháveis', title: 'CUPONS E AFILIADOS', text: 'Links e cupons exclusivos aproximam a marca do público e ajudam a acompanhar o resultado da ação.' },
  { icon: '🚜', eyebrow: 'Nicho do canal', title: 'SIMULADORES E TECNOLOGIA', text: 'Um espaço relevante para jogos, periféricos, hardware, setups e soluções voltadas ao público gamer.' },
  { icon: '📣', eyebrow: 'Presença de marca', title: 'DIVULGAÇÃO COM CONTEXTO', text: 'Sua marca aparece de maneira clara e coerente com a programação, o conteúdo e o perfil da audiência.' },
  { icon: '🤝', eyebrow: 'Ações sob medida', title: 'CAMPANHAS E ATIVAÇÕES', text: 'Lançamentos, sorteios e experiências planejadas para fazer sentido tanto para a marca quanto para a comunidade.' },
] as const

const VALUE_POINTS = [
  { number: '01', title: 'Contexto', text: 'A marca entra em uma experiência que o público já escolheu acompanhar.' },
  { number: '02', title: 'Proximidade', text: 'A conversa acontece ao vivo, com participação e resposta da comunidade.' },
  { number: '03', title: 'Autenticidade', text: 'Cada ação é construída para combinar com o canal e com a proposta da marca.' },
] as const

export function Parceiros() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="relative isolate overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_30%,rgba(217,177,79,0.16),transparent_36%),radial-gradient(circle_at_85%_65%,rgba(88,101,242,0.11),transparent_40%)]" />
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <Reveal>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Eyebrow>Parcerias e marcas</Eyebrow>
                  <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold">Projetos sob medida</span>
                </div>
                <h1 className="mt-5 text-5xl leading-[0.92] sm:text-6xl">SUA MARCA DENTRO DE UMA HISTÓRIA QUE A COMUNIDADE ACOMPANHA.</h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">Criamos parcerias autênticas para marcas que querem estar presentes onde games, simuladores e comunidade se encontram.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button variant="gold" onClick={() => setModalOpen(true)}>Apresentar uma ideia</Button>
                  <NavButton variant="default" to="/comunidade">Conhecer a audiência</NavButton>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="relative overflow-hidden rounded-xl border border-gold/40 bg-panel p-6 shadow-[0_24px_70px_-35px_rgba(217,177,79,0.55)] sm:p-8">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
                <div className="relative flex items-center gap-5 border-b border-line pb-6">
                  <Logo className="h-20 w-20 shrink-0 border-2 border-gold/50" />
                  <div><Eyebrow>GalindoGamerBR</Eyebrow><h2 className="mt-1 text-2xl">PRESENÇA COM PROPÓSITO</h2></div>
                </div>
                <div className="relative mt-6 space-y-5">
                  {VALUE_POINTS.map((point) => (
                    <div key={point.number} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-gold/10 text-xs font-bold text-gold">{point.number}</span>
                      <div><h3 className="text-base">{point.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{point.text}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-panel/40 py-16 sm:py-20">
        <Reveal>
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Uma audiência presente</Eyebrow>
              <h2 className="mt-2 text-4xl sm:text-5xl">ALCANCE QUE VEM COM CONVERSA E PARTICIPAÇÃO</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">A comunidade acompanha o canal em diferentes plataformas e continua conectada dentro e fora das transmissões.</p>
            </div>
            <div className="mt-10 rounded-xl border border-gold/25 bg-bg/30 p-4 sm:p-6"><CommunityStatsGrid /></div>
          </Container>
        </Reveal>
      </section>

      <section className="py-16 sm:py-24">
        <Reveal>
          <Container>
            <div className="max-w-3xl">
              <Eyebrow>Possibilidades de parceria</Eyebrow>
              <h2 className="mt-1 text-3xl sm:text-5xl">IDEIAS QUE ENTRAM NO CONTEÚDO SEM PERDER A NATURALIDADE</h2>
              <p className="mt-4 text-lg text-muted">Cada projeto começa com o objetivo da marca e encontra um formato coerente com o canal.</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {PARTNERSHIP_FORMATS.map((format) => (
                <article key={format.title} className="group flex min-h-64 flex-col rounded-lg border border-line bg-gradient-to-br from-panel to-panel2 p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_18px_45px_-28px_rgba(217,177,79,0.7)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-bg/50 text-2xl transition duration-300 group-hover:scale-110 group-hover:border-gold/50">{format.icon}</span>
                  <span className="mt-5 text-xs font-semibold uppercase tracking-widest text-gold">{format.eyebrow}</span>
                  <h3 className="mt-2 text-lg">{format.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{format.text}</p>
                </article>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div className="relative overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-r from-gold/10 via-panel to-panel p-7 shadow-[0_22px_65px_-42px_rgba(217,177,79,0.75)] sm:p-10">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div className="max-w-3xl">
                  <Eyebrow>Vamos construir juntos</Eyebrow>
                  <h2 className="mt-2 text-3xl sm:text-4xl">SUA IDEIA PODE SER O COMEÇO DA PRÓXIMA HISTÓRIA.</h2>
                  <p className="mt-4 text-muted">Conte sobre sua marca, produto ou objetivo. A partir disso, encontramos uma ação que faça sentido para os dois lados.</p>
                </div>
                <Button variant="gold" className="shrink-0" onClick={() => setModalOpen(true)}>Quero ser parceiro</Button>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      <PartnershipModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
