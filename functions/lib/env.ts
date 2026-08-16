export type Env = {
  DB: D1Database
  RESEND_API_KEY: string
  SESSION_SECRET: string
  OTP_PEPPER: string
  SESSION_COOKIE_NAME: string
  OTP_EXPIRY_MINUTES: string
  ENVIRONMENT: string
  // Fase 2 — automação de live (ver functions/lib/youtube.ts, functions/lib/websub.ts)
  YOUTUBE_API_KEY: string
  YOUTUBE_CHANNEL_ID: string
  PUBLIC_BASE_URL: string
  INTERNAL_API_SECRET: string
}
