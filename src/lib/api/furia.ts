export type FuriaVideo = {
  videoId: string
  title: string
  thumbnailUrl: string
}

export async function getFuriaVideos(): Promise<FuriaVideo[]> {
  const res = await fetch('/api/furia')
  const data = (await res.json()) as { videos: FuriaVideo[] }
  return data.videos
}
