// gql.twitch.tv é o endpoint GraphQL interno que o próprio site da Twitch
// usa no navegador — não documentado oficialmente, mas não exige login/
// OAuth, só o Client-Id público que o frontend deles expõe (o mesmo valor
// que qualquer devtools de rede mostra numa aba twitch.tv aberta). Desde
// 2023 a API pública (Helix) exige OAuth do próprio streamer pra follower
// count, então essa é a alternativa keyless. Sujeito a mudar sem aviso.
const TWITCH_PUBLIC_CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko'

export async function fetchTwitchFollowers(login: string): Promise<number | null> {
  const res = await fetch('https://gql.twitch.tv/gql', {
    method: 'POST',
    headers: {
      'Client-Id': TWITCH_PUBLIC_CLIENT_ID,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `query { user(login: "${login}") { followers { totalCount } } }`,
    }),
  })
  if (!res.ok) return null

  const data = (await res.json()) as { data?: { user?: { followers?: { totalCount?: number } } } }
  return data.data?.user?.followers?.totalCount ?? null
}
