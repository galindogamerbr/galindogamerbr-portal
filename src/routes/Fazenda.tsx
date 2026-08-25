import { useEffect, useId, useState } from 'react'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { SectionHead } from '../components/ui/SectionHead'
import { Reveal } from '../components/ui/Reveal'
import { LinkButton, NavButton } from '../components/ui/Button'
import { FarmStatusCard } from '../components/shared/FarmStatusCard'
import { VipSteps } from '../components/shared/VipSteps'
import { Modal } from '../components/ui/Modal'
import { VideoEmbed } from '../components/shared/VideoEmbed'
import { getFarmVideos } from '../lib/api/farm'

const FARM_RULES_VIDEO_ID = 'TcBrAo_A1Lc'

// Lista de mods do servidor dedicado, a mesma exibida no card de status que
// o bot Guaxinim Comunista posta no Discord — pública, sem auth.
const SERVER_MODS_LIST_URL = 'http://galindoverso.gamesservers.io:9017/mods.html'

const CONTRIBUTE_ITEMS = [
  { icon: '🚜', title: 'Jogue e participe', text: 'Entre no servidor e ajude no plantio, na produção e na expansão da fazenda durante as lives.' },
  { icon: '💬', title: 'Dê ideias nas lives', text: 'Sugestões de compra, construção e próximos passos ajudam a escrever a história da fazenda.' },
  { icon: '🛠️', title: 'Ajude a manter tudo no ar', text: 'Ser VIP contribui direto com os custos do servidor dedicado e dos projetos do canal.' },
  { icon: '📢', title: 'Divulgue o canal', text: 'Compartilhe clipes e momentos marcantes da fazenda nas redes sociais.' },
  { icon: '🤝', title: 'Acolha quem chegou agora', text: 'Receba bem os novos membros e ajude a explicar como tudo funciona por aqui.' },
  { icon: '🐛', title: 'Reporte problemas', text: 'Viu um bug, mod quebrado ou algo estranho no servidor? Avise um administrador.' },
] as const

const INTERACT_ITEMS = [
  { icon: '🎮', title: 'Chat do jogo', text: 'Converse e combine tarefas com quem estiver online na fazenda.' },
  { icon: '💻', title: 'Discord', text: 'Canais de texto e voz da comunidade, disponíveis mesmo fora das lives.' },
  { icon: '📱', title: 'WhatsApp', text: 'Grupo geral pra acompanhar avisos e trocar ideia fora do Discord.' },
  { icon: '📺', title: 'Chat da live', text: 'Participe do chat durante as transmissões, muita decisão da fazenda sai dali.' },
] as const

// Card genérico dos grids de "Faça parte" e "Comunidade" — hover sutil
// (zoom no ícone + borda dourada), mesma linguagem usada no resto do site
// (CommunityStatsGrid, HubLink) pra não destoar visualmente.
const INFO_CARD_CLASSNAME = 'group rounded-md border border-line bg-panel2 p-4 transition-colors hover:border-gold/60'

function InfoCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className={INFO_CARD_CLASSNAME}>
      <span className="inline-block w-fit text-2xl transition duration-300 group-hover:scale-110">{icon}</span>
      <h4 className="mt-2 text-sm font-semibold uppercase tracking-wide">{title}</h4>
      <p className="mt-1 text-justify text-xs text-muted">{text}</p>
    </div>
  )
}

const PLAIN_REQUIREMENTS = [
  { icon: '📜', title: 'Leia as regras', text: 'As regras da fazenda ficam fixadas no Discord, dá uma lida antes de entrar.' },
  { icon: '🔞', title: 'Seja maior de 18 anos', text: 'Requisito pra jogar no servidor, sem exceção.' },
] as const

// Página de destino do botão "Participe da Fazenda" no card carro-chefe de
// /conteudos (Farming Simulator 25 — Fazenda Nova Aliança). Reaproveita o
// VipSteps (mesma fonte de /comunidade) pra não duplicar/dessincronizar o
// fluxo de virar VIP.
export function Fazenda() {
  const rulesVideoTitleId = useId()
  const [rulesVideoOpen, setRulesVideoOpen] = useState(false)
  const [rulesVideoId, setRulesVideoId] = useState(FARM_RULES_VIDEO_ID)

  useEffect(() => {
    getFarmVideos().then((videos) => setRulesVideoId(videos.rulesVideoId)).catch(() => {})
  }, [])

  return (
    <>
      <section className="pt-16 pb-4 sm:pt-24 sm:pb-6">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Eyebrow>Farming Simulator 25</Eyebrow>
              <h1 className="text-4xl sm:text-5xl">PARTICIPE DA FAZENDA NOVA ALIANÇA</h1>
              <p className="mt-3 text-justify text-base font-medium text-muted sm:text-lg">
                A fazenda é um projeto coletivo, jogado ao vivo ao lado de parceiros do canal e membros VIP da
                comunidade. Começou pequena e foi crescendo aos poucos, expansão por expansão, decisão por decisão,
                sempre com a comunidade acompanhando e ajudando a escrever cada capítulo dessa história. Não precisa
                ter experiência nenhuma com Farming Simulator, a galera é bem acolhedora e vai te ensinar tudo, desde
                o básico até as manhas de quem já tá na fazenda há tempo. O servidor roda 24/7, então sempre tem
                alguém online plantando, colhendo ou cuidando das máquinas. Aqui você confere como contribuir com o
                projeto, como interagir com outros membros dentro e fora das lives, e como pedir acesso pra jogar com
                a gente sempre que quiser.
              </p>
            </div>
            <FarmStatusCard />
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-16">
        <Reveal>
          <Container>
            <SectionHead eyebrow="Faça parte" title="COMO VOCÊ PODE CONTRIBUIR" />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CONTRIBUTE_ITEMS.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-10 sm:pb-16">
        <Reveal>
          <Container>
            <SectionHead eyebrow="Como participar" title="VENHA PARA A LIDA" />

            <div className="mt-8 rounded-lg border border-gold/40 bg-panel2 bg-[radial-gradient(circle_at_top,rgba(217,177,79,0.08),transparent_60%)] p-6 sm:p-8">
              <p className="text-justify text-muted">
                A lida não para: plantio, colheita, manutenção de máquina e entrega pra fazer o dinheiro da fazenda
                render, tudo isso junto com outros membros da comunidade, dentro e fora das lives. O servidor roda
                24/7, então é só aparecer e colocar a mão na massa sempre que quiser, sozinho ou junto de quem
                estiver online. O requisito é ser VIP do canal. Depois de cumprir os requisitos abaixo, é só entrar
                e trabalhar, contanto que siga as regras.
              </p>

              <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gold">Requisitos</h4>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setRulesVideoOpen(true)}
                  className="group flex flex-col justify-between rounded-md border-2 border-gold bg-panel p-4 text-left shadow-[0_0_30px_-12px_rgba(217,177,79,0.4)] transition-colors hover:border-gold"
                >
                  <div>
                    <span className="inline-block w-fit text-2xl transition duration-300 group-hover:scale-110">🎬</span>
                    <h4 className="mt-2 text-sm font-semibold uppercase tracking-wide">ASSISTA ÀS REGRAS DA FAZENDA</h4>
                    <p className="mt-1 text-justify text-xs text-muted">Veja as regras e orientações para jogar no servidor.</p>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-gold group-hover:underline">Assistir agora →</span>
                </button>

                <a
                  href="#vip"
                  className="group flex flex-col justify-between rounded-md border-2 border-gold bg-panel p-4 shadow-[0_0_30px_-12px_rgba(217,177,79,0.4)] transition-colors hover:border-gold"
                >
                  <div>
                    <span className="inline-block w-fit text-2xl transition duration-300 group-hover:scale-110">🌟</span>
                    <h4 className="mt-2 text-sm font-semibold uppercase tracking-wide">Seja VIP</h4>
                    <p className="mt-1 text-justify text-xs text-muted">O requisito principal pra acessar a fazenda, veja como logo abaixo.</p>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-gold group-hover:underline">Ver como →</span>
                </a>

                {PLAIN_REQUIREMENTS.map((item) => (
                  <InfoCard key={item.title} {...item} />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <NavButton variant="blue" to="/mods">
                  Sincronize seus mods
                </NavButton>
                <LinkButton variant="default" href={SERVER_MODS_LIST_URL} target="_blank" rel="noopener noreferrer">
                  Ver lista de mods do servidor
                </LinkButton>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      <section className="pb-10 sm:pb-16">
        <Reveal>
          <Container>
            <SectionHead eyebrow="Comunidade" title="COMO INTERAGIR COM OUTROS MEMBROS" />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {INTERACT_ITEMS.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      <section id="vip" className="pb-10 sm:pb-16">
        <Reveal>
          <Container>
            <VipSteps variant="full" />
          </Container>
        </Reveal>
      </section>

      <Modal
        open={rulesVideoOpen}
        onClose={() => setRulesVideoOpen(false)}
        titleId={rulesVideoTitleId}
        className="max-w-4xl overflow-hidden p-0"
      >
        <div className="flex items-center justify-between gap-4 p-4 sm:px-6">
          <h2 id={rulesVideoTitleId} className="text-lg sm:text-xl">
            REGRAS DA FAZENDA
          </h2>
          <button
            type="button"
            onClick={() => setRulesVideoOpen(false)}
            className="text-sm font-semibold uppercase text-muted transition hover:text-white"
          >
            Fechar
          </button>
        </div>
        <VideoEmbed videoId={rulesVideoId} title="Regras da Fazenda Nova Aliança do GalindoGamerBR" />
      </Modal>
    </>
  )
}
