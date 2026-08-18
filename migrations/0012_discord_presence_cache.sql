-- Cache do "quantos online agora" no Discord — mesmo padrão do
-- twitch_live_cache/kick_live_cache: sempre busca fresco primeiro (endpoint
-- público, sem risco de cota), cache só como fallback se a chamada falhar.
CREATE TABLE discord_presence_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  online_count INTEGER NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);
