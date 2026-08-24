import type { Env } from './env'
import { otpEmailHtml, partnershipEmailHtml, type PartnershipSubmission } from './emailTemplates'
import { fetchWithTimeout } from './http'

const FROM_ADDRESS = 'GalindoGamerBR <acesso@galindogamerbr.com.br>'
const FROM_ADDRESS_PREVIEW = 'GalindoGamerBR (preview) <acesso-preview@galindogamerbr.com.br>'
const PARTNERSHIP_TO = 'parcerias@galindogamerbr.com.br'
const PARTNERSHIP_FROM = 'GalindoGamerBR <parcerias@galindogamerbr.com.br>'
const PARTNERSHIP_FROM_PREVIEW = 'GalindoGamerBR (preview) <parcerias-preview@galindogamerbr.com.br>'

export async function sendOtpEmail(env: Env, to: string, code: string): Promise<void> {
  if (env.ENVIRONMENT === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[dev] Código OTP para ${to}: ${code}`)
    return
  }

  const res = await fetchWithTimeout('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.ENVIRONMENT === 'preview' ? FROM_ADDRESS_PREVIEW : FROM_ADDRESS,
      to,
      subject: 'Seu código de acesso — GalindoGamerBR',
      html: otpEmailHtml(code, env.OTP_EXPIRY_MINUTES),
    }),
  })

  if (!res.ok) {
    throw new Error(`Falha ao enviar e-mail via Resend: ${res.status}`)
  }
}

export async function sendPartnershipEmail(env: Env, submission: PartnershipSubmission): Promise<void> {
  if (env.ENVIRONMENT === 'development') {
    // eslint-disable-next-line no-console
    console.log(`
[dev] Prévia do e-mail de parceria
Para: ${PARTNERSHIP_TO}
Responder para: ${submission.email}
Assunto: Parceria — ${submission.company}

Empresa / marca: ${submission.company}
Responsável: ${submission.name}
E-mail: ${submission.email}
WhatsApp: ${submission.phone || '—'}
Tipo de parceria: ${submission.partnershipType}

Mensagem:
${submission.message}
`)
    return
  }

  const res = await fetchWithTimeout('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.ENVIRONMENT === 'preview' ? PARTNERSHIP_FROM_PREVIEW : PARTNERSHIP_FROM,
      to: PARTNERSHIP_TO,
      // Responder o e-mail já vai direto pro visitante, sem precisar copiar o endereço dele à mão.
      reply_to: submission.email,
      subject: `Parceria — ${submission.name}`,
      html: partnershipEmailHtml(submission),
    }),
  })

  if (!res.ok) {
    throw new Error(`Falha ao enviar e-mail de parceria via Resend: ${res.status}`)
  }
}
