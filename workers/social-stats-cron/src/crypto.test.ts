import { describe, expect, it } from 'vitest'
import { timingSafeEqual } from './crypto'

describe('timingSafeEqual', () => {
  it('retorna true pra strings idênticas', () => {
    expect(timingSafeEqual('trigger-secret', 'trigger-secret')).toBe(true)
  })

  it('retorna false pra strings de mesmo tamanho mas conteúdo diferente', () => {
    expect(timingSafeEqual('trigger-secret', 'trigger-secreu')).toBe(false)
  })

  it('retorna false pra strings de tamanho diferente, sem lançar', () => {
    expect(timingSafeEqual('abc', 'abcdef')).toBe(false)
  })
})
