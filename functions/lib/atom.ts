// Parser mínimo do feed Atom público do canal — evita puxar uma dependência
// de parser XML completo só pra extrair os vídeos. Vem ordenado do mais
// novo pro mais antigo; retorna todos pra quem for filtrando (ex.: pulando
// Shorts) precisar olhar além da primeira entrada.
export function extractVideoIds(atomXml: string): string[] {
  return Array.from(atomXml.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g), (m) => m[1])
}
