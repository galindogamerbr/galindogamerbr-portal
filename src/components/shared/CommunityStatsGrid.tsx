import { SOCIALS, type SocialPlatform } from '../../data/socials'
import { useCommunityStats } from '../../hooks/useCommunityStats'
import { formatCompactNumber } from '../../lib/formatNumber'
import type { LiveStatus } from '../../lib/api/communityStats'

// Grid de cards de seguidores por rede — os números vêm do cache em D1,
// populado de hora em hora pelo worker workers/social-stats-cron (scraping
// keyless, sem API key). Enquanto o cache ainda não tem uma rede (worker
// não rodou ainda, ou aquela rede falhou), o card mostra só o ícone/link,
// sem número — nunca mostra "0" como se fosse um dado real. Twitch e Kick
// são exceção: quando ao vivo, mostram também espectadores agora (cada uma
// com seu próprio fetch ao vivo, cache só como fallback — ver
// functions/api/community-stats.ts).
export function CommunityStatsGrid() {
  const stats = useCommunityStats()
  const byPlatform = new Map(stats?.social.map((s) => [s.platform, s.count]))
  const liveByPlatform: Partial<Record<SocialPlatform, LiveStatus>> = {
    twitch: stats?.twitchLive,
    kick: stats?.kickLive,
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {SOCIALS.map((social) => {
        const count = byPlatform.get(social.platform)
        const live = liveByPlatform[social.platform]
        const showLive = live?.isLive

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
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: social.color }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: social.color }} />
                {live.viewerCount !== null ? `${formatCompactNumber(live.viewerCount)} assistindo` : 'ao vivo'}
              </span>
            )}
          </a>
        )
      })}
    </div>
  )
}
