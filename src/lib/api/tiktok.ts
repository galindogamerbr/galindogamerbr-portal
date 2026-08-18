export type TiktokStatus = { connected: boolean; username: string | null; updatedAt: string | null }

export async function getTiktokStatus(): Promise<TiktokStatus> {
  const res = await fetch('/api/admin/tiktok/status')
  return res.json() as Promise<TiktokStatus>
}

export async function disconnectTiktok(): Promise<void> {
  await fetch('/api/admin/tiktok/disconnect', { method: 'POST' })
}
