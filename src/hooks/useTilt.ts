import { useEffect, useRef } from 'react'

const MAX_TILT_DEG = 8

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
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      const ry = (px - 0.5) * MAX_TILT_DEG * 2
      const rx = (0.5 - py) * MAX_TILT_DEG * 2
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
