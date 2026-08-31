import { normalizeSeoPath, ROUTE_SEO, SITE_NAME, SITE_URL } from '../src/lib/seo'

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
  const canonicalPath = normalizeSeoPath(requestPath)
  const isAdmin = canonicalPath === '/admin' || canonicalPath.startsWith('/admin/')
  const data = ROUTE_SEO[canonicalPath] ?? {
    title: 'Página não encontrada',
    description: 'A página que você procura não foi encontrada.',
  }
  const title = data.title ? `${data.title} | ${SITE_NAME}` : SITE_NAME
  const canonical = `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`
  const robots = isAdmin || !ROUTE_SEO[canonicalPath] ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

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
