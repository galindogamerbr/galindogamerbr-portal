-- As duas configurações de vídeo da Fazenda ficam na mesma linha/tela do
-- admin: apresentação da comunidade e regras para participar do servidor.
ALTER TABLE farm_welcome_video
ADD COLUMN rules_video_id TEXT NOT NULL DEFAULT 'TcBrAo_A1Lc';
