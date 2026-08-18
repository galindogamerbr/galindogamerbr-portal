-- Token de acesso da "Instagram API with Facebook Login" — linha única
-- (id sempre 1). access_token é o Page Access Token (de longa duração, via
-- fb_exchange_token) da Página do Facebook vinculada ao Instagram;
-- ig_user_id é o Instagram Business Account ID dessa página. Renovado
-- periodicamente pelo worker workers/social-stats-cron, sem precisar de
-- novo login manual (token dura ~60 dias, renovação estende por mais 60).
CREATE TABLE instagram_token (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  access_token TEXT NOT NULL,
  ig_user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
