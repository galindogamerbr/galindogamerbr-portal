// Mesmo formato de functions/lib/log.ts (JSON de uma linha, filtrável no Log
// Explorer da Cloudflare — Workers Logs, ligado via [observability] no
// wrangler.toml) — duplicado aqui de propósito: este worker é um projeto
// wrangler separado, sem import cross-projeto pra Pages Functions. Só
// warn/error, sem nível "info".
type LogLevel = 'warn' | 'error'

function emit(level: LogLevel, scope: string, message: string, meta?: Record<string, unknown>): void {
  const line = JSON.stringify({ level, scope, message, ...(meta ? { meta: serializeMeta(meta) } : {}) })
  if (level === 'error') console.error(line)
  else console.warn(line)
}

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
