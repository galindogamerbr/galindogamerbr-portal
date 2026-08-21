// Comparação em tempo constante — evita timing attack ao validar o secret
// do gatilho HTTP manual (CRON_TRIGGER_SECRET). Mesma lógica de
// functions/lib/crypto.ts no site principal; duplicada aqui porque esse
// worker é um deploy separado, sem import compartilhado entre os dois.
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
