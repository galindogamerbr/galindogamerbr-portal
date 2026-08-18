export type InstagramStatus = {
  connected: boolean
  username: string | null
  updatedAt: string | null
  expiresAt: string | null
}

export async function getInstagramStatus(): Promise<InstagramStatus> {
  const res = await fetch('/api/admin/instagram/status')
  return res.json() as Promise<InstagramStatus>
}

export async function disconnectInstagram(): Promise<void> {
  await fetch('/api/admin/instagram/disconnect', { method: 'POST' })
}
