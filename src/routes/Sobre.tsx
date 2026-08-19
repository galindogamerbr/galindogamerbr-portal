import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { Button, NavButton, buttonClasses } from '../components/ui/Button'
import { PageBackground } from '../components/layout/PageBackground'
import { PartnershipModal } from '../components/shared/PartnershipModal'

// Igual ao escurecimento padrão (#03070b40) até a metade, depois some — o
// Galindo fica no lado direito da imagem (about-bg.webp) e não pode ficar
// escurecido junto do resto do fundo.
const ABOUT_OVERLAY = 'linear-gradient(90deg, #03070b40 0%, #03070b40 50%, transparent 80%)'

const STORY = [
  {
    n: '01 • COMEÇO',
    title: 'ANTES DAS LIVES',
    text: 'Antes de existir canal, corte, plataforma ou comunidade, existia simplesmente a vontade de jogar. Os videogames e o Windows 95 fizeram parte dessa descoberta e ajudaram a construir uma paixão que atravessou diferentes fases da vida.',
  },
  {
    n: '02 • HOJE',
    title: 'TRANSFORMAR PAIXÃO EM HISTÓRIA',
    text: 'Hoje essa paixão é compartilhada em Farming Simulator 25, Fúria Reborn GTA RP, SnowRunner, Euro Truck Simulator 2 e outros jogos. Cada transmissão vira uma nova história — e cada pessoa que chega pode fazer parte dela.',
  },
  {
    n: '03 • PESSOAS',
    title: 'O MELHOR DO CANAL ESTÁ DO OUTRO LADO',
    text: 'O jogo pode ser o motivo da entrada, mas são as pessoas que fazem alguém permanecer. A comunidade nasceu da resenha, da amizade, da ajuda e da vontade de jogar junto.',
  },
  {
    n: '04 • PROPÓSITO',
    title: 'DEIXAR UMA BOA LEMBRANÇA',
    text: 'A ideia é que quem passe por aqui leve alguma coisa: uma risada, uma história, uma amizade, uma dica, uma inspiração ou simplesmente um momento em que se sentiu bem-vindo.',
  },
]

export function Sobre() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <PageBackground image="/assets/about-bg.webp" overlay={ABOUT_OVERLAY} />

      {/* Banner com a foto do Galindo (imagem autocontida, borda dourada
          própria — ver about-bg.webp acima, que é o fundo fixo da página)
          ao lado do resumo "quem é o Galindo". */}
      <section className="py-16 sm:py-24">
        <Reveal>
          <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <img
              src="/assets/about-galindo.webp"
              alt="Galindo, criador do canal GalindoGamerBR"
              className="w-full rounded-lg"
            />
            <div>
              <Eyebrow>Sobre o Galindo</Eyebrow>
              <h1 className="text-4xl sm:text-5xl">POR TRÁS DA LIVE, EXISTE UMA HISTÓRIA.</h1>
              <p className="mt-3 text-lg text-muted">
                41 anos, casado, trabalha na cidade e continua sendo aquele cara que se apaixonou por jogos quando
                ainda era criança. O canal nasceu para criar encontros, não só transmissões.
              </p>
              <a href="#historia" className={buttonClasses('gold', 'md', 'mt-6')}>
                Conheça minha história →
              </a>
            </div>
          </Container>
        </Reveal>
      </section>

      <section id="historia" className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <Eyebrow>De onde veio tudo isso</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">UMA PAIXÃO QUE FOI CRESCENDO.</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {STORY.map((item) => (
                <div key={item.n} className="rounded-lg border border-line bg-panel p-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gold">{item.n}</span>
                  <h3 className="mt-2 text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div className="flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <Eyebrow>Um projeto feito para crescer</Eyebrow>
                <h2 className="text-2xl sm:text-3xl">QUANDO UMA COMUNIDADE ACREDITA, UMA PAIXÃO PODE IR MUITO MAIS LONGE.</h2>
                <p className="mt-3 max-w-2xl text-muted">
                  O GalindoGamerBR está sendo construído com tempo, trabalho e dedicação. A ideia não é simplesmente
                  colocar uma logo em uma página: é <strong className="text-white">criar uma parceria que faça
                  sentido para os dois lados</strong> e colocar marcas junto de uma comunidade real, ativa e
                  construída com proximidade.
                </p>
                <Button variant="gold" className="mt-6" onClick={() => setModalOpen(true)}>
                  Quero conhecer o projeto →
                </Button>
              </div>
              <img
                src="/assets/logos/galindogamerbr.webp"
                alt="Logo GalindoGamerBR"
                className="h-28 w-28 shrink-0 rounded-full object-cover sm:h-36 sm:w-36"
              />
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24 text-center">
        <Reveal>
          <Container className="max-w-2xl">
            <Eyebrow>Se você chegou até aqui...</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">ENTÃO TALVEZ VOCÊ JÁ FAÇA PARTE DESSA HISTÓRIA.</h2>
            <p className="mt-4 text-muted">
              Esse é o GalindoGamerBR: um projeto feito por uma pessoa comum, apaixonada por games, tentando
              transformar algumas horas de diversão em encontros que tenham significado.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <NavButton variant="red" to="/">
                Conhecer o canal →
              </NavButton>
              <NavButton variant="blue" to="/comunidade">
                Fazer parte da comunidade →
              </NavButton>
            </div>
          </Container>
        </Reveal>
      </section>

      <PartnershipModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
