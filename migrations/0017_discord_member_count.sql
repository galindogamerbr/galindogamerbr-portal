-- Discord sai do worker (workers/social-stats-cron) e passa a ser buscado
-- ao vivo em functions/api/community-stats.ts — o endpoint público de
-- convite já devolve total de membros e online numa chamada só, sem risco
-- de cota. Adiciona member_count no mesmo cache que já guardava online_count
-- (mesmo padrão de fallback: busca fresco primeiro, cache só se falhar).
ALTER TABLE discord_presence_cache ADD COLUMN member_count INTEGER;
