export type Ets2Video = {
  videoId: string
  title: string
  thumbnailUrl: string
}

export async function getEts2Videos(): Promise<Ets2Video[]> {
  const res = await fetch('/api/ets2')
  const data = (await res.json()) as { videos: Ets2Video[] }
  return data.videos
}
