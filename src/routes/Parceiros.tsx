import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { NavButton } from '../components/ui/Button'

export function Parceiros() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Parceiros</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">PARCEIROS</h1>
        <p className="mt-3 text-muted">
          Espaço reservado para marcas e projetos que acreditam no trabalho do GalindoGamerBR.
        </p>

        <div className="mt-8 rounded-lg border border-line bg-panel p-6 sm:p-8">
          <h2 className="text-2xl">SUA MARCA AQUI</h2>
          <p className="mt-2 text-muted">
            Interessado em parceria, divulgação ou projeto conjunto? Entre em contato para conversarmos.
          </p>
          <NavButton variant="gold" className="mt-6" to="/contato">
            Falar sobre parceria
          </NavButton>
        </div>
      </Container>
    </section>
  )
}
