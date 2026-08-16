import type { Env } from '../../lib/env'
import { isAllowlisted, insertOtpCode } from '../../lib/d1'
import { generateCode, hashCode } from '../../lib/otp'
import { checkRateLimit } from '../../lib/rateLimit'
import { sendOtpEmail } from '../../lib/resend'
import { sqliteDatetimePlus } from '../../lib/time'
import { json } from '../../lib/http'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'

  let email = ''
  try {
    const body = (await request.json()) as { email?: unknown }
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  } catch {
    // corpo inválido — cai no mesmo retorno genérico abaixo
  }

  if (email && email.includes('@')) {
    const emailOk = await checkRateLimit(env.DB, {
      scope: `request-code:email:${email}`,
      limit: 3,
      windowMinutes: 15,
    })
    const ipOk = await checkRateLimit(env.DB, { scope: `request-code:ip:${ip}`, limit: 10, windowMinutes: 60 })

    if (emailOk && ipOk && (await isAllowlisted(env.DB, email))) {
      const code = generateCode()
      const codeHash = await hashCode(code, env.OTP_PEPPER)
      const expiresAt = sqliteDatetimePlus(Number(env.OTP_EXPIRY_MINUTES) * 60_000)
      await insertOtpCode(env.DB, { email, codeHash, expiresAt, requestIp: ip })
      try {
        await sendOtpEmail(env, email, code)
      } catch (err) {
        // Não deixa uma falha no envio (ex.: domínio ainda não verificado
        // na Resend) quebrar a resposta — o código já foi salvo no D1 e
        // a resposta genérica não deve variar por causa disso.
        console.error('Falha ao enviar e-mail de OTP', err)
      }
    }
    // E-mail fora da allowlist ou rate limit estourado: nenhuma ação além
    // daqui — sem insert, sem envio. A resposta é idêntica em todos os
    // casos, para nunca revelar se o e-mail está autorizado.
  }

  return json({ ok: true })
}
