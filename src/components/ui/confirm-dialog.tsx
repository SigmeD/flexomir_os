import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FOSAction } from './fos-controls'
import './confirm-dialog.css'

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'ОК',
  cancelLabel = 'Отмена',
  busy = false,
  onConfirm,
  onCancel,
  onDismiss,
}: {
  open: boolean
  title: string
  body?: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  /** Optional close-only action for Escape, outside click, and the close icon. */
  onDismiss?: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.querySelector<HTMLElement>('.fos-confirm-dialog__actions button')?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) {
        event.preventDefault()
        ;(onDismiss ?? onCancel)()
        return
      }
      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled)'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [open, busy, onCancel, onDismiss])

  if (!open) return null
  return createPortal(
    <div className="fos-confirm-overlay" onMouseDown={event => { if (event.target === event.currentTarget && !busy) (onDismiss ?? onCancel)() }}>
      <div ref={dialogRef} className="fos-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="fos-confirm-title" aria-describedby={body ? 'fos-confirm-body' : undefined}>
      <button className="fos-confirm-dialog__close" type="button" aria-label="Закрыть" onClick={onDismiss ?? onCancel} disabled={busy}><span aria-hidden="true">×</span></button>
        <h2 id="fos-confirm-title">{title}</h2>
        {body && <p id="fos-confirm-body">{body}</p>}
        <div className="fos-confirm-dialog__actions">
          <FOSAction hierarchy="primary" disabled={busy} onClick={onConfirm}>{confirmLabel}</FOSAction>
          <FOSAction hierarchy="secondary" disabled={busy} onClick={onCancel}>{cancelLabel}</FOSAction>
        </div>
      </div>
    </div>,
    document.body,
  )
}
