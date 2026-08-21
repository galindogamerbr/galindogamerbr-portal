import { timingSafeEqual } from './crypto'

// Cookie de sessão: token opaco assinado `${sessionId}.${hmac}`. O HMAC é
// verificado primeiro (barato, rejeita cookies forjados sem tocar o D1);
// o sessionId só é consultado no banco depois, o que permite revogação
// instantânea — ao contrário de um JWT autocontido.

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function toBase64Url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function createSessionId(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return toBase64Url(bytes.buffer)
}

export async function signSessionId(sessionId: string, secret: string): Promise<string> {
  const key = await hmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(sessionId))
  return `${sessionId}.${toBase64Url(signature)}`
}

export async function verifyCookieValue(cookieValue: string, secret: string): Promise<string | null> {
  const [sessionId, signature] = cookieValue.split('.')
  if (!sessionId || !signature) return null
  const expected = await signSessionId(sessionId, secret)
  return timingSafeEqual(expected, cookieValue) ? sessionId : null
}

export function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null
  for (const part of cookieHeader.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

export function buildSetCookie(name: string, value: string, maxAgeSeconds: number): string {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`
}

export function buildClearCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}
