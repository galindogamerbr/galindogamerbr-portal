import { Eyebrow } from '../ui/Eyebrow'
import { NavButton } from '../ui/Button'

// Card "Um projeto feito para crescer" (usado em Sobre.tsx) — extraído pra
// componente próprio pra ficar fácil de achar e mexer (ex: tamanho da
// logo) sem precisar procurar dentro do arquivo inteiro da página.
export function PartnershipTeaser() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-gold/40 bg-gradient-to-br from-gold/10 via-panel to-panel p-6 sm:p-8">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative max-w-4xl">
        <Eyebrow>Um projeto feito para crescer</Eyebrow>
        <h2 className="text-2xl sm:text-3xl">QUANDO UMA COMUNIDADE ACREDITA, UMA PAIXÃO PODE IR MUITO MAIS LONGE.</h2>
        <p className="mt-3 max-w-2xl text-muted">
          O GalindoGamerBR está sendo construído com tempo, trabalho e dedicação. A ideia não é simplesmente colocar
          uma logo em uma página: é <strong className="text-white">criar uma parceria que faça sentido para os dois
          lados</strong> e colocar marcas junto de uma comunidade real, ativa e construída com proximidade.
        </p>
        <NavButton variant="gold" className="mt-6" to="/parceiros">
          Conhecer parcerias
        </NavButton>
      </div>
    </div>
  )
}
