import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { NavButton } from '../components/ui/Button'
import { PageBackground } from '../components/layout/PageBackground'
import { PartnershipTeaser } from '../components/shared/PartnershipTeaser'

const ABOUT_OVERLAY = 'linear-gradient(90deg, rgba(3,7,11,0.2) 0%, rgba(3,7,11,0.72) 42%, rgba(3,7,11,0.12) 82%)'

const CHIPS = ['41 anos', 'Casado', 'Gamer desde criança', 'Windows 95', 'Simuladores', 'Roleplay', 'Comunidade']

const STORY = [
  {
    n: '01',
    eyebrow: 'O começo',
    title: 'ANTES DAS LIVES',
    text: 'Os videogames e o Windows 95 abriram as primeiras portas para uma paixão que atravessou diferentes fases da vida.',
  },
  {
    n: '02',
    eyebrow: 'O canal',
    title: 'PAIXÃO QUE VIROU HISTÓRIA',
    text: 'Farming Simulator, GTA RP, SnowRunner, Euro Truck Simulator e muitos outros jogos passaram a render histórias compartilhadas ao vivo.',
  },
  {
    n: '03',
    eyebrow: 'As pessoas',
    title: 'O MELHOR ESTÁ DO OUTRO LADO',
    text: 'O jogo pode ser o motivo da chegada, mas são a resenha, a amizade e a vontade de participar que fazem alguém permanecer.',
  },
  {
    n: '04',
    eyebrow: 'O propósito',
    title: 'DEIXAR UMA BOA LEMBRANÇA',
    text: 'Uma risada, uma história, uma amizade ou um momento de acolhimento. Tudo isso dá significado a cada transmissão.',
  },
] as const

export function Sobre() {
  return (
    <>
      <PageBackground image="/assets/about-bg.webp" overlay={ABOUT_OVERLAY} />

      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_40%,rgba(217,177,79,0.14),transparent_38%)]" />
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow>A história por trás do canal</Eyebrow>
                <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold">Desde os primeiros jogos</span>
              </div>
              <h1 className="mt-5 text-5xl leading-[0.92] sm:text-7xl">MAIS QUE UMA LIVE. UMA HISTÓRIA COMPARTILHADA.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Por trás de cada transmissão existe uma pessoa, uma família e uma paixão que começou muito antes de existir o GalindoGamerBR.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#historia" className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-3 text-sm font-bold uppercase text-bg transition hover:brightness-110">Conhecer a história</a>
                <NavButton variant="blue" to="/comunidade">Conhecer a comunidade</NavButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="historia" className="border-y border-line bg-panel/45 py-16 sm:py-24">
        <Reveal>
          <Container>
            <div className="relative min-h-[520px] overflow-hidden rounded-xl border border-gold/40 bg-panel bg-[url('/assets/about-galindo.webp')] bg-cover bg-[position:35%_center] shadow-[0_24px_70px_-38px_rgba(217,177,79,0.65)] lg:bg-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg/35 to-bg/95" />
              <div className="relative ml-auto flex min-h-[520px] max-w-2xl flex-col justify-center p-7 sm:p-10 lg:w-[58%] lg:p-12">
                <Eyebrow>Quem é o Galindo?</Eyebrow>
                <h2 className="mt-1 text-3xl sm:text-4xl">UM CARA COMUM. UMA PAIXÃO QUE NUNCA FICOU PARA TRÁS.</h2>
                <div className="mt-5 space-y-4 leading-relaxed text-muted">
                  <p>
                    Tenho 41 anos, sou casado, trabalho na cidade e corro atrás dos meus objetivos como qualquer pessoa. Mas aquele garoto que descobriu novos mundos nos videogames e no Windows 95 continua aqui.
                  </p>
                  <p>
                    O GalindoGamerBR nasceu da vontade de compartilhar essa paixão. As lives transformaram horas de jogo em encontros, histórias, risadas e lembranças que não existiriam jogando sozinho.
                  </p>
                  <p className="font-semibold text-white">Uma boa live precisa fazer alguém querer voltar.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {CHIPS.map((chip) => <span key={chip} className="rounded-full border border-gold/45 bg-bg/65 px-3 py-1.5 text-xs font-semibold text-gold">{chip}</span>)}
                </div>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="py-16 sm:py-24">
        <Reveal>
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>De onde veio tudo isso</Eyebrow>
              <h2 className="mt-2 text-4xl sm:text-5xl">UMA PAIXÃO QUE GANHOU NOVOS CAPÍTULOS</h2>
              <p className="mt-4 text-lg text-muted">Do primeiro contato com os jogos até uma comunidade inteira reunida em torno das transmissões.</p>
            </div>

            <div className="relative mt-12 grid gap-5 md:grid-cols-4">
              <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent md:block" />
              {STORY.map((item) => (
                <div key={item.n} className="group relative rounded-lg border border-line bg-gradient-to-br from-panel to-panel2 p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/60">
                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-bg text-sm font-bold text-gold shadow-[0_0_24px_-8px_rgba(217,177,79,0.7)]">{item.n}</span>
                  <span className="mt-6 block text-xs font-semibold uppercase tracking-widest text-gold">{item.eyebrow}</span>
                  <h3 className="mt-2 text-lg">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal><Container><PartnershipTeaser /></Container></Reveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <Reveal>
          <Container>
            <div className="relative overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-r from-gold/10 via-panel to-panel p-7 text-center shadow-[0_20px_65px_-42px_rgba(217,177,79,0.7)] sm:p-10">
              <div className="absolute left-1/2 top-0 h-36 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative mx-auto max-w-3xl">
                <Eyebrow>Essa história continua</Eyebrow>
                <h2 className="mt-2 text-3xl sm:text-5xl">TALVEZ O PRÓXIMO CAPÍTULO TAMBÉM TENHA VOCÊ.</h2>
                <p className="mx-auto mt-4 max-w-2xl text-muted">O GalindoGamerBR é um projeto independente que transforma diversão em encontros com significado.</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <NavButton variant="red" to="/">Conhecer o canal</NavButton>
                  <NavButton variant="blue" to="/comunidade">Fazer parte da comunidade</NavButton>
                </div>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>
    </>
  )
}
