import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from './icons'
import './Modal.css'

interface Props {
  open: boolean
  onClose: () => void
  children: ReactNode
  label: string
  size?: 'md' | 'lg'
  closeLabel?: string
}

export default function Modal({ open, onClose, children, label, size = 'md', closeLabel }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const nodes = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    const id = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')
      target?.focus()
    }, 80)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(id)
      prevFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal" role="presentation">
      <div className="modal__scrim" onClick={onClose} />
      <div
        ref={panelRef}
        className={`modal__panel modal__panel--${size} glass glass--sheen`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button
          type="button"
          className="modal__close icon-btn"
          onClick={onClose}
          aria-label={closeLabel ?? 'Close'}
        >
          <IconClose size={18} />
        </button>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
