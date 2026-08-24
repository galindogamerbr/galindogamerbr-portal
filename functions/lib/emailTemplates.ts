export function otpEmailHtml(code: string, expiryMinutes: string): string {
  return `<div style="font-family:Arial,sans-serif;background:#03070b;color:#f3f5f7;padding:32px">
  <h1 style="color:#d9b14f;font-size:20px;margin:0 0 16px">GalindoGamerBR — Código de acesso</h1>
  <p style="margin:0 0 24px;color:#9eacb9">Use o código abaixo para entrar no painel admin. Ele expira em ${expiryMinutes} minutos e só pode ser usado uma vez.</p>
  <div style="font-size:32px;font-weight:700;letter-spacing:0.3em;background:#08111a;border:1px solid #243443;border-radius:8px;padding:16px 24px;text-align:center">${code}</div>
  <p style="margin:24px 0 0;color:#9eacb9;font-size:12px">Se você não solicitou este código, pode ignorar este e-mail.</p>
</div>`
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

export type PartnershipSubmission = {
  company: string
  name: string
  email: string
  phone: string
  partnershipType: string
  message: string
}

export function partnershipEmailHtml({ company, name, email, phone, partnershipType, message }: PartnershipSubmission): string {
  return `<div style="font-family:Arial,sans-serif;background:#03070b;color:#f3f5f7;padding:32px">
  <h1 style="color:#d9b14f;font-size:20px;margin:0 0 16px">Novo contato de parceria — GalindoGamerBR</h1>
  <table style="width:100%;border-collapse:collapse;margin:0 0 24px">
    <tr><td style="color:#9eacb9;padding:4px 0;width:130px">Empresa / marca</td><td>${escapeHtml(company)}</td></tr>
    <tr><td style="color:#9eacb9;padding:4px 0;width:80px">Nome</td><td>${escapeHtml(name)}</td></tr>
    <tr><td style="color:#9eacb9;padding:4px 0">E-mail</td><td>${escapeHtml(email)}</td></tr>
    <tr><td style="color:#9eacb9;padding:4px 0">WhatsApp</td><td>${phone ? escapeHtml(phone) : '—'}</td></tr>
    <tr><td style="color:#9eacb9;padding:4px 0">Tipo de parceria</td><td>${escapeHtml(partnershipType)}</td></tr>
  </table>
  <div style="background:#08111a;border:1px solid #243443;border-radius:8px;padding:16px 20px;white-space:pre-wrap">${escapeHtml(message)}</div>
  <p style="margin:24px 0 0;color:#9eacb9;font-size:12px">Enviado pelo formulário de parceria em galindogamerbr.com.br — responda direto este e-mail para falar com ${escapeHtml(name)}.</p>
</div>`
}
