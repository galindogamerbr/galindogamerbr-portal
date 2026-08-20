import { Eyebrow } from '../ui/Eyebrow'
import { Button } from '../ui/Button'

type PartnershipTeaserProps = {
  onOpenModal: () => void
}

// Card "Um projeto feito para crescer" (usado em Sobre.tsx) — extraído pra
// componente próprio pra ficar fácil de achar e mexer (ex: posição/tamanho
// da logo, o gap entre ela e o texto) sem precisar procurar dentro do
// arquivo inteiro da página.
export function PartnershipTeaser({ onOpenModal }: PartnershipTeaserProps) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:gap-16 sm:p-8">
      <div>
        <Eyebrow>Um projeto feito para crescer</Eyebrow>
        <h2 className="text-2xl sm:text-3xl">QUANDO UMA COMUNIDADE ACREDITA, UMA PAIXÃO PODE IR MUITO MAIS LONGE.</h2>
        <p className="mt-3 max-w-2xl text-muted">
          O GalindoGamerBR está sendo construído com tempo, trabalho e dedicação. A ideia não é simplesmente colocar
          uma logo em uma página: é <strong className="text-white">criar uma parceria que faça sentido para os dois
          lados</strong> e colocar marcas junto de uma comunidade real, ativa e construída com proximidade.
        </p>
        <Button variant="gold" className="mt-6" onClick={onOpenModal}>
          Quero conhecer o projeto →
        </Button>
      </div>
      {/* Tamanho/gap da logo: ajuste h-28/w-28 (sm:h-36/w-36) e sm:gap-16 acima. */}
      <img
        src="/assets/logos/galindogamerbr.webp"
        alt="Logo GalindoGamerBR"
        className="h-28 w-28 shrink-0 rounded-full object-cover sm:h-36 sm:w-36"
      />
    </div>
  )
}
