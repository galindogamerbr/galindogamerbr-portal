# social-stats-cron

Worker separado (não Pages Functions — Cloudflare Pages não suporta cron) que roda de hora em hora e popula `social_stats_cache` no D1 (`galindogamerbr_hub`, mesmo banco do site) com o número de seguidores/inscritos/membros de cada rede.

Tudo aqui é **keyless**: scraping de páginas públicas ou endpoints não-autenticados que os próprios frontends das redes usam. Nenhuma credencial, nenhuma cota formal — mas também nenhuma garantia de estabilidade: qualquer rede pode mudar o formato da página/endpoint a qualquer momento. Uma falha numa rede não derruba as outras (`Promise.allSettled` em `src/index.ts`) nem apaga o último valor conhecido em cache.

## Rodar localmente

```
wrangler dev --config wrangler.toml --test-scheduled
# depois, num terminal separado:
curl "http://localhost:8787/__scheduled?cron=0+*+*+*+*"
```

## Deploy

Workflow próprio: `.github/workflows/deploy-cron-worker.yml`. Só roda automaticamente quando algo muda dentro de `workers/social-stats-cron/` num push na `main` (via filtro `paths`) — não redeploya à toa a cada mudança no resto do site. Também pode ser disparado manualmente (`workflow_dispatch`, inclusive a partir de outra branch) — não precisa rodar `wrangler deploy` na mão.
