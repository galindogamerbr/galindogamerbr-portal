// Log estruturado (uma linha JSON por evento) — filtrável no Log Explorer
// da Cloudflare (Workers & Pages → galindogamerbr-portal → Logs, feature
// "Workers Logs" ligada via [observability] no wrangler.toml) por level/scope,
// sem precisar de wrangler tail ao vivo nem de serviço externo. Só
// warn/error de propósito: nada de nível "info" por aqui, pra não afogar o
// que interessa com ruído de rotina (isso continua com console.log solto
// onde já existe, ex.: functions/lib/resend.ts em dev).
type LogLevel = 'warn' | 'error'

function emit(level: LogLevel, scope: string, message: string, meta?: Record<string, unknown>): void {
  const line = JSON.stringify({ level, scope, message, ...(meta ? { meta: serializeMeta(meta) } : {}) })
  if (level === 'error') console.error(line)
  else console.warn(line)
}

// Error não serializa campos próprios (name/message/stack) em JSON.stringify
// direto — sem isso, um `err` dentro de meta vira `{}` no log.
function serializeMeta(meta: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(meta)) {
    out[key] = value instanceof Error ? { name: value.name, message: value.message, stack: value.stack } : value
  }
  return out
}

export function logWarn(scope: string, message: string, meta?: Record<string, unknown>): void {
  emit('warn', scope, message, meta)
}

export function logError(scope: string, message: string, meta?: Record<string, unknown>): void {
  emit('error', scope, message, meta)
}
