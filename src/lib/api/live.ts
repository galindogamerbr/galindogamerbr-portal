export type LiveStatus = {
  isLive: boolean
  videoId: string | null
  title: string | null
  thumbnailUrl: string | null
  updatedAt: string | null
}

export async function getLiveStatus(): Promise<LiveStatus> {
  const res = await fetch('/api/live')
  return res.json() as Promise<LiveStatus>
}
