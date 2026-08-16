import { useEffect, useRef } from 'react'

// Mesmo fator do script.js atual (comentário lá: "sem exagero") — a versão
// anterior deste hook usava um multiplicador ~7x maior por engano.
const TILT_DEG = 2.2

// Tilt 3D por ponteiro, igual ao efeito de .game/.platform-card/.stat/
// .live-card-art do script.js atual — pulado em touch e reduced-motion.
export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function handleMove(event: PointerEvent) {
      const rect = node!.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      const ry = x * TILT_DEG
      const rx = -y * TILT_DEG
      node!.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }

    function handleLeave() {
      node!.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
    }

    node.style.transition = 'transform 0.3s ease'
    node.addEventListener('pointermove', handleMove)
    node.addEventListener('pointerleave', handleLeave)
    return () => {
      node.removeEventListener('pointermove', handleMove)
      node.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  return ref
}
