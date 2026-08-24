type WelcomeVideoResponse = { videoId: string }
type AdminWelcomeVideoResponse = { videoId?: string; error?: string }

export async function getFarmWelcomeVideo(): Promise<string> {
  const res = await fetch('/api/farm/welcome-video')
  const data = (await res.json()) as WelcomeVideoResponse
  return data.videoId
}

export async function getAdminFarmWelcomeVideo(): Promise<string> {
  const res = await fetch('/api/admin/farm/welcome-video')
  const data = (await res.json()) as AdminWelcomeVideoResponse
  if (!res.ok || !data.videoId) throw new Error(data.error ?? 'fetch_failed')
  return data.videoId
}

export async function setFarmWelcomeVideo(video: string): Promise<{ ok: true; videoId: string } | { ok: false; error: string }> {
  const res = await fetch('/api/admin/farm/welcome-video', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ video }),
  })
  const data = (await res.json()) as AdminWelcomeVideoResponse
  if (!res.ok || !data.videoId) return { ok: false, error: data.error ?? 'save_failed' }
  return { ok: true, videoId: data.videoId }
}
