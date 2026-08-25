const SITE_NAME = 'GalindoGamerBR'
const SITE_URL = 'https://galindogamerbr.com.br'

type SeoData = { title?: string; description: string }

const DEFAULT_DESCRIPTION =
  'Lives, séries, simuladores, games e a comunidade do GalindoGamerBR. Acompanhe os conteúdos e participe da Fazenda Nova Aliança.'

const ROUTES: Record<string, SeoData> = {
  '/': { description: DEFAULT_DESCRIPTION },
  '/boasvindas': { title: 'Boas vindas', description: 'Conheça o GalindoGamerBR e descubra como participar dos conteúdos, da fazenda e da comunidade.' },
  '/conteudos': { title: 'Conteúdos', description: 'Assista às séries, lives e vídeos de simuladores e games do canal GalindoGamerBR.' },
  '/fazenda': { title: 'Fazenda Nova Aliança', description: 'Conheça a Fazenda Nova Aliança no Farming Simulator 25 e saiba como participar do servidor e da comunidade.' },
  '/mods': { title: 'Mods da Fazenda', description: 'Baixe e sincronize os mods oficiais usados no servidor da Fazenda Nova Aliança no Farming Simulator 25.' },
  '/comunidade': { title: 'Comunidade', description: 'Entre nos canais oficiais e faça parte da comunidade GalindoGamerBR.' },
  '/sobre': { title: 'Sobre', description: 'Conheça Galindo, a história do canal GalindoGamerBR e a paixão por simuladores, games e comunidade.' },
  '/parceiros': { title: 'Parceiros', description: 'Conheça os parceiros do GalindoGamerBR e as possibilidades de parceria com o canal.' },
  '/privacidade': { title: 'Política de Privacidade', description: 'Saiba como o site GalindoGamerBR trata dados e protege a privacidade dos visitantes.' },
  '/termos': { title: 'Termos de Uso', description: 'Consulte os termos e condições de uso do site GalindoGamerBR.' },
  '/creditos': { title: 'Créditos', description: 'Conheça os créditos do portal GalindoGamerBR, desenvolvido por Pedro Henrique Moreira, e as atribuições dos recursos visuais utilizados.' },
  '/mapa-do-site': { title: 'Mapa do Site', description: 'Encontre todas as páginas e seções do site oficial GalindoGamerBR.' },
}

const ALIASES: Record<string, string> = {
  '/boas-vindas': '/boasvindas',
  '/comece-aqui': '/boasvindas',
  '/jogos': '/conteudos',
}

class ContentHandler implements HTMLRewriterElementContentHandlers {
  constructor(private readonly value: string) {}
  element(element: Element) {
    element.setAttribute('content', this.value)
  }
}

class HrefHandler implements HTMLRewriterElementContentHandlers {
  constructor(private readonly value: string) {}
  element(element: Element) {
    element.setAttribute('href', this.value)
  }
}

class TitleHandler implements HTMLRewriterElementContentHandlers {
  constructor(private readonly value: string) {}
  element(element: Element) {
    element.setInnerContent(this.value)
  }
}

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next()
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html')) return response

  const requestPath = new URL(context.request.url).pathname
  const normalizedPath = requestPath !== '/' ? requestPath.replace(/\/$/, '') : requestPath
  const canonicalPath = ALIASES[normalizedPath] ?? normalizedPath
  const isAdmin = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')
  const data = ROUTES[canonicalPath] ?? {
    title: 'Página não encontrada',
    description: 'A página que você procura não foi encontrada.',
  }
  const title = data.title ? `${data.title} | ${SITE_NAME}` : SITE_NAME
  const canonical = `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`
  const robots = isAdmin || !ROUTES[canonicalPath] ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  return new HTMLRewriter()
    .on('title', new TitleHandler(title))
    .on('link[rel="canonical"]', new HrefHandler(canonical))
    .on('meta[name="description"]', new ContentHandler(data.description))
    .on('meta[name="robots"]', new ContentHandler(robots))
    .on('meta[property="og:title"]', new ContentHandler(title))
    .on('meta[property="og:description"]', new ContentHandler(data.description))
    .on('meta[property="og:url"]', new ContentHandler(canonical))
    .on('meta[name="twitter:title"]', new ContentHandler(title))
    .on('meta[name="twitter:description"]', new ContentHandler(data.description))
    .transform(response)
}
