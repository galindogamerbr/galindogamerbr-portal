import { LegalDocument, type LegalSection } from '../components/shared/LegalDocument'

const SECTIONS: LegalSection[] = [
  {
    title: 'Aceitação e finalidade',
    content: (
      <div className="space-y-3">
        <p>Estes Termos de Uso regulam o acesso ao portal galindogamerbr.com.br, página institucional do canal GalindoGamerBR. Ao navegar ou utilizar seus recursos, você declara estar de acordo com estas condições e com a Política de Privacidade.</p>
        <p>O portal reúne informações sobre o canal, programação, vídeos, comunidade, Fazenda Nova Aliança, parceiros e caminhos para serviços mantidos em outras plataformas.</p>
      </div>
    ),
  },
  {
    title: 'Conteúdo e propriedade intelectual',
    content: (
      <div className="space-y-3">
        <p>A marca GalindoGamerBR, os textos, a identidade visual, as imagens próprias e a organização do portal são protegidos pela legislação aplicável. Recursos de terceiros permanecem sujeitos aos direitos de seus respectivos titulares e são identificados na página de Créditos quando necessário.</p>
        <p>Você pode compartilhar links públicos do portal e dos conteúdos do canal. Não é permitido copiar, vender, modificar ou explorar comercialmente materiais protegidos sem autorização, nem utilizar a marca de forma que sugira parceria ou aprovação inexistente.</p>
      </div>
    ),
  },
  {
    title: 'Uso adequado do portal',
    content: (
      <div className="space-y-3">
        <p>O portal deve ser utilizado de maneira lícita e respeitosa. É proibido tentar obter acesso não autorizado, contornar controles de segurança, interferir na disponibilidade do serviço, enviar conteúdo malicioso ou utilizar formulários para fraude, assédio, spam ou finalidade incompatível.</p>
        <p>Medidas de proteção e limitação de acesso poderão ser aplicadas quando houver indícios de abuso, risco à segurança ou violação destes termos.</p>
      </div>
    ),
  },
  {
    title: 'Formulários e informações enviadas',
    content: (
      <div className="space-y-3">
        <p>Ao enviar uma proposta pela página Parceiros, você declara que as informações são verdadeiras, que possui autorização para representar a empresa ou marca indicada e que pode ser contatado pelos dados fornecidos.</p>
        <p>O envio não cria contrato, promessa de resposta, exclusividade ou obrigação de aceitar a proposta. Uma parceria somente existirá após acordo expresso entre as partes.</p>
      </div>
    ),
  },
  {
    title: 'Comunidade e Fazenda',
    content: (
      <div className="space-y-3">
        <p>O acesso ao Discord, WhatsApp, servidores de jogos e demais espaços da comunidade pode depender de regras próprias, disponibilidade técnica, moderação e requisitos adicionais.</p>
        <p>A participação no servidor da Fazenda Nova Aliança é reservada a maiores de 18 anos que atendam aos requisitos informados, conheçam as regras e recebam a liberação da administração. A participação pode ser suspensa em caso de descumprimento das regras da comunidade.</p>
      </div>
    ),
  },
  {
    title: 'Serviços e conteúdos de terceiros',
    content: (
      <p>
        Vídeos, transmissões, redes sociais, convites, grupos, pagamentos e outros recursos podem ser fornecidos por YouTube, Twitch, Kick, TikTok, Instagram, Discord, WhatsApp e demais terceiros. Cada serviço possui termos, políticas, disponibilidade e práticas próprias. O GalindoGamerBR não controla esses ambientes e não responde por alterações, bloqueios ou indisponibilidades causadas por eles.
      </p>
    ),
  },
  {
    title: 'Informações dinâmicas e disponibilidade',
    content: (
      <div className="space-y-3">
        <p>Programações, status de live, vídeos, números da comunidade, disponibilidade do servidor, listas de mods e demais dados dinâmicos podem sofrer atrasos, mudanças ou interrupções. A programação divulgada é uma previsão e pode ser alterada por compromissos pessoais, trabalho, manutenção ou fatores externos.</p>
        <p>O portal é fornecido como está e poderá ser atualizado, suspenso ou descontinuado. Buscamos manter as informações corretas e o serviço disponível, mas não garantimos funcionamento contínuo nem ausência total de erros.</p>
      </div>
    ),
  },
  {
    title: 'Área administrativa',
    content: (
      <p>
        O painel disponível em <code className="rounded bg-bg px-1.5 py-0.5 text-white">/admin</code> é de uso exclusivo das pessoas autorizadas pela administração do canal. Não se trata de uma área de cadastro público. Credenciais, códigos de acesso e sessões não devem ser compartilhados.
      </p>
    ),
  },
  {
    title: 'Alterações, legislação e contato',
    content: (
      <div className="space-y-3">
        <p>Estes termos poderão ser atualizados para refletir mudanças no portal, na comunidade ou na legislação. A versão vigente será publicada nesta página com a respectiva data de atualização.</p>
        <p>Estes termos são regidos pela legislação brasileira. Dúvidas podem ser enviadas para <a href="mailto:contato@galindogamerbr.com.br" className="font-semibold text-gold hover:underline">contato@galindogamerbr.com.br</a>.</p>
      </div>
    ),
  },
]

export function Termos() {
  return (
    <LegalDocument
      eyebrow="Regras do portal"
      title="TERMOS DE USO"
      introduction="Conheça as condições para utilizar o portal, acessar conteúdos e interagir com os espaços ligados ao GalindoGamerBR."
      updatedAt="25 de agosto de 2026"
      sections={SECTIONS}
    />
  )
}
