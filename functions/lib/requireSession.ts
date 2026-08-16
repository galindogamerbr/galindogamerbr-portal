import type { Env } from './env'
import { getActiveSession } from './d1'
import { parseCookie, verifyCookieValue } from './session'

// Reusado por toda rota admin-only (Fase 3 em diante) — mesma checagem
// que /api/auth/me já fazia isoladamente.
export async function requireSession(request: Request, env: Env): Promise<string | null> {
  const cookieValue = parseCookie(request.headers.get('cookie'), env.SESSION_COOKIE_NAME)
  if (!cookieValue) return null

  const sessionId = await verifyCookieValue(cookieValue, env.SESSION_SECRET)
  if (!sessionId) return null

  const session = await getActiveSession(env.DB, sessionId)
  return session?.email ?? null
}
