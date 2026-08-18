-- Foto de perfil da conta conectada, pra exibir junto do @ no painel
-- admin. Nullable pelo mesmo motivo do username (0014): populado só a
-- partir da próxima reconexão.
ALTER TABLE tiktok_token ADD COLUMN avatar_url TEXT;
ALTER TABLE instagram_token ADD COLUMN avatar_url TEXT;
