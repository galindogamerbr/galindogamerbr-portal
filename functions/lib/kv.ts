// Só escreve no KV se o valor mudou de verdade — evita gastar write (cota
// de 1.000/dia no free tier, bem mais apertada que os 100.000 reads/dia)
// reescrevendo o mesmo valor a cada ciclo de recomputação. Comparação por
// JSON.stringify: os valores usados aqui são sempre objetos pequenos e
// determinísticos (sem Date solto, sem undefined que mude de posição).
export async function putIfChanged<T>(kv: KVNamespace, key: string, value: T): Promise<void> {
  const current = await kv.get<T>(key, 'json')
  if (JSON.stringify(current) === JSON.stringify(value)) return
  await kv.put(key, JSON.stringify(value))
}
