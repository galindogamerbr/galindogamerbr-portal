-- Vídeo de boas-vindas exibido na página da Fazenda, editável pelo admin
-- sem precisar de novo deploy. Guardamos só o ID do YouTube, normalizado
-- pela API administrativa, para montar o embed de forma segura.
CREATE TABLE farm_welcome_video (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  video_id TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO farm_welcome_video (id, video_id) VALUES (1, 'TcBrAo_A1Lc');
