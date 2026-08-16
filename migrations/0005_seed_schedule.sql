-- Migra a programação estática atual (src/data/schedule.ts) pro D1, como
-- primeira versão já publicada — a Fase 3 troca a leitura estática pela API.
INSERT INTO schedule_versions (id, label, cycle_length, is_published) VALUES (1, 'Semana A / Semana B', 2, 1);

-- Semana A (cycle_index 0)
INSERT INTO schedule_blocks (version_id, cycle_index, day_of_week, start_time, end_time) VALUES
  (1, 0, 1, '08:45', '11:15'), (1, 0, 1, '14:00', '20:00'), -- SEG
  (1, 0, 2, '19:00', '22:00'),                              -- TER
  (1, 0, 3, '08:45', '11:15'), (1, 0, 3, '14:00', '20:00'), -- QUA
  (1, 0, 4, '19:00', '22:00'),                              -- QUI
  (1, 0, 5, '08:00', '11:15'), (1, 0, 5, '13:00', '18:00'); -- SEX
  -- SÁB(6) e DOM(7): sem blocos = offline

-- Semana B (cycle_index 1)
INSERT INTO schedule_blocks (version_id, cycle_index, day_of_week, start_time, end_time) VALUES
  (1, 1, 1, '19:00', '22:00'),                              -- SEG
  (1, 1, 2, '08:45', '11:15'), (1, 1, 2, '14:00', '20:00'), -- TER
  (1, 1, 3, '19:00', '22:00'),                              -- QUA
  (1, 1, 4, '08:45', '11:15'), (1, 1, 4, '15:00', '20:00'), -- QUI
  (1, 1, 6, '13:00', '18:00');                              -- SÁB
  -- SEX(5) e DOM(7): sem blocos = offline
