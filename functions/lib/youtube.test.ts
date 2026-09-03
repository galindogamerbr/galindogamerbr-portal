import { afterEach, describe, expect, it, vi } from 'vitest'
import { extractLiveVideoId, resolveChannelLiveState, type VideoState } from './youtube'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('extractLiveVideoId', () => {
  it('lê o vídeo ao vivo pelo canonical', () => {
    const html = '<link rel="canonical" href="https://www.youtube.com/watch?v=canonical123">'

    expect(extractLiveVideoId(html)).toBe('canonical123')
  })

  it('usa os metadados da live quando o canonical aponta para o canal', () => {
    const html = [
      '<link rel="canonical" href="https://www.youtube.com/channel/UC123">',
      '"liveBroadcastDetails":{"isLiveNow":true,"startTimestamp":"2026-08-28T17:00:26+00:00"},',
      '"externalVideoId":"YVjQeKwLIUM"',
    ].join('')

    expect(extractLiveVideoId(html)).toBe('YVjQeKwLIUM')
  })

  it('não confunde vídeo offline com live', () => {
    const html = '"liveBroadcastDetails":{"isLiveNow":false},"externalVideoId":"offline123"'

    expect(extractLiveVideoId(html)).toBeNull()
  })

  it('revalida o cache offline e encontra uma live nova', async () => {
    const cached: VideoState = {
      videoId: 'oldVideo',
      title: 'Vídeo anterior',
      thumbnailUrl: 'https://i.ytimg.com/vi/oldVideo/maxresdefault.jpg',
      isLive: false,
      startedAt: null,
      viewerCount: null,
    }
    const get = vi.fn().mockResolvedValue(cached)
    const put = vi.fn().mockResolvedValue(undefined)
    const env = {
      PUBLIC_CACHE: { get, put },
      YOUTUBE_CHANNEL_ID: 'UC123',
      YOUTUBE_API_KEY: 'key',
    } as unknown as Parameters<typeof resolveChannelLiveState>[0]

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input)
        if (url.includes('/channel/UC123/live')) {
          return new Response('"liveBroadcastDetails":{"isLiveNow":true},"externalVideoId":"newLive"')
        }
        if (url.includes('/oembed?')) {
          return Response.json({ title: 'Live atual' })
        }
        if (url.includes('/youtube/v3/videos?')) {
          return Response.json({
            items: [{ liveStreamingDetails: { actualStartTime: '2026-08-28T17:00:26Z', concurrentViewers: '53' } }],
          })
        }
        throw new Error(`URL inesperada: ${url}`)
      }),
    )

    const state = await resolveChannelLiveState(env)

    expect(state).toMatchObject({ videoId: 'newLive', title: 'Live atual', isLive: true, viewerCount: 53 })
    expect(put).toHaveBeenCalledWith('youtube:live-state', expect.stringContaining('newLive'))
  })

  it('usa a API barata quando o scrape responde HTML sem a live', async () => {
    const cached: VideoState = {
      videoId: 'oldVideo',
      title: 'Vídeo anterior',
      thumbnailUrl: 'https://i.ytimg.com/vi/oldVideo/maxresdefault.jpg',
      isLive: false,
      startedAt: null,
      viewerCount: null,
    }
    const get = vi.fn().mockResolvedValue(cached)
    const put = vi.fn().mockResolvedValue(undefined)
    const env = {
      PUBLIC_CACHE: { get, put },
      YOUTUBE_CHANNEL_ID: 'UC123',
      YOUTUBE_API_KEY: 'key',
    } as unknown as Parameters<typeof resolveChannelLiveState>[0]

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input)
        if (url.includes('/channel/UC123/live')) {
          return new Response('<link rel="canonical" href="https://www.youtube.com/channel/UC123">')
        }
        if (url.includes('/youtube/v3/playlistItems?')) {
          return Response.json({
            items: [
              { snippet: { title: 'Live atual', resourceId: { videoId: 'newLive' } } },
              { snippet: { title: 'Vídeo anterior', resourceId: { videoId: 'oldVideo' } } },
            ],
          })
        }
        if (url.includes('/youtube/v3/videos?') && url.includes('id=newLive,oldVideo')) {
          return Response.json({
            items: [
              { id: 'newLive', liveStreamingDetails: { actualStartTime: '2026-09-02T21:00:00Z' } },
              {
                id: 'oldVideo',
                liveStreamingDetails: { actualStartTime: '2026-09-01T21:00:00Z', actualEndTime: '2026-09-01T23:00:00Z' },
              },
            ],
          })
        }
        if (url.includes('/oembed?')) return Response.json({ title: 'Live atual' })
        if (url.includes('/youtube/v3/videos?') && url.includes('id=newLive')) {
          return Response.json({
            items: [{ liveStreamingDetails: { actualStartTime: '2026-09-02T21:00:00Z', concurrentViewers: '50' } }],
          })
        }
        throw new Error(`URL inesperada: ${url}`)
      }),
    )

    const state = await resolveChannelLiveState(env)

    expect(state).toMatchObject({ videoId: 'newLive', title: 'Live atual', isLive: true, viewerCount: 50 })
    expect(put).toHaveBeenCalledWith('youtube:live-state', expect.stringContaining('newLive'))
  })
})
