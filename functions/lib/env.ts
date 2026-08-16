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
}
