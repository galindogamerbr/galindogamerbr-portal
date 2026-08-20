// publicCacheSeconds seta Cache-Control: public — usar só em endpoints
// públicos, sem dado por-usuário (nunca em /api/admin/** nem /api/auth/me).
// Além de instruir o navegador/CDNs a reusar a resposta, é o que a Cache API
// (caches.default, ver functions/api/live.ts e functions/api/community-stats.ts)
// usa pra decidir o TTL de borda.
export type JsonInit = ResponseInit & { publicCacheSeconds?: number }

export function json(body: unknown, init: JsonInit = {}): Response {
  const { publicCacheSeconds, ...responseInit } = init
  const headers = new Headers(responseInit.headers)
  headers.set('content-type', 'application/json')
  if (publicCacheSeconds !== undefined) {
    headers.set('cache-control', `public, max-age=${publicCacheSeconds}`)
  }
  return new Response(JSON.stringify(body), { ...responseInit, headers })
}

const DEFAULT_FETCH_TIMEOUT_MS = 5000

// fetch() sem timeout pode travar o Worker inteiro esperando um serviço
// externo lento/travado (ex: YouTube via IP de datacenter, ver
// functions/lib/youtube.ts) até o limite de wall-time da Cloudflare
// estourar — isso derruba a requisição do visitante com 524, e pior:
// se vários visitantes baterem no mesmo instante em que o cache do KV
// expira, várias invocações travam juntas ao mesmo tempo. Todo fetch pra
// serviço externo nesses libs deveria passar por aqui em vez de fetch() cru.
export async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}
