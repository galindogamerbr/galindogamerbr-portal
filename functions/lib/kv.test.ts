import { describe, expect, it, vi } from 'vitest'
import { putIfChanged } from './kv'

function fakeKv(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial }
  const get = vi.fn(async (key: string) => (key in store ? JSON.parse(store[key]) : null))
  const put = vi.fn(async (key: string, value: string) => {
    store[key] = value
  })
  return { store, get, put } as unknown as KVNamespace & { store: Record<string, string>; get: typeof get; put: typeof put }
}

describe('putIfChanged', () => {
  it('grava quando não tinha nada em cache ainda', async () => {
    const kv = fakeKv()
    await putIfChanged(kv, 'k', { a: 1 })
    expect(kv.put).toHaveBeenCalledTimes(1)
    expect(kv.store.k).toBe(JSON.stringify({ a: 1 }))
  })

  it('não grava quando o valor é igual ao já armazenado', async () => {
    const kv = fakeKv({ k: JSON.stringify({ a: 1 }) })
    await putIfChanged(kv, 'k', { a: 1 })
    expect(kv.put).not.toHaveBeenCalled()
  })

  it('grava quando o valor muda', async () => {
    const kv = fakeKv({ k: JSON.stringify({ a: 1 }) })
    await putIfChanged(kv, 'k', { a: 2 })
    expect(kv.put).toHaveBeenCalledTimes(1)
    expect(kv.store.k).toBe(JSON.stringify({ a: 2 }))
  })

  it('chaves diferentes não se afetam', async () => {
    const kv = fakeKv({ k1: JSON.stringify({ a: 1 }) })
    await putIfChanged(kv, 'k2', { a: 1 })
    expect(kv.put).toHaveBeenCalledTimes(1)
    expect(kv.store.k2).toBe(JSON.stringify({ a: 1 }))
  })
})
