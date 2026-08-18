-- Guarda o @ da conta conectada em cada plataforma, pra exibir no painel
-- admin qual conta está vinculada (antes só tínhamos os tokens, sem
-- identificar a conta pro usuário). Nullable pra não quebrar conexões já
-- existentes — populado a partir da próxima reconexão.
ALTER TABLE tiktok_token ADD COLUMN username TEXT;
ALTER TABLE instagram_token ADD COLUMN username TEXT;
