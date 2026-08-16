import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

export function Privacidade() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">POLÍTICA DE PRIVACIDADE</h1>
        <div className="mt-8 space-y-4 rounded-lg border border-line bg-panel p-6 text-muted sm:p-8">
          <p>
            Este site é uma página institucional do GalindoGamerBR. Dados enviados voluntariamente em formulários
            locais devem ser tratados com responsabilidade e usados apenas para a finalidade apresentada.
          </p>
          <p>Links para plataformas externas seguem as políticas e termos de cada serviço.</p>
        </div>
      </Container>
    </section>
  )
}
