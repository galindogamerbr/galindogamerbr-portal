-- Quantidade de posts/vídeos por rede (YouTube, TikTok, Instagram) — mesmo
-- padrão do social_stats_cache (seguidores), populado pelo worker
-- workers/social-stats-cron a partir do mesmo campo já retornado nas
-- chamadas de seguidores (videoCount/video_count/media_count), sem custo
-- extra de API. Mostrado como "N posts/vídeos recentes" no card de cada
-- rede em CommunityStatsGrid.
CREATE TABLE post_counts_cache (
  platform TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);
