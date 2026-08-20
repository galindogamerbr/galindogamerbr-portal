import { SOCIALS, type SocialPlatform } from '../../data/socials'
import { useCommunityStats } from '../../hooks/useCommunityStats'
import { useLiveStatus } from '../../hooks/useLiveStatus'
import { formatCompactNumber } from '../../lib/formatNumber'
import type { LiveStatus } from '../../lib/api/communityStats'

// Rótulo do indicador de posts/vídeos — só as redes com esse conceito
// (YouTube/TikTok/Instagram, na ordem de SOCIALS) têm entrada aqui.
const POST_LABEL: Partial<Record<SocialPlatform, string>> = {
  youtube: 'vídeos',
  tiktok: 'posts',
  instagram: 'posts',
}

// Grid de cards de seguidores por rede — os números vêm do cache em D1,
// populado de hora em hora pelo worker workers/social-stats-cron (scraping
// keyless, sem API key). Enquanto o cache ainda não tem uma rede (worker
// não rodou ainda, ou aquela rede falhou), o card mostra só o ícone/link,
// sem número — nunca mostra "0" como se fosse um dado real. YouTube,
// Twitch e Kick são exceção: quando ao vivo, mostram também espectadores
// agora (YouTube vem de /api/live via useLiveStatus, já compartilhado com
// LiveBanner; Twitch/Kick vêm de /api/community-stats, cada uma com seu
// próprio fetch ao vivo, cache só como fallback). TikTok não tem API
// oficial pra status "ao vivo" — não mostra espectadores. Discord mostra
// "online agora" no lugar de "assistindo" (não é live/streaming).
// YouTube/TikTok/Instagram mostram também a quantidade de posts/vídeos
// (postCounts, mesma origem dos seguidores — vem de graça na mesma
// chamada de API que já buscava seguidores, ver workers/social-stats-cron).
export function CommunityStatsGrid() {
  const stats = useCommunityStats()
  const youtubeLive = useLiveStatus()
  const byPlatform = new Map(stats?.social.map((s) => [s.platform, s.count]))
  const liveByPlatform: Partial<Record<SocialPlatform, LiveStatus>> = {
    youtube: youtubeLive ? { isLive: youtubeLive.isLive, viewerCount: youtubeLive.viewerCount } : undefined,
    twitch: stats?.twitchLive,
    kick: stats?.kickLive,
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {SOCIALS.map((social) => {
        const count = byPlatform.get(social.platform)
        const live = liveByPlatform[social.platform]
        const showLive = live?.isLive
        const discordOnline = social.platform === 'discord' ? (stats?.discordOnline ?? null) : null
        const postCount = stats?.postCounts?.[social.platform]
        const postLabel = POST_LABEL[social.platform]

        return (
          <a
            key={social.platform}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-lg border border-line bg-panel p-4 text-center transition-colors hover:border-gold/60"
          >
            <img src={`/assets/logos/${social.logo}`} alt="" className="h-8 w-8 rounded object-contain" />
            <span className="text-lg font-semibold">{count !== undefined ? formatCompactNumber(count) : '—'}</span>
            <span className="text-xs uppercase tracking-widest text-muted">{social.name}</span>
            {showLive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: social.color }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: social.color }} />
                {live.viewerCount !== null ? `${formatCompactNumber(live.viewerCount)} assistindo` : 'ao vivo'}
              </span>
            )}
            {discordOnline !== null && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: social.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: social.color }} />
                {formatCompactNumber(discordOnline)} online
              </span>
            )}
            {!showLive && postLabel && postCount !== undefined && (
              <span className="text-[11px] font-semibold text-muted">
                {formatCompactNumber(postCount)} {postLabel}
              </span>
            )}
          </a>
        )
      })}
    </div>
  )
}
