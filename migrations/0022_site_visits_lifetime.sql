-- Total acumulado de visitas do site desde o início (ver
-- workers/social-stats-cron/src/siteVisitsLifetime.ts). Cloudflare Web
-- Analytics não guarda um total corrido pra gente ler, e a GraphQL API
-- limita cada consulta a ~90 dias — então o worker soma isso ele mesmo (uma
-- vez por semana, pra não bater na Analytics API à toa) e persiste o total
-- aqui. last_counted_at é o timestamp exato (ISO, não só a data) até onde já
-- foi somado — usado como cursor pra próxima rodada continuar sem gap nem
-- sobreposição.

CREATE TABLE site_visits_lifetime (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_visits INTEGER NOT NULL DEFAULT 0,
  last_counted_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
