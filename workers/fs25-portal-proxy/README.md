# fs25-portal-proxy

Worker separado que expõe `fs25.galindogamerbr.com.br` como reverse proxy pro
portal web do servidor dedicado de Farming Simulator (`FS25_PORTAL_ORIGIN`,
ex.: `http://galindoverso.gamesservers.io:9017`) — HTTP puro na porta
customizada (sem TLS próprio, comum em portal de servidor de jogo). O
Custom Domain do Worker termina HTTPS na borda da Cloudflare antes de
chegar aqui, então o visitante sempre fala HTTPS com `fs25.galindogamerbr.com.br`,
mesmo o origin sendo HTTP puro por trás.

Sem proteção de acesso própria (nem sessão do `/admin`, nem Cloudflare
Access) — decisão consciente: o portal já tem login embutido. Qualquer um
com o link chega até a tela de login dele.

Sem D1/KV: é só passthrough, não guarda estado.

## Credenciais necessárias

- **`FS25_PORTAL_ORIGIN`** (secret do Worker, `wrangler secret put FS25_PORTAL_ORIGIN` rodando
  dentro desta pasta) — `http://host:porta` do portal. Nunca commitado (nem em `wrangler.toml`,
  nem em código) — só nesse secret e em `.dev.vars` local (gitignored).

## Limitações conhecidas

- **Links absolutos no HTML/JS do portal**: se o próprio portal emitir uma URL absoluta
  apontando pro host interno (`http://galindoverso.gamesservers.io:9017/algo`) em vez de
  relativa, o navegador tentaria ir direto pra lá, ignorando o proxy — não tem reescrita de
  corpo de resposta aqui (só de `Location` em redirects HTTP). Se isso acontecer na prática,
  precisa de reescrita de HTML, mais invasivo.
- **`Set-Cookie` com `Domain=` explícito** apontando pro host interno seria rejeitado pelo
  navegador (cookie de domínio que não bate com quem respondeu) — só é problema se o portal
  fixar isso explicitamente; a maioria não define `Domain=` e cai pro host da requisição
  (`fs25.galindogamerbr.com.br`, transparente).
- **WebSocket não é encaminhado** — se o portal usa atualização em tempo real via WebSocket,
  essa conexão específica não passa pelo proxy (só request/response HTTP normal). Dá pra
  adicionar depois se for necessário (`fetch()` com `Upgrade: websocket` + `response.webSocket`).

## Rodar localmente

```
wrangler dev --config wrangler.toml
```

Lê `FS25_PORTAL_ORIGIN` de `.dev.vars` (copia de `.dev.vars.example` e preenche o valor real).

## Deploy

Workflow próprio: `.github/workflows/deploy-fs25-portal-proxy.yml`. Só roda automaticamente
quando algo muda dentro de `workers/fs25-portal-proxy/` num push na `main` (via filtro
`paths`) — não redeploya à toa a cada mudança no resto do site. Também pode ser disparado
manualmente (`workflow_dispatch`).

Depois do primeiro deploy, roda uma vez (não é automático, o `wrangler.toml` não guarda
secret nenhum):

```
wrangler secret put FS25_PORTAL_ORIGIN --config workers/fs25-portal-proxy/wrangler.toml
```
