import { describe, expect, it } from 'vitest'
import { verifyHmacSha256 } from './instagram'

async function signSha256(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `sha256=${hex}`
}

describe('verifyHmacSha256 (Webhooks da Meta)', () => {
  const secret = 'test-app-secret'
  const body = JSON.stringify({ object: 'instagram', entry: [{ id: '123', changes: [] }] })

  it('aceita assinatura válida', async () => {
    const header = await signSha256(secret, body)
    expect(await verifyHmacSha256(secret, body, header)).toBe(true)
  })

  it('rejeita assinatura assinada com outro secret (ex.: App Secret errado)', async () => {
    const header = await signSha256('secret-errado', body)
    expect(await verifyHmacSha256(secret, body, header)).toBe(false)
  })

  it('rejeita corpo alterado depois de assinado', async () => {
    const header = await signSha256(secret, body)
    expect(await verifyHmacSha256(secret, body + '{}', header)).toBe(false)
  })

  it('rejeita header ausente', async () => {
    expect(await verifyHmacSha256(secret, body, null)).toBe(false)
  })

  it('rejeita header sem o prefixo sha256=', async () => {
    expect(await verifyHmacSha256(secret, body, 'deadbeef')).toBe(false)
  })
})
