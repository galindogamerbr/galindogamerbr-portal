// Wrappers do cliente para /api/auth/*. Nunca envolvem segredos — o
// Worker é a única camada que fala com Resend/D1/hash de código.

type OkResponse = { ok: true } | { ok: false }

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  return res.json() as Promise<T>
}

export function requestCode(email: string) {
  return postJson<OkResponse>('/api/auth/request-code', { email })
}

export function verifyCode(email: string, code: string) {
  return postJson<OkResponse>('/api/auth/verify-code', { email, code })
}

export function logout() {
  return postJson<OkResponse>('/api/auth/logout', {})
}

export async function me(): Promise<{ email: string } | null> {
  const res = await fetch('/api/auth/me', { credentials: 'include' })
  if (!res.ok) return null
  return res.json() as Promise<{ email: string }>
}
