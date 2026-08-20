// Puxa um snapshot do D1 de produção pro D1 local — `wrangler pages dev` não
// tem flag --remote pra bindings (isso só existe em `wrangler dev` puro),
// então "conectar direto ao prod" não é possível; isso é o substituto real:
// sincronizar um snapshot sob demanda. `wrangler d1 export` não inclui
// `DROP TABLE IF EXISTS` antes de cada `CREATE TABLE`, então importar direto
// falha com "table already exists" se o D1 local já tiver as tabelas —
// em vez de apagar o diretório do D1 local (falha com EBUSY se algum
// `wrangler pages dev` já estiver rodando e com o arquivo aberto), injeta um
// DROP na frente de cada CREATE, então o import recria tudo do zero.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const SNAPSHOT_PATH = '.wrangler/prod-snapshot.sql'

execFileSync('npx', ['wrangler', 'd1', 'export', 'galindogamerbr_hub', '--remote', '--output', SNAPSHOT_PATH, '-y'], {
  stdio: 'inherit',
  shell: true,
})

const sql = readFileSync(SNAPSHOT_PATH, 'utf8')
const withDrops = sql.replace(/^CREATE TABLE (?:IF NOT EXISTS )?["'`]?(\w+)["'`]?/gm, 'DROP TABLE IF EXISTS $1;\nCREATE TABLE $1')
writeFileSync(SNAPSHOT_PATH, withDrops)

execFileSync('npx', ['wrangler', 'd1', 'execute', 'galindogamerbr_hub', '--local', `--file=${SNAPSHOT_PATH}`], {
  stdio: 'inherit',
  shell: true,
})

console.log(`\n✅ D1 local sincronizado com o snapshot de produção (${SNAPSHOT_PATH}).`)
