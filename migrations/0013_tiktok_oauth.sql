-- Token de acesso do TikTok Login Kit (user.info.stats) — linha única
-- (id sempre 1). access_token dura 24h, refresh_token dura 365 dias e é
-- rotacionado a cada renovação (a TikTok pode devolver um novo a cada
-- troca) — o worker renova a cada rodada (de hora em hora), sempre salva
-- o par mais recente. Sem precisar de novo login manual depois de
-- conectado uma vez.
CREATE TABLE tiktok_token (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
