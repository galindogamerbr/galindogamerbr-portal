# GalindoGamerBR — Hub Portal

[![Deploy](https://github.com/galindogamerbr/galindogamerbr-portal/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/galindogamerbr/galindogamerbr-portal/actions/workflows/deploy.yml)
[![CI](https://github.com/galindogamerbr/galindogamerbr-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/galindogamerbr/galindogamerbr-portal/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)

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

### Preview (manual, outras branches)

O workflow `deploy-preview.yml` roda sob demanda (Actions → Deploy Preview → Run workflow, escolhendo a branch) — não dispara sozinho a cada push. Mesmos passos do deploy de produção (typecheck → build → migrations → deploy), mas publicando como *preview deployment* daquela branch, sem tocar produção.

O preview usa banco D1 **separado** (`galindogamerbr_hub_preview`) — nunca lê/escreve no banco de produção. Cloudflare Pages ignora seções `[env.preview]` no `wrangler.toml` (isso é coisa de Workers, não de Pages — confirmado testando), então o workflow sobrescreve com `sed` o `database_id` e o `ENVIRONMENT` do bloco de topo antes de buildar, só nesse job (nunca fica commitado assim). Também precisa de:

- `CLOUDFLARE_D1_PREVIEW_DATABASE_ID` — id do banco D1 de preview

O e-mail de OTP em preview também sai de um remetente separado (`acesso-preview@galindogamerbr.com.br`, ver `functions/lib/resend.ts`), pra não misturar com o remetente de produção.

**As URLs de preview (`*.pages.dev`) exigem login na conta Cloudflare pra abrir** — tem uma Cloudflare Access Application protegendo elas por padrão. Isso é intencional por ora: removê-la exige ativar o Zero Trust na conta, que pede cadastro de cartão mesmo no plano free. Só quem tem acesso à conta Cloudflare consegue ver os previews; pra liberar pra qualquer um (ex.: mandar link pra alguém de fora revisar), seria preciso ativar o Zero Trust e apagar/editar a Access Application em Zero Trust → Access → Applications.

Pra rodar um preview manualmente a partir de outra branch, sem esperar o push:

```
git checkout minha-mudanca
npm run deploy
```

Isso builda e faz `wrangler pages deploy dist --project-name=galindogamerbr-portal` **sem** `--branch` fixo — o wrangler detecta o branch git atual e publica como preview. Só que localmente o `wrangler.toml` tem o `database_id` de produção no `[[d1_databases]]` de topo (é o que o `skip-worktree` guarda) — então um deploy manual local com esse comando ainda aponta o binding padrão pro banco de produção; prefira deixar o `deploy-preview.yml` cuidar disso.

### Banco remoto (D1)

Migrations novas em `/migrations` sobem sozinhas: o workflow de deploy aplica `wrangler d1 migrations apply --remote` antes de publicar. Não precisa rodar nada manualmente depois de um merge em `main`.

Pra aplicar numa situação fora do fluxo normal de deploy:

```
npm run db:migrate:remote
```
