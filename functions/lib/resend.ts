import type { Env } from './env'
import { otpEmailHtml } from './emailTemplates'

const FROM_ADDRESS = 'GalindoGamerBR <acesso@galindogamerbr.com.br>'

export async function sendOtpEmail(env: Env, to: string, code: string): Promise<void> {
  if (env.ENVIRONMENT === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[dev] Código OTP para ${to}: ${code}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      subject: 'Seu código de acesso — GalindoGamerBR',
      html: otpEmailHtml(code, env.OTP_EXPIRY_MINUTES),
    }),
  })

  if (!res.ok) {
    throw new Error(`Falha ao enviar e-mail via Resend: ${res.status}`)
  }
}
