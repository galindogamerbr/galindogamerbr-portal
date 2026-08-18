import { BROWSER_USER_AGENT } from './constants'
import { parseAbbreviatedCount } from './parseCount'

// Sem API key: a página /about do canal embute "subscriberCountText" no
// JSON interno (ytInitialData), já abreviado ("1,2 mi de inscritos"). Mesmo
// princípio de getLiveVideoId em functions/lib/youtube.ts (UA de navegador,
// cache desligado) — se o YouTube mudar o formato desse campo, essa regex
// para de casar e a função só devolve null (o worker mantém o valor
// anterior em cache, ver src/index.ts).
export async function fetchYoutubeSubscribers(channelId: string): Promise<number | null> {
  const res = await fetch(`https://www.youtube.com/channel/${channelId}/about`, {
    headers: { 'user-agent': BROWSER_USER_AGENT },
    cf: { cacheTtl: 0, cacheEverything: false },
  })
  if (!res.ok) return null

  const body = await res.text()
  const match =
    body.match(/"subscriberCountText":\{"simpleText":"([^"]+)"\}/) ??
    body.match(/"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/)
  if (!match) return null

  return parseAbbreviatedCount(match[1])
}
