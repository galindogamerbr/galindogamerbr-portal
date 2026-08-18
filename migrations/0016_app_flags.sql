-- Feature flags simples liga/desliga (ex: mostrar o card do Instagram no
-- painel admin) — Cloudflare Pages não suporta o binding do Flagship
-- (Workers-only por enquanto), então guardamos aqui e trocamos por um
-- endpoint autenticado no painel, sem precisar de deploy pra alternar.
CREATE TABLE app_flags (
  key TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
