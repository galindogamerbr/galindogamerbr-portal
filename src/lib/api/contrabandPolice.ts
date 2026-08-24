export type ContrabandPoliceVideo = {
  videoId: string
  title: string
  thumbnailUrl: string
}

export async function getContrabandPoliceVideos(): Promise<ContrabandPoliceVideo[]> {
  const res = await fetch('/api/contraband-police')
  const data = (await res.json()) as { videos: ContrabandPoliceVideo[] }
  return data.videos
}
