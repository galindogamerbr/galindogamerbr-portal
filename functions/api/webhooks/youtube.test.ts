import { describe, expect, it } from 'vitest'
import { verifyHmacSha1 } from './youtube'

async function signSha1(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `sha1=${hex}`
}

describe('verifyHmacSha1 (WebSub do YouTube)', () => {
  const secret = 'test-pubsub-secret'
  const body = '<feed><entry><yt:videoId>abc123</yt:videoId></entry></feed>'

  it('aceita assinatura válida', async () => {
    const header = await signSha1(secret, body)
    expect(await verifyHmacSha1(secret, body, header)).toBe(true)
  })

  it('rejeita assinatura assinada com outro secret', async () => {
    const header = await signSha1('secret-errado', body)
    expect(await verifyHmacSha1(secret, body, header)).toBe(false)
  })

  it('rejeita corpo alterado depois de assinado', async () => {
    const header = await signSha1(secret, body)
    expect(await verifyHmacSha1(secret, body + '<extra/>', header)).toBe(false)
  })

  it('rejeita header ausente', async () => {
    expect(await verifyHmacSha1(secret, body, null)).toBe(false)
  })

  it('rejeita header sem o prefixo sha1=', async () => {
    expect(await verifyHmacSha1(secret, body, 'deadbeef')).toBe(false)
  })
})
