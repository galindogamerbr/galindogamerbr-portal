export type InstagramStatus = {
  connected: boolean
  username: string | null
  avatarUrl: string | null
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

export async function connectInstagram(accessToken: string, igUserId: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/admin/instagram/connect', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ accessToken, igUserId }),
  })
  if (res.ok) return { ok: true }
  const data = (await res.json().catch(() => null)) as { error?: string } | null
  return { ok: false, error: data?.error ?? 'unknown_error' }
}
