-- Cache curto (poucos minutos) do status "ao vivo" + espectadores da Kick —
-- mesmo padrão do twitch_live_cache (0010). Não é limite de cota (endpoint
-- não-oficial, mas sem auth), é só pra não repetir a chamada a cada
-- visitante fazendo polling de /api/community-stats ao mesmo tempo.
CREATE TABLE kick_live_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_live INTEGER NOT NULL,
  viewer_count INTEGER,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);
