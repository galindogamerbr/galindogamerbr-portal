-- Reverte 0020: status "ao vivo" do TikTok via job externo (GitHub
-- Actions + webhook) foi removido — TikTok não tem API oficial confiável
-- pra isso, e a infra extra (cron worker, endpoint, tabela) não valia a
-- complexidade só pra esse dado. Segue só com seguidores/posts (worker
-- workers/social-stats-cron), como as outras redes sem API de live.
DROP TABLE IF EXISTS tiktok_live_cache;
