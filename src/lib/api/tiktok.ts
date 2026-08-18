export type TiktokStatus = { connected: boolean; updatedAt: string | null }

export async function getTiktokStatus(): Promise<TiktokStatus> {
  const res = await fetch('/api/admin/tiktok/status')
  return res.json() as Promise<TiktokStatus>
}
