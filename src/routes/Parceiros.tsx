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
            Parceria de verdade não é logo em banner, é fazer parte do que a comunidade já assiste, comenta e
            confia. Se a sua marca ou projeto conversa com quem curte Farming Simulator, ETS2, SnowRunner e a
            resenha ao vivo, bora conversar.
          </p>
          <p className="mt-3 text-muted">
            Pode ser um produto testado ao vivo, um mod apresentado durante a gameplay, uma menção na resenha, um
            vídeo dedicado ou uma ação pensada junto com a comunidade. O formato se ajusta ao que faz sentido pra sua
            marca e pra quem acompanha o canal todos os dias.
          </p>

          <div className="mt-8 flex flex-col items-start gap-6 rounded-lg border border-gold/40 bg-panel p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-2xl">VAMOS CONVERSAR SOBRE PARCERIA?</h2>
              <p className="mt-2 text-muted">
                Conta um pouco sobre a marca, o projeto ou a ideia. A gente responde direto no seu e-mail com os
                próximos passos.
              </p>
              <Button variant="gold" className="mt-6" onClick={() => setModalOpen(true)}>
                Quero ser parceiro
              </Button>
            </div>
            <div className="sm:flex sm:flex-1 sm:justify-center">
              <Logo className="h-28 w-28 shrink-0 sm:h-36 sm:w-36" />
            </div>
          </div>
        </Container>
      </section>

      <PartnershipModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
