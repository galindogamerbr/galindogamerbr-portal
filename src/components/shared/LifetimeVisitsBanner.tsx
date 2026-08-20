import { useCommunityStats } from '../../hooks/useCommunityStats'
import { formatNumber } from '../../lib/formatNumber'
import { Container } from '../ui/Container'

// Faixa fina logo abaixo do Hero — total de visitas desde o início do site
// (ver workers/social-stats-cron/src/siteVisitsLifetime.ts e
// functions/api/community-stats.ts, resolveLifetimeVisits). Sem dado ainda
// (primeira visita antes do worker rodar, ou falha) — não mostra nada, nunca
// um "0" ou um traço genérico no lugar de um marco de verdade.
export function LifetimeVisitsBanner() {
  const stats = useCommunityStats()
  const visits = stats?.siteVisits.lifetimeVisits

  if (!visits) return null

  return (
    <div className="border-b border-line bg-panel py-3">
      <Container className="flex items-center justify-center gap-2 text-center">
        <span className="text-lg">🎉</span>
        <p className="text-sm text-muted">
          <span className="font-semibold text-gold">{formatNumber(visits)}</span> visitas desde o início
        </p>
      </Container>
    </div>
  )
}
