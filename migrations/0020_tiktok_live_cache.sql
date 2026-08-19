-- Status "ao vivo" + espectadores do TikTok — diferente de
-- twitch_live_cache/kick_live_cache (que buscam fresco a cada request), o
-- TikTok não tem API oficial pra isso (ver scripts/tiktok-live-poll/README.md):
-- quem escreve aqui é um job externo (GitHub Actions, roda o
-- tiktok-live-connector de verdade), via /api/webhooks/tiktok-live. Este
-- endpoint só lê. room_hash é o room_id do TikTok da live atual — muda a
-- cada nova transmissão, dá pra detectar troca de live sem comparar título.
CREATE TABLE tiktok_live_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_live INTEGER NOT NULL,
  viewer_count INTEGER,
  room_hash TEXT,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);
