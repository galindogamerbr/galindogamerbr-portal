# tiktok-live-poll

Consulta se o canal está ao vivo no TikTok agora (status + espectadores) e
manda o resultado pro site. Roda só no GitHub Actions
(`.github/workflows/tiktok-live-poll.yml`, agendado a cada ~5min) — **não
faz parte do backend do site** (Cloudflare Pages Functions/Workers).

## Por que não é uma Function normal como as outras redes

YouTube, Twitch e Kick têm API oficial pra status "ao vivo"/espectadores —
o TikTok não. As únicas formas de conseguir esse dado do TikTok são:

- Buscar direto do backend (`fetch` num Worker): **bloqueado** por um
  desafio anti-bot do TikTok (WAF), mesmo com header de navegador.
- Buscar direto do navegador do visitante: **bloqueado** por CORS — o
  TikTok não libera leitura cross-origin da página de live pra JS de outro
  site.
- Conectar no WebSocket real do TikTok LIVE (o que esse script faz, via
  [`tiktok-live-connector`](https://github.com/zerodytrash/TikTok-Live-Connector)):
  **funciona**, mas exige um runtime Node de verdade — não roda dentro do
  Cloudflare Workers.

Por isso esse script roda separado, no GitHub Actions (que tem Node
completo), e manda o resultado pro site via um endpoint protegido
(`/api/webhooks/tiktok-live`), que grava em D1 (`tiktok_live_cache` — ver
migration `0020_tiktok_live_cache.sql`). `functions/api/community-stats.ts`
só lê esse valor, nunca busca fresco.

## Secrets necessários (GitHub Actions → Settings → Secrets)

- `TIKTOK_LIVE_WEBHOOK_URL` — ex: `https://galindogamerbr.com.br/api/webhooks/tiktok-live`
- `TIKTOK_LIVE_WEBHOOK_SECRET` — mesmo valor configurado como variável de
  ambiente `TIKTOK_LIVE_WEBHOOK_SECRET` no Cloudflare Pages (Production e
  Preview)

## Rodar localmente

```
cd scripts/tiktok-live-poll
npm install
TIKTOK_LIVE_WEBHOOK_URL=http://localhost:8788/api/webhooks/tiktok-live \
TIKTOK_LIVE_WEBHOOK_SECRET=dev-secret \
node poll.mjs
```
