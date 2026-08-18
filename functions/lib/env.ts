export type Env = {
  DB: D1Database
  RESEND_API_KEY: string
  SESSION_SECRET: string
  OTP_PEPPER: string
  SESSION_COOKIE_NAME: string
  OTP_EXPIRY_MINUTES: string
  ENVIRONMENT: string
  // Automação de live (ver functions/lib/youtube.ts) — checagem direta e
  // keyless a cada request, sem API key, sem D1, sem cron externo.
  YOUTUBE_CHANNEL_ID: string
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
}
