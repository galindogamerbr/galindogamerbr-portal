import { LegalDocument, type LegalSection } from '../components/shared/LegalDocument'

const EMAIL_LINK = (
  <a href="mailto:contato@galindogamerbr.com.br" className="font-semibold text-gold hover:underline">
    contato@galindogamerbr.com.br
  </a>
)

const SECTIONS: LegalSection[] = [
  {
    title: 'Responsável e canal de contato',
    content: (
      <p>
        O GalindoGamerBR é responsável pelas decisões sobre o tratamento de dados realizado por este portal. Solicitações, dúvidas e comunicações sobre privacidade podem ser enviadas para {EMAIL_LINK}.
      </p>
    ),
  },
  {
    title: 'Dados tratados',
    content: (
      <div className="space-y-4">
        <p>A navegação pública não exige cadastro. Conforme a forma de uso do portal, podem ser tratados:</p>
        <ul className="space-y-3">
          <li><strong className="text-white">Dados técnicos e de segurança:</strong> endereço IP, data e hora, rota acessada, informações básicas do navegador e eventos usados para proteção contra abuso, estabilidade e diagnóstico.</li>
          <li><strong className="text-white">Métricas agregadas:</strong> visualizações de páginas, origem aproximada e características gerais de acesso por meio do Cloudflare Web Analytics.</li>
          <li><strong className="text-white">Contato comercial:</strong> empresa ou marca, nome, email, telefone opcional, tipo de parceria e mensagem enviados voluntariamente no formulário de Parceiros.</li>
          <li><strong className="text-white">Administração:</strong> email autorizado, tentativas de autenticação, IP, agente do navegador, sessão e registros técnicos relacionados ao acesso restrito.</li>
        </ul>
        <p>As métricas públicas exibidas na página Comunidade são totais agregados obtidos de fontes públicas ou APIs oficiais. O portal não recebe a lista de seguidores nem os dados pessoais de cada integrante dessas redes.</p>
      </div>
    ),
  },
  {
    title: 'Finalidades e bases legais',
    content: (
      <div className="space-y-3">
        <p>Os dados são tratados para operar e proteger o portal, responder propostas enviadas pelo usuário, autenticar a equipe administrativa, produzir estatísticas agregadas e cumprir obrigações legais.</p>
        <p>Conforme o caso, o tratamento se apoia na execução de procedimentos solicitados pelo titular, no legítimo interesse de manter um portal seguro e funcional e no cumprimento de obrigação legal ou regulatória. Quando o consentimento for necessário, ele será solicitado de forma específica.</p>
        <p>O GalindoGamerBR não vende dados pessoais nem utiliza as informações recebidas pelo formulário para criar listas de publicidade.</p>
      </div>
    ),
  },
  {
    title: 'Cookies e armazenamento no navegador',
    content: (
      <div className="space-y-3">
        <p>O acesso público não utiliza cookies de publicidade ou rastreamento comportamental. O Cloudflare Web Analytics é usado em formato voltado à privacidade e seu marcador não lê cookies nem outros armazenamentos do navegador.</p>
        <p>O portal utiliza armazenamento local para guardar temporariamente dados públicos já consultados, como vídeos, status da Fazenda e números da comunidade. Também pode usar armazenamento de sessão para recuperação técnica após uma atualização do site. Esses registros não criam um perfil pessoal.</p>
        <p>Um cookie técnico, seguro e inacessível a scripts é criado somente após o login administrativo. A sessão expira em até sete dias ou pode ser encerrada antes pelo usuário.</p>
      </div>
    ),
  },
  {
    title: 'Serviços externos e compartilhamento',
    content: (
      <div className="space-y-3">
        <p>Dados são compartilhados apenas quando necessário para a operação. A Cloudflare fornece hospedagem, banco de dados, proteção e métricas; a Resend realiza o envio de emails administrativos e de propostas comerciais.</p>
        <p>Ao escolher reproduzir um vídeo, o conteúdo é carregado pelo YouTube, que poderá tratar dados conforme sua própria política. Links para YouTube, Twitch, Discord, TikTok, Kick, Instagram, WhatsApp e outros serviços levam a ambientes controlados por essas empresas.</p>
        <p>Alguns fornecedores podem processar informações fora do Brasil. Nesses casos, o tratamento fica sujeito às salvaguardas contratuais e às regras de proteção de dados aplicáveis ao serviço.</p>
      </div>
    ),
  },
  {
    title: 'Conservação e segurança',
    content: (
      <div className="space-y-3">
        <p>Os dados são mantidos somente pelo tempo necessário para cumprir as finalidades descritas, atender obrigações legais, prevenir fraude e exercer direitos. Mensagens comerciais permanecem nas caixas de email pelo período necessário ao relacionamento e podem ser eliminadas mediante solicitação quando não houver motivo legítimo para conservá-las.</p>
        <p>Registros de autenticação e segurança possuem acesso restrito. São adotadas medidas técnicas compatíveis com o serviço, incluindo conexão criptografada, cookies seguros, autenticação por código temporário e limitação de tentativas. Nenhum ambiente conectado à internet, porém, pode oferecer segurança absoluta.</p>
      </div>
    ),
  },
  {
    title: 'Direitos do titular',
    content: (
      <div className="space-y-3">
        <p>Nos termos da LGPD, você pode solicitar confirmação e acesso aos dados, correção, anonimização, bloqueio ou eliminação de dados inadequados, portabilidade quando aplicável, informação sobre compartilhamentos, revisão de decisões automatizadas e revogação do consentimento.</p>
        <p>Também é possível se opor a tratamentos realizados em desconformidade com a lei ou pedir a eliminação de dados tratados com consentimento, observadas as hipóteses legais de conservação. A identidade do solicitante poderá ser confirmada antes do atendimento para proteger os próprios dados.</p>
        <p>Envie sua solicitação para {EMAIL_LINK}. Você também pode apresentar uma petição à Autoridade Nacional de Proteção de Dados.</p>
      </div>
    ),
  },
  {
    title: 'Alterações desta política',
    content: (
      <p>
        Esta política poderá ser atualizada para acompanhar mudanças no portal, nos fornecedores ou na legislação. A versão vigente sempre ficará disponível nesta página, acompanhada da data de atualização.
      </p>
    ),
  },
]

export function Privacidade() {
  return (
    <LegalDocument
      eyebrow="Privacidade e transparência"
      title="POLÍTICA DE PRIVACIDADE"
      introduction="Saiba quais informações fazem parte da operação do portal, por que elas são tratadas e como você pode exercer seus direitos."
      updatedAt="25 de agosto de 2026"
      sections={SECTIONS}
    />
  )
}
