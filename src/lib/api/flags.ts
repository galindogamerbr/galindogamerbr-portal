export async function getFlag(key: string): Promise<boolean> {
  const res = await fetch(`/api/admin/flags/${key}`)
  if (!res.ok) return false
  const data = (await res.json()) as { enabled?: boolean }
  return data.enabled ?? false
}

export async function setFlag(key: string, enabled: boolean): Promise<void> {
  await fetch(`/api/admin/flags/${key}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ enabled }),
  })
}
