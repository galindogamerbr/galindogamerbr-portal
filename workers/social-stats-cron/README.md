# social-stats-cron

Worker separado (não Pages Functions — Cloudflare Pages não suporta cron) que roda de hora em hora e popula `social_stats_cache` no D1 (`galindogamerbr_hub`, mesmo banco do site) com o número de seguidores/inscritos/membros de cada rede.

Discord e Kick são **keyless**: scraping de páginas públicas ou endpoints não-autenticados que os próprios frontends das redes usam. Nenhuma credencial, nenhuma cota formal — mas também nenhuma garantia de estabilidade: qualquer rede pode mudar o formato da página/endpoint a qualquer momento. YouTube, Instagram e TikTok usam API oficial (menos frágil, mas precisam de credencial — ver abaixo). Uma falha numa rede não derruba as outras (`Promise.allSettled` em `src/index.ts`) nem apaga o último valor conhecido em cache.

## Credenciais necessárias

- **`YOUTUBE_API_KEY`** (secret do Worker, `wrangler secret put YOUTUBE_API_KEY` rodando dentro desta pasta) — API key do YouTube Data API v3 (Google Cloud Console → habilitar "YouTube Data API v3" → Credentials → Create API key).
- **Instagram**: sem secrets aqui — o token de acesso do Instagram é gerado manualmente pelo admin no App Dashboard da Meta e colado uma vez em `/admin/instagram` no site (`functions/api/admin/instagram/connect.ts`), que grava no D1 (`instagram_token`); este worker só lê e renova sozinho via `ig_refresh_token` (`src/instagram.ts`, sem precisar de App ID/Secret). Se ninguém conectou ainda, o Instagram simplesmente fica de fora da coleta (sem erro).
- **`TIKTOK_CLIENT_KEY`** e **`TIKTOK_CLIENT_SECRET`** (secrets do Worker, mesmos valores do app "Login Kit" em developers.tiktok.com) — mesmo espírito do Instagram: login inicial uma vez em `/admin/tiktok` (`functions/api/admin/tiktok/*.ts`), token salvo no D1 (`tiktok_token`), este worker só lê e renova (`src/tiktok.ts`) a cada rodada (access token do TikTok dura só 24h).

## Rodar localmente

Esse worker tem seu próprio D1 local (`workers/social-stats-cron/.wrangler/state`), separado do `.wrangler/state` da raiz do projeto — mesmo `database_id`, mas é outro arquivo sqlite. Antes do primeiro teste local, aplica a migration nele também (só uma vez):

```
wrangler d1 execute galindogamerbr_hub --local --file=../../migrations/0008_community_stats.sql
wrangler d1 execute galindogamerbr_hub --local --file=../../migrations/0009_instagram_oauth.sql
wrangler d1 execute galindogamerbr_hub --local --file=../../migrations/0013_tiktok_oauth.sql
```

Depois:

```
wrangler dev --config wrangler.toml --test-scheduled
# depois, num terminal separado:
curl "http://localhost:8787/__scheduled?cron=0+*+*+*+*"
```

## Deploy

Workflow próprio: `.github/workflows/deploy-cron-worker.yml`. Só roda automaticamente quando algo muda dentro de `workers/social-stats-cron/` num push na `main` (via filtro `paths`) — não redeploya à toa a cada mudança no resto do site. Também pode ser disparado manualmente (`workflow_dispatch`, inclusive a partir de outra branch) — não precisa rodar `wrangler deploy` na mão.
