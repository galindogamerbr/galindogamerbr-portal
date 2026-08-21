import { describe, expect, it } from 'vitest'
import { generateCode, hashCode } from './otp'

describe('generateCode', () => {
  it('sempre gera 6 dígitos numéricos, zero-padded', () => {
    for (let i = 0; i < 100; i++) {
      expect(generateCode()).toMatch(/^\d{6}$/)
    }
  })
})

describe('hashCode', () => {
  it('é determinístico pro mesmo código e pepper', async () => {
    const a = await hashCode('123456', 'pepper')
    const b = await hashCode('123456', 'pepper')
    expect(a).toBe(b)
  })

  it('muda o hash se o código mudar', async () => {
    const a = await hashCode('123456', 'pepper')
    const b = await hashCode('654321', 'pepper')
    expect(a).not.toBe(b)
  })

  it('muda o hash se o pepper mudar (não dá pra pré-computar sem ele)', async () => {
    const a = await hashCode('123456', 'pepper-1')
    const b = await hashCode('123456', 'pepper-2')
    expect(a).not.toBe(b)
  })

  it('devolve hex de 64 caracteres (SHA-256)', async () => {
    const hash = await hashCode('123456', 'pepper')
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })
})
