// Parser mínimo do feed Atom que o YouTube manda via WebSub — evita
// puxar uma dependência de parser XML completo só pra extrair um campo.
// Payload de exemplo: https://developers.google.com/youtube/v3/guides/push_notifications
export function extractVideoId(atomXml: string): string | null {
  const match = atomXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
  return match ? match[1] : null
}

export function extractChannelId(atomXml: string): string | null {
  const match = atomXml.match(/<yt:channelId>([^<]+)<\/yt:channelId>/)
  return match ? match[1] : null
}
