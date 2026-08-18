import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { LinkButton } from '../components/ui/Button'
// TODO: reimportar `NavButton` junto com a seção de parceiros comentada abaixo, quando reativada
import { SocialLinks } from '../components/layout/SocialLinks'

export function Contato() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <Eyebrow>Contato</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">FALE COM O GALINDO</h1>
          <p className="mt-3 text-muted">Parcerias, projetos e assuntos da comunidade.</p>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Contato profissional</Eyebrow>
            <h2 className="text-2xl sm:text-3xl">VAMOS CONVERSAR.</h2>
            <p className="mt-2 text-muted">
              Se você quer falar sobre parceria, projeto, marca ou comunidade, este é o canal certo.
            </p>
            <div className="mt-6 space-y-3 rounded-lg border border-line bg-panel p-6">
              <a href="mailto:contato@galindogamerbr.com.br" className="block text-sm text-white/80 hover:text-gold">
                <b className="text-white">E-mail:</b> contato@galindogamerbr.com.br
              </a>
              <a href="mailto:parcerias@galindogamerbr.com.br" className="block text-sm text-white/80 hover:text-gold">
                <b className="text-white">Parcerias:</b> parcerias@galindogamerbr.com.br
              </a>
              <LinkButton variant="gold" href="mailto:parcerias@galindogamerbr.com.br" className="mt-2">
                Enviar e-mail →
              </LinkButton>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-muted">Me acompanhe nas redes sociais</div>
            <SocialLinks className="mt-4 flex-wrap" />
          </div>
        </Container>
      </section>

      {/* TODO: reativar seção de parceiros quando a página/fluxo estiver pronto (ver App.tsx) */}
      {/*
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <Eyebrow>Parceiros e marcas</Eyebrow>
              <h2 className="text-xl sm:text-2xl">UMA PARCERIA QUE FAÇA SENTIDO PARA OS DOIS LADOS.</h2>
              <p className="mt-2 max-w-xl text-muted">
                Não é sobre colocar uma logo. É sobre criar presença, relacionamento e uma história que a comunidade
                reconheça.
              </p>
            </div>
            <NavButton variant="gold" to="/parceiros" className="shrink-0">
              Quero ser parceiro →
            </NavButton>
          </div>
        </Container>
      </section>
      */}
    </>
  )
}
