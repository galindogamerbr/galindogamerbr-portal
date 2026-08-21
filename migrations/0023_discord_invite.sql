-- URL de convite do Discord, editável pelo admin (/admin/discord) sem precisar
-- de deploy quando o convite expira/é revogado. Lida por functions/discord.ts
-- (redirect 302 em /discord) e é o destino usado pelos botões "Entrar no
-- Discord" do site em vez do link cru. Seed com o convite atual (mesmo valor
-- que já estava hardcoded em src/data/socials.ts e outros lugares) pra
-- funcionar direto, sem depender do admin configurar antes do primeiro deploy.

CREATE TABLE discord_invite (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  url TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO discord_invite (id, url) VALUES (1, 'https://discord.com/invite/JggtZ7qGY3');
