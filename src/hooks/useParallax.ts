import { useEffect, useRef } from 'react'

// Parallax simples: a imagem se move mais devagar que o scroll, ancorada
// ao pai (o hero). scale extra evita revelar bordas vazias no movimento.
export function useParallax<T extends HTMLElement>(factor = 0.2) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    const parent = node?.parentElement
    if (!node || !parent) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function handleScroll() {
      const rect = parent!.getBoundingClientRect()
      node!.style.transform = `translateY(${rect.top * factor}px) scale(1.15)`
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [factor])

  return ref
}
