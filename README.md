# GalindoGamerBR — Hub Portal

Portal da comunidade GalindoGamerBR. React + TypeScript + Vite no front, Cloudflare Pages Functions (`/functions`) + Cloudflare D1 no back — mesmo repositório, deploy único.

## Stack

- **Front**: Vite + React + TypeScript + Tailwind CSS
- **Back**: Cloudflare Pages Functions (colocadas em `/functions`) + Cloudflare D1
- **Auth**: código OTP por e-mail via Resend
- **Live/vídeos**: sem API key do YouTube — feed Atom público + oEmbed (ver `functions/lib/youtube.ts`)

## Rodando local

```
npm install
npm run dev:full
```

Abre em `http://127.0.0.1:8788` — builda uma vez e sobe o Vite com hot reload por trás, com as Pages Functions (`/api/*`) juntas na mesma origem.

Se `dev:full` der problema (o modo proxy do wrangler é instável nessa versão), o fallback confiável é:

```
npm run dev:worker
```

Sem hot reload — precisa rodar de novo a cada mudança, mas sempre funciona.

Só front-end, sem `/api/*` (mais rápido pra mexer em CSS/layout que não depende de dados):

```
npm run dev
```

### Banco de dados local

```
npm run db:migrate:local
```

Aplica as migrations em `/migrations` num D1 local (sqlite via `wrangler`, isolado do banco de produção).

### Outros comandos úteis

```
npm run typecheck   # só o TypeScript, sem buildar
npm run build        # build de produção (dist/)
npm run lint          # oxlint
```

## Workflow de edição (main protegida)

A branch `main` é protegida — sem push direto. Todo mundo edita por branch + Pull Request:

```
git checkout main
git pull
git checkout -b minha-mudanca
# ... edita, commita ...
git push -u origin minha-mudanca
```

Abre o PR no GitHub, revisa, e **merge pra `main`** — isso dispara o deploy automático de produção (ver `.github/workflows/deploy.yml`).

## Deploy

### Produção (automático)

Todo merge/push em `main` roda o workflow do GitHub Actions: typecheck → build → aplica migrations do D1 → `wrangler pages deploy` com `--branch=main`, publicando em produção (o domínio real).

Precisa desses secrets configurados no repositório (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — token com permissão de editar Pages e D1
- `CLOUDFLARE_ACCOUNT_ID` — id da conta Cloudflare (não fica hardcoded em lugar nenhum do repo)
- `CLOUDFLARE_D1_DATABASE_ID` — id do banco D1 de produção; o workflow substitui o placeholder do `wrangler.toml` por esse valor antes de aplicar migrations/deployar (o id real nunca fica commitado — só nesse secret e no working tree local, via `skip-worktree`)

### Banco remoto (D1)

Migrations novas em `/migrations` sobem sozinhas: o workflow de deploy aplica `wrangler d1 migrations apply --remote` antes de publicar. Não precisa rodar nada manualmente depois de um merge em `main`.

Pra aplicar numa situação fora do fluxo normal de deploy:

```
npm run db:migrate:remote
```
