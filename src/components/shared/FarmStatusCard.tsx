import type { ReactNode } from 'react'
import { useFarmStatus } from '../../hooks/useFarmStatus'
import { formatUptimeText } from '../../lib/formatDuration'
import type { FarmPlayer } from '../../lib/api/farmStatus'

function isGalindo(name: string): boolean {
  return name.toLowerCase().includes('galindo')
}

// Nome do Galindo destacado nas cores do site (em vez de texto simples como
// os demais jogadores) — "gamer" sempre em dourado (a cor "amarela" da
// marca), o resto em branco. Um único span (sem quebra entre partes) evita
// qualquer desalinhamento vertical entre as cores.
function renderPlayerName(name: string): ReactNode {
  if (!isGalindo(name)) return name
  const match = name.match(/gamer/i)
  if (!match || match.index === undefined) return <span className="text-white">{name}</span>
  const before = name.slice(0, match.index)
  const gamer = name.slice(match.index, match.index + match[0].length)
  const after = name.slice(match.index + match[0].length)
  return (
    <span className="text-white">
      {before}
      <span className="text-gold">{gamer}</span>
      {after}
    </span>
  )
}

// Galindo sempre primeiro na lista de jogadores online, quando presente.
function sortPlayers(players: FarmPlayer[]): FarmPlayer[] {
  const galindo = players.filter((player) => isGalindo(player.name))
  const rest = players.filter((player) => !isGalindo(player.name))
  return [...galindo, ...rest]
}

// Preenche a coluna inteira (em vez de w-fit) — evita o vão à direita que
// sobrava quando o chip só ocupava o espaço do próprio texto.
function PlayerChip({ player }: { player: FarmPlayer }) {
  return (
    <span
      className={`flex items-center justify-center truncate rounded-full border px-2 py-1 text-[11px] font-semibold ${
        isGalindo(player.name) ? 'border-gold bg-panel' : 'border-line bg-panel2'
      }`}
    >
      {renderPlayerName(player.name)}
    </span>
  )
}

// Nunca mostra o nome do servidor aqui (server_name nem chega do backend,
// ver functions/api/farm-status.ts) — só o status público do jogo.
export function FarmStatusCard() {
  const data = useFarmStatus()

  // Sem placeholder de loading de propósito — o card simplesmente não
  // existe até ter dado de verdade (nem enquanto carrega, nem se o fetch
  // falhar: ok:false vem do backend em functions/api/farm-status.ts pra
  // timeout/function key inválida/etc.). Quando o fetch resolve com
  // sucesso, o card monta direto com a animação .pop-in (ver global.css).
  if (!data?.ok || !data.status) return null

  const status = data.status
  const isOnline = status.gameStatus === 'online' && status.healthy

  const players = sortPlayers(status.players.list)

  return (
    <div className="pop-in flex h-full flex-col justify-center rounded-lg border border-line bg-panel bg-[radial-gradient(circle_at_top,rgba(217,177,79,0.08),transparent_60%)] p-8 sm:p-10">
      <div className="flex flex-col items-start gap-2">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
            isOnline ? 'bg-green text-white' : 'bg-panel2 text-muted'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isOnline ? 'animate-pulse bg-white' : 'bg-muted'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <span className="text-lg font-semibold uppercase tracking-widest text-gold sm:text-xl">
          Servidor da fazenda
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-lg font-semibold text-gold">
            {status.players.count}/{status.players.max}
          </span>
          <span className="text-xs uppercase tracking-widest text-muted">Jogadores</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-lg font-semibold text-gold">{status.uptime ? formatUptimeText(status.uptime) : '—'}</span>
          <span className="text-xs uppercase tracking-widest text-muted">No ar há</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-base font-semibold" title={status.mapName}>
            {status.mapName || '—'}
          </span>
          <span className="text-xs uppercase tracking-widest text-muted">Mapa</span>
        </div>
      </div>

      {/* Linhas finas cruzando em ângulos diferentes (referência: banner
          de linhas aleatórias que o Pedro mandou) — várias camadas de
          repeating-linear-gradient em ângulos/períodos distintos, bem
          discretas (opacidade baixa), pra não competir com os chips. */}
      {!!players.length && (
        <div
          className="mt-8 overflow-hidden rounded-lg border border-line p-4"
          style={{
            // Cada linha ganha um pequeno halo (stops suaves antes/depois do
            // pico) em vez de uma borda dura de 1px — efeito de brilho no
            // próprio raio, não uma sombra em volta da caixa.
            backgroundImage: [
              'repeating-linear-gradient(27deg, transparent 0px, transparent 82.5px, rgba(217,177,79,0.015) 83.3px, rgba(217,177,79,0.06) 84px, rgba(217,177,79,0.015) 84.7px, transparent 85.5px)',
              'repeating-linear-gradient(-52deg, transparent 0px, transparent 101.5px, rgba(255,255,255,0.01) 102.3px, rgba(255,255,255,0.04) 103px, rgba(255,255,255,0.01) 103.7px, transparent 104.5px)',
              'repeating-linear-gradient(-8deg, transparent 0px, transparent 119.5px, rgba(217,177,79,0.01) 120.3px, rgba(217,177,79,0.045) 121px, rgba(217,177,79,0.01) 121.7px, transparent 122.5px)',
            ].join(', '),
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-white/50">Jogando agora</span>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {players.map((player) => (
              <PlayerChip key={player.name} player={player} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
