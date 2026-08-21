export function generateCode(): string {
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  // 0..999999, zero-padded — uso único, nunca reaproveitado (ver otp_codes.consumed_at).
  const code = bytes[0] % 1_000_000
  return code.toString().padStart(6, '0')
}

export async function hashCode(code: string, pepper: string): Promise<string> {
  const data = new TextEncoder().encode(`${code}:${pepper}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
