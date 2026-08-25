import { Eyebrow } from '../ui/Eyebrow'
import { LinkButton } from '../ui/Button'

// Critério de entrada: um dos dois qualifica (não os dois ao mesmo tempo).
const ELIGIBILITY = [
  { title: 'YouTube', text: 'Membro Ouro ou acima.', icon: 'youtube' },
  { title: 'TikTok', text: 'Super Fan.', icon: 'tiktok' },
]

// Passos de verdade, sequenciais, depois de já se qualificar por um dos critérios acima.
const STEPS = [
  { n: '01', title: 'Discord', text: 'Entrar e acessar as regras.' },
  { n: '02', title: 'Regras', text: 'Assistir ao vídeo e ler tudo.' },
  { n: '03', title: 'Solicitação', text: 'Estar de acordo e solicitar entrada.' },
  { n: '04', title: 'Liberação', text: 'Conferência dos requisitos pelo administrador.' },
] as const

type VipStepsProps = {
  variant?: 'full' | 'compact'
}

// Fonte única do fluxo VIP — usado completo em /comunidade e resumido no
// teaser da Home, pra nunca dessincronizar as regras entre os dois lugares.
export function VipSteps({ variant = 'full' }: VipStepsProps) {
  return (
    <div className="rounded-lg border border-line bg-panel bg-[radial-gradient(circle_at_top,rgba(217,177,79,0.08),transparent_60%)] p-6 sm:p-8">
      <Eyebrow>Área VIP</Eyebrow>
      <h2 className="text-3xl sm:text-4xl">GRUPO VIP DO CANAL</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Um espaço exclusivo e propositalmente seleto que reconhece quem fortalece o canal e ajuda a manter vivo o
        servidor, os projetos e toda a resenha que construímos juntos.
      </p>
      <p className="mt-2 max-w-2xl text-muted">
        Já se qualifica? Bora fazer parte dessa comunidade. Chega junto e ajuda a manter a resenha viva!
      </p>

      {variant === 'full' && (
        <>
          <div className="mt-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Critério de entrada (um dos dois)</span>
            <div className="mt-2 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              {ELIGIBILITY.map((item, index) => (
                <div key={item.title} className="flex flex-1 items-center gap-2 sm:contents">
                  <div className="flex flex-1 items-center gap-3 rounded-md border border-line bg-panel2 p-4">
                    <img src={`/assets/icons/${item.icon}.svg`} alt="" className="h-6 w-6 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide">{item.title}</h4>
                      <p className="mt-1 text-xs text-muted">{item.text}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="shrink-0 self-center rounded-full border border-gold/40 px-2 py-1 text-xs font-bold text-gold">
                      OU
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-md border border-line bg-panel2 p-4">
                <span className="text-sm font-bold text-gold">{step.n}</span>
                <h4 className="mt-1 text-sm font-semibold uppercase tracking-wide">{step.title}</h4>
                <p className="mt-1 text-xs text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton variant="blue" href="/discord" target="_blank" rel="noopener noreferrer">
          1. Entrar no Discord
        </LinkButton>
        <LinkButton
          variant="gold"
          href="https://chat.whatsapp.com/JpsiqErWdAx3pHqvVSbp7R"
          target="_blank"
          rel="noopener noreferrer"
        >
          2. Solicitar entrada VIP
        </LinkButton>
      </div>
      <p className="mt-4 text-xs text-muted">A liberação é feita por um administrador após conferência dos requisitos.</p>
    </div>
  )
}
