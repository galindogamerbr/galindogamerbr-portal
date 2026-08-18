export type Env = {
  DB: D1Database
  // YouTube Data API v3 — troca a checagem de inscritos por scraping (que
  // dependia de parsear número abreviado) por um valor exato e oficial.
  YOUTUBE_API_KEY: string
  // Instagram API with Facebook Login (ver src/instagram.ts) — usados só
  // pra renovar o token via fb_exchange_token; o login inicial acontece no
  // painel admin do site (functions/api/admin/instagram/*.ts), nunca aqui.
  INSTAGRAM_APP_ID: string
  INSTAGRAM_APP_SECRET: string
  // TikTok Login Kit (ver src/tiktok.ts) — usados só pra renovar o token
  // (grant_type=refresh_token); o login inicial acontece no painel admin
  // do site (functions/api/admin/tiktok/*.ts), nunca aqui.
  TIKTOK_CLIENT_KEY: string
  TIKTOK_CLIENT_SECRET: string
}
