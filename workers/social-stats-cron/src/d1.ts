import type { Env } from './env'
import { logError } from './log'

export type SocialPlatform = 'youtube' | 'discord' | 'twitch' | 'instagram' | 'tiktok' | 'kick'

const DATABASE_BINDINGS = ['DB', 'PREVIEW_DB'] as const

// Escreve em produção e preview igualzinho — o worker não tem "deploy de
// preview" próprio (ver PREVIEW_DB em env.ts), então isso é o único jeito
// do fallback de leitura do preview bater. Cada banco isolado: um falhar
// não impede o outro (nem o resto da rodada) de gravar.
export async function upsertToAllDatabases(env: Env, write: (db: D1Database) => Promise<void>): Promise<void> {
  await Promise.all(
    DATABASE_BINDINGS.map(async (binding) => {
      try {
        await write(env[binding])
      } catch (error) {
        logError('social-stats-cron', `Escrita em ${binding} falhou`, { binding, error })
      }
    }),
  )
}

// Remove identificadores de segurança antes de completarem 24 horas. O
// worker executa a cada 20 minutos; a margem cobre o intervalo entre ciclos.
export async function purgeExpiredSecurityData(db: D1Database): Promise<void> {
  await db.batch([
    db.prepare("DELETE FROM rate_limit_events WHERE created_at <= datetime('now', '-23 hours')"),
    db.prepare("DELETE FROM otp_codes WHERE created_at <= datetime('now', '-23 hours')"),
    db.prepare("UPDATE sessions SET ip = NULL WHERE ip IS NOT NULL AND created_at <= datetime('now', '-23 hours')"),
  ])
}

// count = seguidores/inscritos/membros (social_stats_cache); postCount =
// quantidade de posts/vídeos (post_counts_cache), quando a rede/chamada
// já traz esse dado de graça (YouTube/TikTok/Instagram) — undefined pras
// redes que não têm esse conceito (Twitch/Kick/Discord).
export type Stats = { count: number | null; postCount?: number | null }

// Duplicado (não importado de functions/lib/) de propósito: esse worker roda
// num runtime/deploy separado do Pages Functions do site — acoplar os dois
// builds complicaria o tsc -b do projeto principal pra um helper de 6 linhas.
export async function upsertSocialStat(db: D1Database, platform: SocialPlatform, count: number): Promise<void> {
  await db
    .prepare(
      `INSERT INTO social_stats_cache (platform, count, fetched_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT (platform) DO UPDATE SET count = excluded.count, fetched_at = excluded.fetched_at`,
    )
    .bind(platform, count)
    .run()
}

// Quantidade de posts/vídeos por rede — mesmo padrão do
// upsertSocialStat (seguidores), tabela separada (post_counts_cache).
export async function upsertPostCount(db: D1Database, platform: SocialPlatform, count: number): Promise<void> {
  await db
    .prepare(
      `INSERT INTO post_counts_cache (platform, count, fetched_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT (platform) DO UPDATE SET count = excluded.count, fetched_at = excluded.fetched_at`,
    )
    .bind(platform, count)
    .run()
}

export type InstagramTokenRow = { access_token: string; ig_user_id: string; expires_at: string }

// Token bootstrapado a partir do secret INSTAGRAM_ACCESS_TOKEN na primeira
// rodada (ver src/instagram.ts) — depois disso o worker renova e persiste
// aqui sozinho, sem depender do secret de novo.
export async function getInstagramToken(db: D1Database): Promise<InstagramTokenRow | null> {
  const row = await db
    .prepare('SELECT access_token, ig_user_id, expires_at FROM instagram_token WHERE id = 1')
    .first<InstagramTokenRow>()
  return row ?? null
}

export async function upsertInstagramToken(
  db: D1Database,
  params: { accessToken: string; igUserId: string; expiresAt: string },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO instagram_token (id, access_token, ig_user_id, expires_at, updated_at)
       VALUES (1, ?, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET access_token = excluded.access_token, ig_user_id = excluded.ig_user_id,
         expires_at = excluded.expires_at, updated_at = excluded.updated_at`,
    )
    .bind(params.accessToken, params.igUserId, params.expiresAt)
    .run()
}

export type TiktokTokenRow = { access_token: string; refresh_token: string }

// Token conectado uma vez via functions/api/admin/tiktok/* (fluxo OAuth no
// painel admin do site) — o worker só lê e renova, nunca inicia login.
export async function getTiktokToken(db: D1Database): Promise<TiktokTokenRow | null> {
  const row = await db.prepare('SELECT access_token, refresh_token FROM tiktok_token WHERE id = 1').first<TiktokTokenRow>()
  return row ?? null
}

export async function upsertTiktokToken(db: D1Database, params: { accessToken: string; refreshToken: string }): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tiktok_token (id, access_token, refresh_token, updated_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token,
         updated_at = excluded.updated_at`,
    )
    .bind(params.accessToken, params.refreshToken)
    .run()
}

export type SiteVisitsLifetimeRow = { total_visits: number; last_counted_at: string | null }

// Total acumulado de visitas (ver src/siteVisitsLifetime.ts) — last_counted_at
// é o cursor (timestamp ISO exato) até onde a Analytics API já foi somada.
export async function getSiteVisitsLifetime(db: D1Database): Promise<SiteVisitsLifetimeRow | null> {
  const row = await db.prepare('SELECT total_visits, last_counted_at FROM site_visits_lifetime WHERE id = 1').first<SiteVisitsLifetimeRow>()
  return row ?? null
}

export async function upsertSiteVisitsLifetime(db: D1Database, params: { totalVisits: number; lastCountedAt: string }): Promise<void> {
  await db
    .prepare(
      `INSERT INTO site_visits_lifetime (id, total_visits, last_counted_at, updated_at)
       VALUES (1, ?, ?, datetime('now'))
       ON CONFLICT (id) DO UPDATE SET total_visits = excluded.total_visits, last_counted_at = excluded.last_counted_at,
         updated_at = excluded.updated_at`,
    )
    .bind(params.totalVisits, params.lastCountedAt)
    .run()
}
