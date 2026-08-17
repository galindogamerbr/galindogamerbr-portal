-- Cache do último vídeo conhecido da playlist do carro-chefe (Fazenda Nova
-- Aliança) — /api/flagship busca fresco a cada request, mas se essa busca
-- falhar (feed do YouTube fora do ar, etc.) cai pra esse último valor salvo
-- em vez de mostrar uma imagem estática genérica. Linha única (id sempre 1).
CREATE TABLE flagship_video_cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
