export type SnowrunnerVideo = {
  videoId: string
  title: string
  thumbnailUrl: string
}

export async function getSnowrunnerVideos(): Promise<SnowrunnerVideo[]> {
  const res = await fetch('/api/snowrunner')
  const data = (await res.json()) as { videos: SnowrunnerVideo[] }
  return data.videos
}
