import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { LinkButton } from '../components/ui/Button'

const MODSYNC_URL = 'https://modsync.phmoreira.dev/'

// App feito pelo dev do site (phmoreira.dev) pra sincronizar os mods usados
// na Fazenda Nova Aliança — antes só linkado direto no card "Mods da
// Fazenda" da Comunidade (ver src/routes/Comunidade.tsx); esta página
// existe pra explicar o que é antes de mandar pro app externo.
// TODO: trocar o placeholder abaixo pelo gif de demonstração quando chegar.
export function Mods() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Farming Simulator 25</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">MOD SYNC — MODS DA FAZENDA</h1>
        <p className="mt-3 text-muted">
          App feito pra manter os mods da Fazenda Nova Aliança sempre sincronizados e atualizados, sem complicação —
          baixe, instale e jogue com exatamente os mesmos mods usados nas lives.
        </p>

        <div className="mt-8 space-y-3 text-muted">
          <p>
            Quem já tentou acompanhar a fazenda sabe a dor: baixar mod por mod em sites diferentes, comparar versão
            com versão, e só descobrir que tava tudo desatualizado (ou sobrando arquivo velho na pasta) bem na hora
            de entrar no servidor. Cada atualização virava uma caçada.
          </p>
          <p>
            O Mod Sync acabou com isso. Aponta ele pra sua pasta de mods e ele cuida do resto: baixa o que falta,
            remove o que não bate mais e mantém tudo sincronizado direto com a versão oficial usada nas lives — sem
            link pra procurar, sem versão pra adivinhar, sem surpresa na hora de jogar.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start gap-6 rounded-lg border border-line bg-panel p-6 sm:p-8">
          <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-line bg-panel2 text-sm text-muted">
            Demonstração em breve
          </div>

          <LinkButton variant="gold" href={MODSYNC_URL} target="_blank" rel="noopener noreferrer">
            Abrir Mod Sync →
          </LinkButton>
        </div>
      </Container>
    </section>
  )
}
