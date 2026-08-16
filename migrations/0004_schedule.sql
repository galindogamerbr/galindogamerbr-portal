-- Evita fixar "Semana A/B" como enum: cycle_length define quantas semanas
-- existem no ciclo (hoje 2, mas nada impede um ciclo de 1, 3, 4...).
-- day_of_week segue ISO 8601: 1=segunda ... 7=domingo.
CREATE TABLE schedule_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  cycle_length INTEGER NOT NULL DEFAULT 2,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT
);

CREATE TABLE schedule_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version_id INTEGER NOT NULL REFERENCES schedule_versions(id) ON DELETE CASCADE,
  cycle_index INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  note TEXT
);
CREATE INDEX idx_schedule_blocks_version ON schedule_blocks(version_id, cycle_index, day_of_week);
