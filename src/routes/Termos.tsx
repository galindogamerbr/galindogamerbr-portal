import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

export function Termos() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">TERMOS DE USO</h1>
        <p className="mt-3 text-muted">Última atualização: 18 de agosto de 2026.</p>

        <div className="mt-8 space-y-6 rounded-lg border border-line bg-panel p-6 text-muted sm:p-8">
          <div>
            <h2 className="text-lg text-white">Sobre este site</h2>
            <p className="mt-2">
              Este site (galindogamerbr.com.br) é a página institucional do canal GalindoGamerBR. Ele mostra
              programação de lives, vídeos em destaque e números públicos da comunidade (seguidores/inscritos em
              cada rede). Ao usar o site, você concorda com estes termos.
            </p>
          </div>

          <div>
            <h2 className="text-lg text-white">Uso do conteúdo</h2>
            <p className="mt-2">
              O conteúdo do site (textos, imagens, marca) pertence ao GalindoGamerBR. Links para vídeos e
              transmissões apontam pra plataformas de terceiros (YouTube, Twitch, Kick, TikTok, Instagram, Discord),
              que têm seus próprios termos de uso, aos quais este site não se responsabiliza.
            </p>
          </div>

          <div>
            <h2 className="text-lg text-white">Área administrativa</h2>
            <p className="mt-2">
              O painel administrativo (<code className="text-white">/admin</code>) é de uso exclusivo da equipe do
              canal, protegido por login. Não é uma área de cadastro pública.
            </p>
          </div>

          <div>
            <h2 className="text-lg text-white">Disponibilidade</h2>
            <p className="mt-2">
              O site é oferecido "como está". Números de seguidores, status de live e visitas dependem de serviços de
              terceiros (YouTube, Twitch, Kick, TikTok, Instagram, Discord, Cloudflare) e podem ficar temporariamente
              indisponíveis ou desatualizados sem aviso prévio.
            </p>
          </div>

          <div>
            <h2 className="text-lg text-white">Contato</h2>
            <p className="mt-2">
              Dúvidas sobre estes termos podem ser enviadas para{' '}
              <a href="mailto:contato@galindogamerbr.com.br" className="text-gold hover:underline">
                contato@galindogamerbr.com.br
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
