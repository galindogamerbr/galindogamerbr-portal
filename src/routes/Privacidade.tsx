import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

export function Privacidade() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">POLÍTICA DE PRIVACIDADE</h1>
        <p className="mt-3 text-muted">Última atualização: 18 de agosto de 2026.</p>

        <div className="mt-8 space-y-6 rounded-lg border border-line bg-panel p-6 text-muted sm:p-8">
          <div>
            <h2 className="text-lg text-white">Quem opera este site</h2>
            <p className="mt-2">
              Este site (galindogamerbr.com.br) é a página institucional do canal GalindoGamerBR. Dúvidas sobre
              privacidade podem ser enviadas para{' '}
              <a href="mailto:contato@galindogamerbr.com.br" className="text-gold hover:underline">
                contato@galindogamerbr.com.br
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg text-white">Quais dados coletamos</h2>
            <p className="mt-2">
              Visitantes comuns do site não precisam criar conta nem enviar dados pessoais pra navegar. Coletamos
              apenas:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-white">Estatísticas de acesso agregadas</strong> (páginas visitadas,
                navegador, país aproximado), via Cloudflare Web Analytics. O serviço não usa cookies de rastreamento nem
                identifica visitantes individualmente.
              </li>
              <li>
                <strong className="text-white">Login administrativo</strong>: só a pessoa responsável pelo canal usa
                o painel administrativo, autenticando por email e código de uso único (OTP). Isso gera um cookie de
                sessão técnico, necessário só pra manter esse login ativo.
              </li>
              <li>
                <strong className="text-white">Formulários de contato</strong> (quando enviados) usam os dados só
                pra responder a mensagem, nunca pra outra finalidade.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg text-white">Métricas públicas de redes sociais</h2>
            <p className="mt-2">
              A página Comunidade mostra números públicos de seguidores/inscritos do canal (YouTube, Twitch, Discord,
              TikTok, Kick e Instagram), obtidos a partir de dados públicos dessas plataformas e/ou de suas APIs
              oficiais quando aplicável (ex.: Instagram Graph API). Não coletamos nem armazenamos dados pessoais de
              quem segue o canal nessas redes. Guardamos apenas o número total e público de seguidores.
            </p>
          </div>

          <div>
            <h2 className="text-lg text-white">Serviços de terceiros</h2>
            <p className="mt-2">
              O site roda na infraestrutura da Cloudflare (hospedagem, analytics, banco de dados) e usa a Resend pra
              envio de emails do login administrativo. Links para YouTube, Twitch, Discord, TikTok, Kick, Instagram e
              WhatsApp seguem as políticas de privacidade de cada uma dessas plataformas.
            </p>
          </div>

          <div>
            <h2 className="text-lg text-white">Seus direitos</h2>
            <p className="mt-2">
              Você pode pedir a exclusão de qualquer dado pessoal que tenha nos enviado, por exemplo por email, a qualquer
              momento, escrevendo para{' '}
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
