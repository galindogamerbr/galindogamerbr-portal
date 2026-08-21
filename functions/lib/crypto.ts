// Comparação em tempo constante — evita timing attack em qualquer lugar que
// compare segredo/assinatura contra valor de request (código OTP, assinatura
// de cookie de sessão, HMAC de webhook). `===` normal sai mais cedo no
// primeiro caractere diferente, vazando (por tempo de resposta) quantos
// caracteres do início bateram.
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
