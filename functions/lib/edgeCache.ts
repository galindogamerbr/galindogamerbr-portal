// Cache de borda por colo (Cache API do Cloudflare, caches.default) — usado
// nos endpoints públicos de leitura pesada (/api/live, /api/community-stats)
// pra requests concorrentes de vários visitantes serem servidos sem nem
// executar a Function. Só funciona porque a Response já sai com
// Cache-Control (ver publicCacheSeconds em functions/lib/http.ts), que é o
// que a Cache API usa pra decidir até quando guardar.
export async function withEdgeCache(
  request: Request,
  waitUntil: (promise: Promise<unknown>) => void,
  build: () => Promise<Response>,
): Promise<Response> {
  const cache = caches.default
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await build()
  if (response.headers.has('cache-control')) {
    waitUntil(cache.put(request, response.clone()))
  }
  return response
}
