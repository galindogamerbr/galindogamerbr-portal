type PageBackgroundProps = {
  image: string
  // Degradê escuro sobre a imagem (sintaxe de linear-gradient CSS). Página
  // que precisar de um contraste diferente passa o seu.
  overlay?: string
  // Ponto de ancoragem do background-position (sintaxe CSS). Página com um
  // elemento importante (ex: rosto numa foto) perto de uma borda em vez do
  // centro passa a sua — o cover ainda corta as bordas em telas com aspect
  // ratio diferente do da imagem, então o corte precisa sobrar do lado sem
  // conteúdo relevante.
  position?: string
}

const DEFAULT_OVERLAY = 'linear-gradient(#03070b40, #03070b40)'

// Camada fixa cobrindo a tela inteira, atrás do conteúdo — o fundo padrão
// de todas as páginas vem do Layout (ver Layout.tsx); uma página específica
// pode sobrepor renderizando seu próprio <PageBackground>, que vence por
// vir depois no DOM (mesmo z-index, mesma stacking context). position:fixed
// (não background-attachment:fixed direto no body/numa div de conteúdo)
// porque esse último tem suporte inconsistente entre navegadores e, em
// conteúdo bem mais alto que largo, faz o background-size:cover dar um
// zoom gigante pra tentar cobrir a altura inteira da página em vez da tela.
export function PageBackground({ image, overlay = DEFAULT_OVERLAY, position = 'center top' }: PageBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 bg-bg"
      style={{
        backgroundImage: `${overlay}, url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
