-- Cache de métricas de comunidade (seguidores por rede, espectadores da
-- live, visitas do site). Tudo é coletado sem API key/OAuth (scraping ou
-- endpoints públicos não-autenticados) e escrito por processos que rodam
-- fora do caminho de requisição do visitante — ver functions/api/live.ts
-- (espectadores) e workers/social-stats-cron (seguidores, de hora em hora).

CREATE TABLE social_stats_cache (
  platform TEXT PRIMARY KEY CHECK (platform IN ('youtube', 'discord', 'twitch', 'instagram', 'tiktok', 'kick')),
  count INTEGER NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Linha única (id sempre 1) — espectadores simultâneos da live atual.
-- Curto prazo de validade (ver getLiveViewerCache): não é limite de cota,
-- é só pra não repetir o scraping da página do vídeo a cada visitante.
CREATE TABLE live_viewer_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  video_id TEXT NOT NULL,
  viewer_count INTEGER NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Linha única (id sempre 1) — resultado cacheado da GraphQL Analytics API
-- da Cloudflare (visitas do site via Web Analytics).
CREATE TABLE site_visits_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  visits_today INTEGER NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);
