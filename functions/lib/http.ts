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
