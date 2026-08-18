import { SOCIALS } from '../../data/socials'
import { useCommunityStats } from '../../hooks/useCommunityStats'
import { formatCompactNumber } from '../../lib/formatNumber'

// Grid de cards de seguidores por rede — os números vêm do cache em D1,
// populado de hora em hora pelo worker workers/social-stats-cron (scraping
// keyless, sem API key). Enquanto o cache ainda não tem uma rede (worker
// não rodou ainda, ou aquela rede falhou), o card mostra só o ícone/link,
// sem número — nunca mostra "0" como se fosse um dado real. A Twitch é a
// exceção: quando ao vivo, mostra também espectadores agora (cache curto e
// próprio, não vem do worker — ver functions/api/community-stats.ts).
export function CommunityStatsGrid() {
  const stats = useCommunityStats()
  const byPlatform = new Map(stats?.social.map((s) => [s.platform, s.count]))
  const twitchLive = stats?.twitchLive

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {SOCIALS.map((social) => {
        const count = byPlatform.get(social.platform)
        const showLive = social.platform === 'twitch' && twitchLive?.isLive

        return (
          <a
            key={social.platform}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-lg border border-line bg-panel p-4 text-center transition-colors hover:border-gold/60"
          >
            <img src={`/assets/icons/${social.icon}.svg`} alt="" className="h-6 w-6 opacity-80 group-hover:opacity-100" />
            <span className="text-lg font-semibold">{count !== undefined ? formatCompactNumber(count) : '—'}</span>
            <span className="text-xs uppercase tracking-widest text-muted">{social.name}</span>
            {showLive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
                {twitchLive.viewerCount !== null ? `${formatCompactNumber(twitchLive.viewerCount)} assistindo` : 'ao vivo'}
              </span>
            )}
          </a>
        )
      })}
    </div>
  )
}
