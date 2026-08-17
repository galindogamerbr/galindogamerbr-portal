import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { NavButton } from '../components/ui/Button'

const TOPICS = [
  {
    title: 'Boas práticas da comunidade',
    text: 'Como a resenha funciona por aqui: respeito, bom humor e espaço pra todo mundo jogar junto.',
  },
  {
    title: 'Regras da Fazenda Nova Aliança',
    text: 'O que pode e o que não pode dentro do servidor de Farming Simulator — conteúdo a publicar pelo Galindo.',
  },
  {
    title: 'Como pedir ajuda',
    text: 'Onde perguntar, quem procurar no Discord e como participar sem se perder no começo.',
  },
]

// Onboarding de novo membro — vídeo introdutório do Galindo e regras da
// fazenda entram aqui assim que o conteúdo for gravado (Fase 4).
export function ComeceAqui() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Eyebrow>Novo por aqui?</Eyebrow>
        <h1 className="text-4xl sm:text-5xl">COMECE AQUI</h1>
        <p className="mt-3 text-muted">
          Antes de entrar de cabeça na comunidade, um resumo rápido de como tudo funciona por aqui.
        </p>

        <div className="mt-8 flex aspect-video items-center justify-center rounded-lg border border-dashed border-line bg-panel text-center">
          <div className="px-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold">Vídeo de boas-vindas</p>
            <p className="mt-2 text-sm text-muted">Em breve: vídeo do Galindo apresentando a comunidade.</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="rounded-lg border border-line bg-panel p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{topic.title}</h3>
              <p className="mt-2 text-sm text-muted">{topic.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <NavButton variant="blue" to="/comunidade">
            Ver hub da comunidade →
          </NavButton>
          <NavButton variant="default" to="/conteudos">
            Conhecer os conteúdos →
          </NavButton>
        </div>
      </Container>
    </section>
  )
}
