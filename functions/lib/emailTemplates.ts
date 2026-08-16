export function otpEmailHtml(code: string, expiryMinutes: string): string {
  return `<div style="font-family:Arial,sans-serif;background:#03070b;color:#f3f5f7;padding:32px">
  <h1 style="color:#d9b14f;font-size:20px;margin:0 0 16px">GalindoGamerBR — Código de acesso</h1>
  <p style="margin:0 0 24px;color:#9eacb9">Use o código abaixo para entrar no painel admin. Ele expira em ${expiryMinutes} minutos e só pode ser usado uma vez.</p>
  <div style="font-size:32px;font-weight:700;letter-spacing:0.3em;background:#08111a;border:1px solid #243443;border-radius:8px;padding:16px 24px;text-align:center">${code}</div>
  <p style="margin:24px 0 0;color:#9eacb9;font-size:12px">Se você não solicitou este código, pode ignorar este e-mail.</p>
</div>`
}
