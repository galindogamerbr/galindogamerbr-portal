export interface Env {
  // http://host:porta do portal do game server (FS25_PORTAL_ORIGIN, ver
  // README) — nunca commitado, só wrangler secret em produção e .dev.vars
  // local. Sem TLS próprio na porta customizada (comum em portal de servidor
  // de jogo) — o fetch aqui é http:// de propósito; quem fala HTTPS com o
  // visitante é o Custom Domain do Worker (fs25.galindogamerbr.com.br),
  // TLS terminado na borda da Cloudflare antes de chegar aqui.
  FS25_PORTAL_ORIGIN: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.FS25_PORTAL_ORIGIN) {
      return new Response('FS25_PORTAL_ORIGIN não configurado', { status: 500 })
    }

    const origin = new URL(env.FS25_PORTAL_ORIGIN)
    const incoming = new URL(request.url)
    const targetUrl = new URL(incoming.pathname + incoming.search, origin)

    // Host precisa apontar pro host de origem, não fs25.galindogamerbr.com.br
    // — a maioria dos servidores web valida/roteia por esse header.
    const proxyHeaders = new Headers(request.headers)
    proxyHeaders.set('host', origin.host)

    const hasBody = request.method !== 'GET' && request.method !== 'HEAD'

    // redirect: 'manual' — deixa a gente reescrever o Location abaixo em vez
    // do fetch() seguir o redirect sozinho e esconder isso do navegador.
    const originResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body: hasBody ? request.body : undefined,
      redirect: 'manual',
    })

    const responseHeaders = new Headers(originResponse.headers)

    // Sempre reescreve Location pro domínio público, independente de bater
    // com FS25_PORTAL_ORIGIN — confirmado na prática que o GIANTS Dedicated
    // Server responde com Location apontando pro host/porta que ele mesmo
    // tem configurado internamente (não necessariamente igual ao origin
    // real). Reconstrói a partir de incoming.origin (não seta .host direto:
    // por spec, atribuir .host sem porta explícita NÃO limpa uma porta já
    // existente na URL, então a porta antiga vazava mesmo depois da troca).
    const location = responseHeaders.get('location')
    if (location) {
      try {
        const redirectUrl = new URL(location, targetUrl)
        const rewritten = new URL(redirectUrl.pathname + redirectUrl.search + redirectUrl.hash, incoming.origin)
        responseHeaders.set('location', rewritten.toString())
      } catch {
        // Location inválida — deixa como veio, não é motivo pra falhar a resposta inteira.
      }
    }

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers: responseHeaders,
    })
  },
} satisfies ExportedHandler<Env>
