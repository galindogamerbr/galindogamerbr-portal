import type { Env } from '../../lib/env'
import { consumeOtpCode, createSession, getLatestValidOtp, incrementOtpAttempt } from '../../lib/d1'
import { hashCode, timingSafeEqual } from '../../lib/otp'
import { checkRateLimit } from '../../lib/rateLimit'
import { createSessionId, signSessionId, buildSetCookie } from '../../lib/session'
import { sqliteDatetimePlus } from '../../lib/time'
import { json } from '../../lib/http'

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'

  let email = ''
  let code = ''
  try {
    const body = (await request.json()) as { email?: unknown; code?: unknown }
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    code = typeof body.code === 'string' ? body.code.trim() : ''
  } catch {
    return json({ ok: false })
  }

  if (!email || !code) return json({ ok: false })

  const emailOk = await checkRateLimit(env.DB, { scope: `verify-code:email:${email}`, limit: 5, windowMinutes: 10 })
  const ipOk = await checkRateLimit(env.DB, { scope: `verify-code:ip:${ip}`, limit: 10, windowMinutes: 10 })
  if (!emailOk || !ipOk) return json({ ok: false })

  const otp = await getLatestValidOtp(env.DB, email)
  if (!otp) return json({ ok: false })

  const candidateHash = await hashCode(code, env.OTP_PEPPER)
  if (!timingSafeEqual(candidateHash, otp.code_hash)) {
    await incrementOtpAttempt(env.DB, otp.id)
    return json({ ok: false })
  }

  // Uso único: apaga no primeiro sucesso, mesmo dentro da validade.
  await consumeOtpCode(env.DB, otp.id)

  const sessionId = createSessionId()
  await createSession(env.DB, {
    id: sessionId,
    email,
    expiresAt: sqliteDatetimePlus(SESSION_MAX_AGE_SECONDS * 1000),
    userAgent: request.headers.get('user-agent'),
    ip,
  })

  const cookieValue = await signSessionId(sessionId, env.SESSION_SECRET)
  return json(
    { ok: true },
    { headers: { 'set-cookie': buildSetCookie(env.SESSION_COOKIE_NAME, cookieValue, SESSION_MAX_AGE_SECONDS) } },
  )
}
