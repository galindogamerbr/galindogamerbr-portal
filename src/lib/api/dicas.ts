export type DicasVideo = {
  videoId: string
  title: string
  thumbnailUrl: string
}

export async function getDicasVideos(): Promise<DicasVideo[]> {
  const res = await fetch('/api/dicas')
  const data = (await res.json()) as { videos: DicasVideo[] }
  return data.videos
}
