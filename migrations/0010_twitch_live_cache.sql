-- Cache curto (poucos minutos) do status "ao vivo" + espectadores da Twitch
-- — não é limite de cota (helix/streams é público, só precisa de app
-- token), é só pra não repetir a chamada a cada visitante fazendo polling
-- de /api/community-stats ao mesmo tempo. Linha única (id sempre 1).
CREATE TABLE twitch_live_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_live INTEGER NOT NULL,
  viewer_count INTEGER,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);
