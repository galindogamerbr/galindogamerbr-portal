import { useEffect, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = PropsWithChildren<{
  open: boolean
  onClose: () => void
  titleId?: string
  className?: string
}>

// Portal pro <body> — evita herdar stacking context de qualquer ancestral
// com transform/overflow (ex: o .hero-fade da Home), que quebraria um
// `fixed` posicionado dentro dele.
export function Modal({ open, onClose, titleId, className = '', children }: ModalProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const contentClassName = className || 'max-w-lg p-6 sm:p-8'

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-lg border border-line bg-panel shadow-2xl ${contentClassName}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
