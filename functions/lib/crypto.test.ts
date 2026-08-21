import { describe, expect, it } from 'vitest'
import { timingSafeEqual } from './crypto'

describe('timingSafeEqual', () => {
  it('retorna true pra strings idênticas', () => {
    expect(timingSafeEqual('abc123', 'abc123')).toBe(true)
  })

  it('retorna false pra strings de mesmo tamanho mas conteúdo diferente', () => {
    expect(timingSafeEqual('abc123', 'abc124')).toBe(false)
  })

  it('retorna false pra strings de tamanho diferente, sem lançar', () => {
    expect(timingSafeEqual('abc', 'abcdef')).toBe(false)
  })

  it('retorna true pra duas strings vazias', () => {
    expect(timingSafeEqual('', '')).toBe(true)
  })

  it('é sensível a maiúsculas/minúsculas', () => {
    expect(timingSafeEqual('Abc123', 'abc123')).toBe(false)
  })
})
