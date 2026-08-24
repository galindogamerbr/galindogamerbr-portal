import { Eyebrow } from '../ui/Eyebrow'
import { NavButton } from '../ui/Button'
import { Logo } from '../ui/Logo'

// Card "Um projeto feito para crescer" (usado em Sobre.tsx) — extraído pra
// componente próprio pra ficar fácil de achar e mexer (ex: tamanho da
// logo) sem precisar procurar dentro do arquivo inteiro da página.
export function PartnershipTeaser() {
  return (
    <div className="flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:p-8">
      <div>
        <Eyebrow>Um projeto feito para crescer</Eyebrow>
        <h2 className="text-2xl sm:text-3xl">QUANDO UMA COMUNIDADE ACREDITA, UMA PAIXÃO PODE IR MUITO MAIS LONGE.</h2>
        <p className="mt-3 max-w-2xl text-muted">
          O GalindoGamerBR está sendo construído com tempo, trabalho e dedicação. A ideia não é simplesmente colocar
          uma logo em uma página: é <strong className="text-white">criar uma parceria que faça sentido para os dois
          lados</strong> e colocar marcas junto de uma comunidade real, ativa e construída com proximidade.
        </p>
        <NavButton variant="gold" className="mt-6" to="/comunidade">
          Quero conhecer a comunidade →
        </NavButton>
      </div>
      {/* sm:flex-1 + sm:justify-center centraliza a logo no espaço que sobra
          depois do texto (não gruda nele, nem vai até a ponta direita). */}
      <div className="sm:flex sm:flex-1 sm:justify-center">
        <Logo className="h-28 w-28 shrink-0 sm:h-36 sm:w-36" />
      </div>
    </div>
  )
}
