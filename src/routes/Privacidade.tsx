import { LegalDocument, type LegalSection } from '../components/shared/LegalDocument'

const EMAIL_LINK = (
  <a href="mailto:contato@galindogamerbr.com.br" className="font-semibold text-gold hover:underline">
    contato@galindogamerbr.com.br
  </a>
)

const SECTIONS: LegalSection[] = [
  { title: 'Quem opera este site', content: <p>Este site, galindogamerbr.com.br, é a página institucional do canal GalindoGamerBR. Dúvidas sobre privacidade podem ser enviadas para {EMAIL_LINK}.</p> },
  {
    title: 'Quais dados coletamos',
    content: <><p>Visitantes comuns não precisam criar conta nem enviar dados pessoais para navegar. Coletamos apenas:</p><ul className="mt-4 space-y-3"><li><strong className="text-white">Estatísticas de acesso agregadas:</strong> páginas visitadas, navegador e país aproximado, via Cloudflare Web Analytics. O serviço não usa cookies de rastreamento nem identifica visitantes individualmente.</li><li><strong className="text-white">Login administrativo:</strong> apenas a pessoa responsável pelo canal usa o painel, autenticando por email e código de uso único. Um cookie técnico mantém essa sessão ativa.</li><li><strong className="text-white">Formulários de contato:</strong> quando enviados, os dados são utilizados somente para responder à mensagem.</li></ul></>,
  },
  { title: 'Métricas públicas das redes sociais', content: <p>A página Comunidade mostra números públicos de seguidores e inscritos do canal no YouTube, Twitch, Discord, TikTok, Kick e Instagram. Esses dados vêm de fontes públicas ou APIs oficiais. Não coletamos nem armazenamos dados pessoais de quem acompanha o canal nessas redes.</p> },
  { title: 'Serviços de terceiros', content: <p>O site utiliza a infraestrutura da Cloudflare para hospedagem, métricas e banco de dados, além da Resend para emails do login administrativo. Links para YouTube, Twitch, Discord, TikTok, Kick, Instagram e WhatsApp seguem as políticas de cada plataforma.</p> },
  { title: 'Seus direitos', content: <p>Você pode solicitar a exclusão de qualquer dado pessoal enviado ao canal, por exemplo por email, a qualquer momento. Para fazer uma solicitação, escreva para {EMAIL_LINK}.</p> },
]

export function Privacidade() {
  return <LegalDocument eyebrow="Privacidade e transparência" title="POLÍTICA DE PRIVACIDADE" introduction="Entenda quais informações fazem parte da operação do portal e como cuidamos dos dados relacionados à sua visita." updatedAt="18 de agosto de 2026" sections={SECTIONS} />
}
