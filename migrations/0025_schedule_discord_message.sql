-- Controla a última programação publicada pelo webhook para que uma nova
-- publicação substitua a mensagem anterior sem gerar duplicatas.
CREATE TABLE schedule_discord_message (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  message_id TEXT NOT NULL,
  schedule_signature TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
