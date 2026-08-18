import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { NavButton } from '../components/ui/Button'
import { PageBackground } from '../components/layout/PageBackground'

// Igual ao escurecimento padrão (#03070b40) até a metade, depois some — o
// Galindo fica no lado direito da imagem (about-bg.webp) e não pode ficar
// escurecido junto do resto do fundo.
const ABOUT_OVERLAY = 'linear-gradient(90deg, #03070b40 0%, #03070b40 50%, transparent 80%)'

const CHIPS = ['41 anos', 'Casado', 'Gamer desde criança', 'Windows 95', 'Simuladores', 'Roleplay', 'Comunidade']

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
  return (
    <>
      <PageBackground image="/assets/about-bg.webp" overlay={ABOUT_OVERLAY} />
      <section className="py-16 sm:py-24">
        <Reveal>
          <Container className="max-w-3xl">
            <Eyebrow>A história por trás do canal</Eyebrow>
            <h1 className="text-4xl sm:text-5xl">MAIS QUE UMA LIVE.</h1>
            <p className="mt-3 text-lg text-muted">
              Por trás de cada transmissão existe uma pessoa, uma família, uma história e uma paixão que começou
              muito antes das lives.
            </p>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div className="max-w-xl rounded-lg border border-line bg-panel/90 p-6 backdrop-blur-sm sm:p-8">
              <Eyebrow>Quem é o Galindo?</Eyebrow>
              <h2 className="text-2xl sm:text-3xl">
                EU NÃO CRIEI APENAS UM CANAL. CRIEI UM LUGAR PARA COMPARTILHAR UMA PAIXÃO.
              </h2>
              <div className="mt-4 space-y-4 text-justify text-muted">
                <p>
                  <strong className="text-white">
                    Tenho 41 anos, sou casado, trabalho na cidade e tenho uma vida como qualquer pessoa que corre
                    atrás dos seus objetivos.
                  </strong>{' '}
                  Mas existe uma parte que nunca ficou para trás: aquele garoto que descobriu, nos videogames e na
                  época do Windows 95, que uma tela podia abrir portas para mundos inteiros.
                </p>
                <p>
                  Os anos passaram. Vieram responsabilidades, trabalho, família e uma vida cada vez mais corrida. Só
                  que a paixão pelos jogos continuou ali. E foi justamente dessa paixão que nasceu o GalindoGamerBR.
                </p>
                <p>
                  As lives são a maneira de colocar essa paixão para fora e mostrar um pedaço da vida para o mundo.
                  Não é apenas ligar o jogo e transmitir: é entrar em contato com pessoas, conhecer histórias, rir,
                  trocar ideia e construir lembranças que não existiriam jogando sozinho.
                </p>
                <p>
                  <strong className="text-white">Uma boa live precisa fazer alguém querer voltar.</strong> Pode ser
                  pela resenha, pelo gameplay, pela história de uma fazenda, por um momento inesperado no roleplay ou
                  simplesmente porque existe alguém do outro lado disposto a conversar.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {CHIPS.map((chip) => (
                  <span key={chip} className="rounded-full border border-gold bg-panel2 px-3 py-1 text-xs text-gold">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
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

      {/* TODO: reativar seção de parceiros quando a página/fluxo estiver pronto (ver App.tsx) */}
      {/*
      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div className="rounded-lg border border-gold/40 bg-panel p-6 sm:p-8">
              <Eyebrow>Um projeto feito para crescer</Eyebrow>
              <h2 className="text-2xl sm:text-3xl">QUANDO UMA COMUNIDADE ACREDITA, UMA PAIXÃO PODE IR MUITO MAIS LONGE.</h2>
              <p className="mt-3 max-w-2xl text-muted">
                O GalindoGamerBR está sendo construído com tempo, trabalho e dedicação. A ideia não é simplesmente
                colocar uma logo em uma página: é <strong className="text-white">criar uma parceria que faça
                sentido para os dois lados</strong> e colocar marcas junto de uma comunidade real, ativa e
                construída com proximidade.
              </p>
              <NavButton variant="gold" className="mt-6" to="/parceiros">
                Quero conhecer o projeto →
              </NavButton>
            </div>
          </Container>
        </Reveal>
      </section>
      */}

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
    </>
  )
}
