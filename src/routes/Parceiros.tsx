import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button, NavButton } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { PartnershipModal } from '../components/shared/PartnershipModal'

const PARTNERSHIP_FORMATS = [
  {
    icon: '🎮',
    eyebrow: 'CONTEÚDO INTEGRADO',
    title: 'PRODUTO EM DESTAQUE',
    text: 'Seu produto entra no conteúdo de forma natural: em gameplay, nas lives e nos momentos que a comunidade já acompanha.',
  },
  {
    icon: '📺',
    eyebrow: 'VÍDEOS E TRANSMISSÕES',
    title: 'CONTEÚDO & LIVES',
    text: 'Criamos presença em vídeos, transmissões ao vivo e conteúdos conectados a games, simuladores e entretenimento.',
  },
  {
    icon: '🏷️',
    eyebrow: 'RESULTADOS ACOMPANHÁVEIS',
    title: 'CUPONS & AFILIADOS',
    text: 'Links e cupons exclusivos aproximam a marca da comunidade e ajudam a acompanhar o resultado da ação.',
  },
  {
    icon: '🚜',
    eyebrow: 'NICHO DO CANAL',
    title: 'SIMULADORES & TECNOLOGIA',
    text: 'Espaço ideal para Farming Simulator, ETS2, SnowRunner, periféricos, hardware, setups e tecnologia gamer.',
  },
  {
    icon: '📣',
    eyebrow: 'PRESENÇA DE MARCA',
    title: 'DIVULGAÇÃO DE MARCA',
    text: 'Apresentamos sua marca de forma clara e coerente com a programação, os conteúdos e o público do canal.',
  },
  {
    icon: '🤝',
    eyebrow: 'AÇÕES SOB MEDIDA',
    title: 'CAMPANHAS & AÇÕES',
    text: 'Planejamos campanhas, lançamentos, sorteios e ativações com um formato que faça sentido para a marca e para a galera.',
  },
]

export function Parceiros() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <Eyebrow>Parceiros</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">SUA MARCA NO UNIVERSO GALINDOGAMERBR</h1>
          <p className="mt-3 text-muted">
            Parcerias autênticas para marcas que querem estar presentes onde games, simuladores e comunidade se encontram.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border border-line bg-panel p-6 text-muted sm:p-8">
            <p>
              O GalindoGamerBR é um universo de games, simuladores, lives e entretenimento, construído todos os dias
              com uma comunidade que acompanha, conversa e participa.
            </p>
            <p>
              Procuramos marcas, lojas, desenvolvedores e projetos que conversem com esse público e que queiram ir
              além de uma logo na tela: entrar em experiências que fazem sentido para quem está assistindo.
            </p>
            <p>
              De produtos e periféricos a cupons, afiliados, campanhas e ativações, criamos formatos sob medida para
              apresentar sua marca com contexto, credibilidade e proximidade.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <Eyebrow>Possibilidades de parceria</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">COMO PODEMOS TRABALHAR JUNTOS</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {PARTNERSHIP_FORMATS.map((format) => (
              <article
                key={format.title}
                className="group flex flex-col gap-3 rounded-lg border border-line bg-panel p-6 transition-colors hover:border-gold/60"
              >
                <span className="inline-block w-fit text-3xl transition duration-300 group-hover:scale-110">{format.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">{format.eyebrow}</span>
                <h3 className="text-lg">{format.title}</h3>
                <p className="text-sm text-muted">{format.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <Eyebrow>Uma comunidade que está presente</Eyebrow>
              <h2 className="text-2xl sm:text-3xl">SUA MARCA MAIS PERTO DE QUEM ACOMPANHA.</h2>
              <p className="mt-2 text-muted">
                Uma parceria no GalindoGamerBR coloca sua marca perto de uma comunidade que acompanha lives, participa
                das conversas e volta para viver cada novo capítulo do canal.
              </p>
              <p className="mt-3 text-muted">
                Conheça a presença do canal nas plataformas ou apresente sua marca, produto ou ideia para criarmos uma
                ação que faça sentido para os dois lados.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <NavButton variant="default" to="/comunidade">
                  Conheça a comunidade →
                </NavButton>
                <Button variant="gold" onClick={() => setModalOpen(true)}>
                  Quero ser parceiro
                </Button>
              </div>
            </div>
            <div className="sm:flex sm:flex-1 sm:justify-center">
              <Logo className="h-28 w-28 shrink-0 sm:h-36 sm:w-36" />
            </div>
          </div>
        </Container>
      </section>

      <PartnershipModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
