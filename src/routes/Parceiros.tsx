import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { PartnershipModal } from '../components/shared/PartnershipModal'

export function Parceiros() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <Eyebrow>Parceiros</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">SUA MARCA NA RESENHA</h1>
          <p className="mt-3 text-muted">
            Marcas e projetos que fazem sentido pra comunidade do canal — não é sobre colocar uma logo, é sobre
            presença de verdade: conteúdo, live, comunidade e uma audiência que confia no que o Galindo mostra.
          </p>

          <div className="mt-8 flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-2xl">VAMOS CONVERSAR SOBRE PARCERIA?</h2>
              <p className="mt-2 text-muted">
                Conta pra gente sobre a marca, o projeto ou a ideia — respondemos direto no seu e-mail.
              </p>
              <Button variant="gold" className="mt-6" onClick={() => setModalOpen(true)}>
                Quero ser parceiro
              </Button>
            </div>
            <Logo className="h-28 w-28 shrink-0 sm:ml-auto sm:h-36 sm:w-36" />
          </div>
        </Container>
      </section>

      <PartnershipModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
