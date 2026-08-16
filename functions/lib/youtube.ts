import type { Env } from './env'

export type VideoState = {
  videoId: string
  title: string
  thumbnailUrl: string
  isLive: boolean
  startedAt: string | null
}

type VideosListResponse = {
  items?: Array<{
    id: string
    snippet: { title: string; liveBroadcastContent: 'live' | 'upcoming' | 'none'; thumbnails?: Record<string, { url: string }> }
    liveStreamingDetails?: { actualStartTime?: string }
  }>
}

// Única chamada que resolve se um vídeo está ao vivo agora — a API key
// nunca sai do Worker (nem no request, nem na resposta pro cliente).
export async function resolveVideoState(env: Env, videoId: string): Promise<VideoState | null> {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos')
  url.searchParams.set('part', 'snippet,liveStreamingDetails')
  url.searchParams.set('id', videoId)
  url.searchParams.set('key', env.YOUTUBE_API_KEY)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`YouTube videos.list falhou: ${res.status}`)

  const data = (await res.json()) as VideosListResponse
  const item = data.items?.[0]
  if (!item) return null

  return {
    videoId: item.id,
    title: item.snippet.title,
    thumbnailUrl:
      item.snippet.thumbnails?.maxres?.url ?? item.snippet.thumbnails?.high?.url ?? `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
    isLive: item.snippet.liveBroadcastContent === 'live',
    startedAt: item.liveStreamingDetails?.actualStartTime ?? null,
  }
}

type PlaylistItemsResponse = { items?: Array<{ contentDetails: { videoId: string } }> }
type ChannelsListResponse = { items?: Array<{ contentDetails: { relatedPlaylists: { uploads: string } } }> }

// Usado pela reconciliação periódica (rede de segurança do WebSub) —
// busca o vídeo mais recente do canal via a playlist de uploads, mais
// barato em quota do que search.list.
export async function getLatestUploadedVideoId(env: Env): Promise<string | null> {
  const channelUrl = new URL('https://www.googleapis.com/youtube/v3/channels')
  channelUrl.searchParams.set('part', 'contentDetails')
  channelUrl.searchParams.set('id', env.YOUTUBE_CHANNEL_ID)
  channelUrl.searchParams.set('key', env.YOUTUBE_API_KEY)

  const channelRes = await fetch(channelUrl)
  if (!channelRes.ok) throw new Error(`YouTube channels.list falhou: ${channelRes.status}`)
  const channelData = (await channelRes.json()) as ChannelsListResponse
  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails.relatedPlaylists.uploads
  if (!uploadsPlaylistId) return null

  const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
  playlistUrl.searchParams.set('part', 'contentDetails')
  playlistUrl.searchParams.set('playlistId', uploadsPlaylistId)
  playlistUrl.searchParams.set('maxResults', '1')
  playlistUrl.searchParams.set('key', env.YOUTUBE_API_KEY)

  const playlistRes = await fetch(playlistUrl)
  if (!playlistRes.ok) throw new Error(`YouTube playlistItems.list falhou: ${playlistRes.status}`)
  const playlistData = (await playlistRes.json()) as PlaylistItemsResponse
  return playlistData.items?.[0]?.contentDetails.videoId ?? null
}

// Reconcilia o live_state a partir de um videoId já conhecido (webhook)
// ou buscado (cron de segurança). Ver functions/lib/d1.ts para o upsert.
export async function reconcileFromVideoId(env: Env, videoId: string): Promise<VideoState | null> {
  return resolveVideoState(env, videoId)
}
