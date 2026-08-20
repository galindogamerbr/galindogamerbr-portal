import type { Env } from '../lib/env'
import { checkRateLimit } from '../lib/rateLimit'
import { sendPartnershipEmail } from '../lib/resend'
import { logError } from '../lib/log'
import { json } from '../lib/http'

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'

  const ipOk = await checkRateLimit(env.DB, { scope: `partnership:ip:${ip}`, limit: 5, windowMinutes: 60 })
  if (!ipOk) {
    return json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  let body: { name?: unknown; email?: unknown; phone?: unknown; message?: unknown } = {}
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const submission = {
    name: clean(body.name, 200),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    message: clean(body.message, 5000),
  }

  if (!submission.name || !submission.email.includes('@') || !submission.message) {
    return json({ ok: false, error: 'invalid_fields' }, { status: 400 })
  }

  try {
    await sendPartnershipEmail(env, submission)
  } catch (err) {
    logError('partnership', 'Falha ao enviar e-mail de parceria', { err })
    return json({ ok: false, error: 'send_failed' }, { status: 502 })
  }

  return json({ ok: true })
}
