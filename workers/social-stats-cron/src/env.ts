export type Env = {
  DB: D1Database
  // YouTube Data API v3 — troca a checagem de inscritos por scraping (que
  // dependia de parsear número abreviado) por um valor exato e oficial.
  YOUTUBE_API_KEY: string
  // TikTok Login Kit (ver src/tiktok.ts) — usados só pra renovar o token
  // (grant_type=refresh_token); o login inicial acontece no painel admin
  // do site (functions/api/admin/tiktok/*.ts), nunca aqui.
  TIKTOK_CLIENT_KEY: string
  TIKTOK_CLIENT_SECRET: string
  // Token de usuário do Instagram (Instagram API with Instagram Login),
  // gerado manualmente no App Dashboard da Meta e colado direto aqui como
  // secret do Worker — sem painel admin no site pra isso (ver
  // src/instagram.ts). Só usado como bootstrap na primeira rodada sem
  // token em D1; depois disso o worker renova e persiste sozinho.
  INSTAGRAM_ACCESS_TOKEN: string
}
