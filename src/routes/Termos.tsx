import { LegalDocument, type LegalSection } from '../components/shared/LegalDocument'

const SECTIONS: LegalSection[] = [
  { title: 'Sobre este site', content: <p>Este site, galindogamerbr.com.br, é a página institucional do canal GalindoGamerBR. Ele apresenta a programação das lives, vídeos em destaque e números públicos da comunidade. Ao utilizar o portal, você concorda com estes termos.</p> },
  { title: 'Uso do conteúdo', content: <p>Os textos, imagens e elementos da marca pertencem ao GalindoGamerBR. Links para vídeos e transmissões levam a plataformas de terceiros, como YouTube, Twitch, Kick, TikTok, Instagram e Discord, que possuem seus próprios termos de uso. O portal não controla nem se responsabiliza pelas regras ou disponibilidade desses serviços.</p> },
  { title: 'Área administrativa', content: <p>O painel administrativo, disponível em <code className="rounded bg-bg px-1.5 py-0.5 text-white">/admin</code>, é de uso exclusivo da equipe do canal e protegido por autenticação. Não se trata de uma área de cadastro público.</p> },
  { title: 'Disponibilidade', content: <p>O site é oferecido como está. Números de seguidores, status das lives e visitas dependem de serviços de terceiros e podem ficar temporariamente indisponíveis ou desatualizados sem aviso prévio.</p> },
  { title: 'Contato', content: <p>Dúvidas sobre estes termos podem ser enviadas para <a href="mailto:contato@galindogamerbr.com.br" className="font-semibold text-gold hover:underline">contato@galindogamerbr.com.br</a>.</p> },
]

export function Termos() {
  return <LegalDocument eyebrow="Regras do portal" title="TERMOS DE USO" introduction="As condições essenciais para utilizar o portal e acessar os conteúdos e serviços conectados ao universo GalindoGamerBR." updatedAt="18 de agosto de 2026" sections={SECTIONS} />
}
