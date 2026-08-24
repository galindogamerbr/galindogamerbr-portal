import { describe, expect, it } from 'vitest'
import { parseYouTubeVideoId } from './welcome-video'

describe('parseYouTubeVideoId', () => {
  const videoId = 'TcBrAo_A1Lc'

  it.each([
    videoId,
    `https://www.youtube.com/watch?v=${videoId}`,
    `https://youtu.be/${videoId}?si=example`,
    `https://www.youtube.com/embed/${videoId}`,
    `https://www.youtube.com/shorts/${videoId}`,
  ])('aceita %s', (value) => {
    expect(parseYouTubeVideoId(value)).toBe(videoId)
  })

  it.each(['https://vimeo.com/123456', 'https://youtube.com/watch?v=curto', 'video inválido'])('rejeita %s', (value) => {
    expect(parseYouTubeVideoId(value)).toBeNull()
  })
})
