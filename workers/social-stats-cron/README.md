# social-stats-cron

Worker separado (não Pages Functions — Cloudflare Pages não suporta cron) que roda de hora em hora e popula `social_stats_cache` no D1 (`galindogamerbr_hub`, mesmo banco do site) com o número de seguidores/inscritos/membros de cada rede. YouTube/TikTok/Instagram também populam `post_counts_cache` (quantidade de posts/vídeos) — vem de graça no mesmo campo das chamadas de seguidores, sem custo extra de API.

Kick é **keyless**: scraping de página pública/endpoint não-autenticado que o próprio frontend da rede usa. Nenhuma credencial, nenhuma cota formal — mas também nenhuma garantia de estabilidade: pode mudar o formato a qualquer momento. YouTube, Instagram e TikTok usam API oficial (menos frágil, mas precisam de credencial — ver abaixo). Uma falha numa rede não derruba as outras (`Promise.allSettled` em `src/index.ts`) nem apaga o último valor conhecido em cache.

Discord **não está aqui** — sai direto em `functions/api/community-stats.ts` (endpoint público, sem risco de cota, busca sempre fresco a cada request no site), não precisa do cache de hora em hora.

## Credenciais necessárias

- **`YOUTUBE_API_KEY`** (secret do Worker, `wrangler secret put YOUTUBE_API_KEY` rodando dentro desta pasta) — API key do YouTube Data API v3 (Google Cloud Console → habilitar "YouTube Data API v3" → Credentials → Create API key).
- **`INSTAGRAM_ACCESS_TOKEN`** (secret do Worker) — token de usuário do Instagram gerado manualmente no App Dashboard da Meta (Casos de uso → Gerenciar mensagens e conteúdo no Instagram → "Gerar tokens de acesso") e colado direto aqui, sem painel admin no site. Usa `me` como id da conta (a Graph API resolve sozinha pro dono do token). Usado só como bootstrap na primeira rodada sem nada em D1 (`instagram_token`); a partir daí o worker renova sozinho via `ig_refresh_token` e persiste em D1, sem precisar do secret de novo (`src/instagram.ts`). Se nunca foi configurado, o Instagram simplesmente fica de fora da coleta (sem erro).
- **`TIKTOK_CLIENT_KEY`** e **`TIKTOK_CLIENT_SECRET`** (secrets do Worker, mesmos valores do app "Login Kit" em developers.tiktok.com) — mesmo espírito do Instagram: login inicial uma vez em `/admin/tiktok` (`functions/api/admin/tiktok/*.ts`), token salvo no D1 (`tiktok_token`), este worker só lê e renova (`src/tiktok.ts`) a cada rodada (access token do TikTok dura só 24h).
- **`CRON_TRIGGER_SECRET`** (secret do Worker, valor arbitrário aleatório) — autoriza o gatilho manual via HTTP (`fetch()` em `src/index.ts`, header `x-trigger-secret`). Os workflows de deploy (`deploy.yml`, `deploy-preview.yml`, `deploy-cron-worker.yml`) chamam isso depois de todo deploy, pra não esperar até 20min pela próxima rodada agendada — precisa do mesmo valor configurado como secret do GitHub Actions (`CRON_TRIGGER_SECRET`, Settings → Secrets and variables → Actions).

## Gatilho manual (fora do cron)

```
curl -X POST -H "x-trigger-secret: <CRON_TRIGGER_SECRET>" https://galindogamerbr-social-stats-cron.dignanet.workers.dev/
```

Sem o header certo, devolve 404 (não revela se o secret está certo ou errado, nem que essa rota existe).

## Rodar localmente

Esse worker tem seu próprio D1 local (`workers/social-stats-cron/.wrangler/state`), separado do `.wrangler/state` da raiz do projeto — mesmo `database_id`, mas é outro arquivo sqlite. Antes do primeiro teste local, aplica a migration nele também (só uma vez):

```
wrangler d1 execute galindogamerbr_hub --local --file=../../migrations/0008_community_stats.sql
wrangler d1 execute galindogamerbr_hub --local --file=../../migrations/0009_instagram_oauth.sql
wrangler d1 execute galindogamerbr_hub --local --file=../../migrations/0013_tiktok_oauth.sql
wrangler d1 execute galindogamerbr_hub --local --file=../../migrations/0018_post_counts_cache.sql
```

Depois:

```
wrangler dev --config wrangler.toml --test-scheduled
# depois, num terminal separado:
curl "http://localhost:8787/__scheduled?cron=0+*+*+*+*"
```

## Deploy

Workflow próprio: `.github/workflows/deploy-cron-worker.yml`. Só roda automaticamente quando algo muda dentro de `workers/social-stats-cron/` num push na `main` (via filtro `paths`) — não redeploya à toa a cada mudança no resto do site. Também pode ser disparado manualmente (`workflow_dispatch`, inclusive a partir de outra branch) — não precisa rodar `wrangler deploy` na mão.
