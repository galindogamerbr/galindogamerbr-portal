export type FlagshipVideo = {
  videoId: string
  title: string
  thumbnailUrl: string
}

export async function getFlagshipVideos(): Promise<FlagshipVideo[]> {
  const res = await fetch('/api/flagship')
  const data = (await res.json()) as { videos: FlagshipVideo[] }
  return data.videos
}
