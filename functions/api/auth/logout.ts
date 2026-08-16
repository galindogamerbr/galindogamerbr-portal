import type { Env } from '../../lib/env'
import { revokeSession } from '../../lib/d1'
import { buildClearCookie, parseCookie, verifyCookieValue } from '../../lib/session'
import { json } from '../../lib/http'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const cookieValue = parseCookie(request.headers.get('cookie'), env.SESSION_COOKIE_NAME)

  if (cookieValue) {
    const sessionId = await verifyCookieValue(cookieValue, env.SESSION_SECRET)
    if (sessionId) await revokeSession(env.DB, sessionId)
  }

  return json({ ok: true }, { headers: { 'set-cookie': buildClearCookie(env.SESSION_COOKIE_NAME) } })
}
