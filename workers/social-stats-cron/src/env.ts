export type Env = {
  DB: D1Database
  // Banco de preview (galindogamerbr_hub_preview, mesmo que deploy-preview.yml
  // usa) — o worker não tem "deploy de preview" próprio, então escreve nos
  // dois D1 pra não deixar o fallback de leitura do preview vazio/desatualizado
  // (ver resolveChannelStatsFromCache em functions/api/community-stats.ts).
  PREVIEW_DB: D1Database
  // Mesmo namespace KV que as Pages Functions usam (ver functions/lib/env.ts)
  // — esse worker escreve, o site público só lê (functions/api/community-stats.ts).
  PUBLIC_CACHE: KVNamespace
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
  // Autoriza o gatilho manual via HTTP (ver fetch() em src/index.ts) — só
  // quem sabe esse valor consegue forçar uma rodada de coleta fora do
  // agendamento normal.
  CRON_TRIGGER_SECRET: string
  // Assina a inscrição WebSub do YouTube (ver src/youtubePubsub.ts) — mesmo
  // valor configurado como secret nas Pages Functions (YOUTUBE_PUBSUB_SECRET
  // em functions/lib/env.ts), que é quem valida a assinatura das notificações.
  YOUTUBE_PUBSUB_SECRET: string
  // Total de visitas desde o início (ver src/siteVisitsLifetime.ts) — mesmos
  // valores já configurados nas Pages Functions (functions/lib/env.ts,
  // usados por functions/lib/cfAnalytics.ts pras visitas "de hoje"); esse
  // worker precisa da própria cópia porque roda num Worker separado.
  CLOUDFLARE_ANALYTICS_API_TOKEN: string
  CLOUDFLARE_ACCOUNT_ID: string
}
