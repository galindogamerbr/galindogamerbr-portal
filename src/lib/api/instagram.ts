export type InstagramStatus = {
  connected: boolean
  updatedAt: string | null
  expiresAt: string | null
}

export async function getInstagramStatus(): Promise<InstagramStatus> {
  const res = await fetch('/api/admin/instagram/status')
  return res.json() as Promise<InstagramStatus>
}
