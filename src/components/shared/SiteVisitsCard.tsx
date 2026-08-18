import { useCommunityStats } from '../../hooks/useCommunityStats'
import { formatCompactNumber } from '../../lib/formatNumber'

// Nunca chamar isso de "online agora" — o dado vem do Cloudflare Web
// Analytics com alguns minutos de atraso, não é uma contagem de presença
// em tempo real (ver functions/lib/cfAnalytics.ts).
export function SiteVisitsCard() {
  const stats = useCommunityStats()
  const visits = stats?.siteVisits.visitsToday

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-line bg-panel p-6 text-center">
      <span className="text-3xl font-semibold text-gold">{visits != null ? formatCompactNumber(visits) : '—'}</span>
      <span className="text-xs uppercase tracking-widest text-muted">Visitas ao site hoje</span>
    </div>
  )
}
