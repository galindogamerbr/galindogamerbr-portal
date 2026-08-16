-- Linha única (singleton) com o estado atual da live — ver plano, Fase 2.
CREATE TABLE live_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  video_id TEXT,
  title TEXT,
  thumbnail_url TEXT,
  is_live INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO live_state (id, is_live) VALUES (1, 0);
