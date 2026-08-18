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
  // por rede são coletados por um worker separado (workers/social-stats-cron)
  // — algumas via API oficial (YouTube, Instagram, TikTok), outras via
  // scraping/endpoints públicos (Discord, Kick).
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
  // Id da "Configuração de Login" criada em Login do Facebook para Empresas
  // → Configurações no app da Meta — o caso de uso "Instagram API" hoje é
  // provisionado em cima desse produto, que usa config_id em vez de scope
  // no dialog de autorização.
  INSTAGRAM_LOGIN_CONFIG_ID: string
  // Verify token do produto Webhooks (ver functions/api/webhooks/instagram.ts)
  // — string arbitrária definida por nós, que a Meta ecoa de volta no
  // handshake de verificação. Não usamos webhooks de verdade ainda (não
  // processamos nenhum evento), só implementa o handshake pra passar na
  // validação do painel da Meta.
  INSTAGRAM_WEBHOOK_VERIFY_TOKEN: string
  // Espectadores ao vivo da Twitch (ver functions/lib/twitch.ts) — só
  // credencial de app (client_credentials), dado público, sem OAuth de
  // usuário/moderador (isso só seria necessário pra follower count, que
  // não usamos aqui — ver workers/social-stats-cron/src/twitch.ts).
  TWITCH_CLIENT_ID: string
  TWITCH_CLIENT_SECRET: string
  // OAuth do TikTok (Login Kit, ver functions/api/admin/tiktok/*.ts) —
  // conectado uma vez pelo admin, o worker renova o token sozinho depois.
  TIKTOK_CLIENT_KEY: string
  TIKTOK_CLIENT_SECRET: string
}
