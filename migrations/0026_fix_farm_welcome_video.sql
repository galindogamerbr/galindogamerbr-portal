-- O ID originalmente usado como boas-vindas é, na verdade, o vídeo de
-- regras da Fazenda. Corrige apenas instalações que ainda conservam esse
-- valor antigo, sem sobrescrever uma escolha já feita pelo administrador.
UPDATE farm_welcome_video
SET video_id = 'tfoJW_5GJ3A', updated_at = datetime('now')
WHERE id = 1 AND video_id = 'TcBrAo_A1Lc';
