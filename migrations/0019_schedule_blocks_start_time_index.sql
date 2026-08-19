-- O índice existente (idx_schedule_blocks_version) não cobre start_time, que
-- é a última coluna do ORDER BY em getBlocks (lib/d1-schedule.ts) — sem isso
-- o SQLite ainda precisa de um passo de sort depois de usar o índice pras
-- duas primeiras colunas. Baixo tráfego agora que a leitura pública migrou
-- pro KV (só roda no publish, admin), mas resolve por completo.
DROP INDEX idx_schedule_blocks_version;
CREATE INDEX idx_schedule_blocks_version ON schedule_blocks(version_id, cycle_index, day_of_week, start_time);
