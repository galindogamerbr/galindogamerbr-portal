import { useEffect, useState } from 'react'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { LinkButton } from '../components/ui/Button'

const MODSYNC_URL = 'https://modsync.phmoreira.dev/'
const DOWNLOAD_LATEST_URL = 'https://modsync.phmoreira.dev/download/latest'
const LATEST_VERSION_URL = 'https://modsync.phmoreira.dev/latest'

const FEATURES = [
  { icon: '🔄', title: 'Sincronização automática', text: 'Pasta de mods e servidor sempre alinhados, sem esforço manual.' },
  { icon: '📦', title: 'Direto da fonte oficial', text: 'Sempre a mesma versão usada nas lives, sem garimpar link perdido.' },
  { icon: '⚡', title: 'Um clique', text: 'Baixa o que falta e remove o que não bate mais, automaticamente.' },
] as const

// TODO: confirmar com o Pedro o formato real da resposta de /latest quando
// o endpoint estiver no ar — assumindo { version: string } por convenção.
type LatestVersionResponse = { version?: string }

// Versão atual mostrada ao lado do botão de download — busca direto do
// modsync.phmoreira.dev (fora do nosso backend, sem proxy), então falha em
// silêncio se o CORS não estiver liberado lá ou a resposta vier num formato
// diferente do esperado: nunca mostra um número errado, só esconde o badge.
function useLatestVersion(): string | null {
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetch(LATEST_VERSION_URL)
      .then((res) => (res.ok ? (res.json() as Promise<LatestVersionResponse>) : null))
      .then((data) => {
        if (active && data?.version) setVersion(data.version)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return version
}

// App feito pelo dev do site (phmoreira.dev) pra sincronizar os mods usados
// na Fazenda Nova Aliança — antes só linkado direto no card "Mods da
// Fazenda" da Comunidade (ver src/routes/Comunidade.tsx); esta página
// existe pra explicar o que é antes de mandar pro app externo.
// TODO: trocar o placeholder abaixo pelo gif de demonstração quando chegar.
export function Mods() {
  const latestVersion = useLatestVersion()

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Farming Simulator 25</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">MOD SYNC — MODS DA FAZENDA</h1>
        <p className="mt-3 text-muted">
          App feito pra manter os mods da Fazenda Nova Aliança sempre sincronizados e atualizados, sem complicação —
          baixe, instale e jogue com exatamente os mesmos mods usados nas lives.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <LinkButton variant="green" href={DOWNLOAD_LATEST_URL} target="_blank" rel="noopener noreferrer">
            Baixar versão mais recente
          </LinkButton>
          <LinkButton variant="default" href={MODSYNC_URL} target="_blank" rel="noopener noreferrer">
            Ver notas de versão
          </LinkButton>
          {latestVersion && (
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Versão atual: {latestVersion}</span>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-md border border-line bg-panel2 p-4">
              <span className="text-2xl">{feature.icon}</span>
              <h4 className="mt-2 text-sm font-semibold uppercase tracking-wide">{feature.title}</h4>
              <p className="mt-1 text-xs text-muted">{feature.text}</p>
            </div>
          ))}
        </div>

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

        <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-line bg-panel p-6 text-sm text-muted sm:p-8">
          Demonstração em breve
        </div>
      </Container>
    </section>
  )
}
