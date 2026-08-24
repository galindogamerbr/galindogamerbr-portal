import type { Env } from '../lib/env'
import { checkRateLimit } from '../lib/rateLimit'
import { sendPartnershipEmail } from '../lib/resend'
import { logError } from '../lib/log'
import { json } from '../lib/http'
import type { PartnershipSubmission } from '../lib/emailTemplates'
import { isPartnershipType } from '../../src/data/partnerships'

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function parsePartnershipSubmission(body: unknown): PartnershipSubmission | null {
  if (!body || typeof body !== 'object') return null

  const payload = body as Record<string, unknown>
  const partnershipType = clean(payload.partnershipType, 100)
  if (!isPartnershipType(partnershipType)) return null

  const submission = {
    company: clean(payload.company, 200),
    name: clean(payload.name, 200),
    email: clean(payload.email, 200),
    phone: clean(payload.phone, 40),
    partnershipType,
    message: clean(payload.message, 5000),
  }

  if (
    !submission.company ||
    !submission.name ||
    !submission.email.includes('@') ||
    !submission.message
  ) {
    return null
  }

  return submission
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'

  const ipOk = await checkRateLimit(env.DB, { scope: `partnership:ip:${ip}`, limit: 5, windowMinutes: 60 })
  if (!ipOk) {
    return json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const submission = parsePartnershipSubmission(body)
  if (!submission) {
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
