export type Env = {
  DB: D1Database
  RESEND_API_KEY: string
  SESSION_SECRET: string
  OTP_PEPPER: string
  SESSION_COOKIE_NAME: string
  OTP_EXPIRY_MINUTES: string
  ENVIRONMENT: string
  // Automação de live (ver functions/lib/youtube.ts) — detecção de live e
  // últimos uploads seguem keyless (scraping/feed público), mas o número de
  // espectadores simultâneos usa a YouTube Data API v3 (mais confiável que
  // parsear a página do vídeo).
  YOUTUBE_CHANNEL_ID: string
  YOUTUBE_API_KEY: string
  // Métricas de comunidade (ver functions/api/community-stats.ts). Seguidores
  // por rede vêm de scraping/endpoints públicos, coletados por um worker
  // separado (workers/social-stats-cron) — nenhum API key/OAuth aqui.
  DISCORD_INVITE_CODE: string
  // Visitas do site: Cloudflare Web Analytics (RUM) via GraphQL Analytics
  // API, dataset rumPageloadEventsAdaptiveGroups — é account-scoped, não
  // zone-scoped (ver functions/lib/cfAnalytics.ts). Nome distinto de
  // CLOUDFLARE_API_TOKEN (usado no deploy) de propósito — são tokens
  // diferentes, com escopos diferentes (esse é só leitura de Account
  // Analytics; o de deploy tem permissão de editar Pages/D1/Workers).
  CLOUDFLARE_ANALYTICS_API_TOKEN: string
  CLOUDFLARE_ACCOUNT_ID: string
  // OAuth do Instagram (ver functions/api/admin/instagram/*.ts) — conectado
  // uma vez pelo admin, o worker renova o token sozinho depois.
  INSTAGRAM_APP_ID: string
  INSTAGRAM_APP_SECRET: string
  // Espectadores ao vivo da Twitch (ver functions/lib/twitch.ts) — só
  // credencial de app (client_credentials), dado público, sem OAuth de
  // usuário/moderador (isso só seria necessário pra follower count, que
  // não usamos aqui — ver workers/social-stats-cron/src/twitch.ts).
  TWITCH_CLIENT_ID: string
  TWITCH_CLIENT_SECRET: string
}
