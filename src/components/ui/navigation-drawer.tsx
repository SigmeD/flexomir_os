import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { SidebarNav, type SidebarNavItem } from './sidebar-nav'
import './navigation-drawer.css'

export interface NavigationDrawerProps {
  items: readonly SidebarNavItem[]
  activeId: string
  onSelect: (id: string) => void
  /** Accessible name of modal navigation surface, e.g. "Меню клиента". */
  ariaLabel: string
  /** Supplied by parent/role, never hardcoded in the primitive. */
  footerText: string
  triggerLabel?: string
}

/**
 * GL-02B: shared floating Tablet/Mobile navigation drawer.
 *
 * Based on CURRENT Client V2 canonical overlays 1962:3834/1962:3854.
 * This is a 320/296px RIGHT-ALIGNED POPOVER below the 72px header,
 * NOT a full-height off-canvas panel. Manager uses the same primitive,
 * but its specific opened overlay has not yet been approved in Figma.
 *
 * Reuses accepted SidebarNav as one navigation + one neutral GlassLens.
 * Selection is controlled by the screen; this component never mutates routes.
 */
export function NavigationDrawer({
  items, activeId, onSelect, ariaLabel, footerText,
  triggerLabel = 'Открыть меню',
}: NavigationDrawerProps) {
  const dialogId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const exitTimer = useRef<number | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [rendered, setRendered] = useState(false)
  // Programmatic focus after pointer activation must not look like a keyboard
  // focus ring. Preserve a visible ring when the user switches to keyboard.
  const activationRef = useRef<'pointer' | 'keyboard'>('pointer')
  const [focusMode, setFocusMode] = useState<'pointer' | 'keyboard'>('pointer')

  function openMenu() {
    if (exitTimer.current !== undefined) window.clearTimeout(exitTimer.current)
    exitTimer.current = undefined
    setFocusMode(activationRef.current)
    setRendered(true)
    setOpen(true)
  }

  function closeMenu() {
    setOpen(false)
    if (exitTimer.current !== undefined) window.clearTimeout(exitTimer.current)
    exitTimer.current = window.setTimeout(() => {
      setRendered(false)
      exitTimer.current = undefined
    }, 200)
  }

  useEffect(() => () => {
    if (exitTimer.current !== undefined) window.clearTimeout(exitTimer.current)
  }, [])

  // Modal isolation and scroll lock are active only while the menu is OPEN,
  // including on resize, Escape, outside click, and unmount.
  useLayoutEffect(() => {
    if (!open) return
    const root = document.getElementById('root')
    const oldInert = root?.hasAttribute('inert') ?? false
    const priorBodyOverflow = document.body.style.overflow
    const priorHtmlOverflow = document.documentElement.style.overflow
    if (root) root.inert = true
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const first = dialogRef.current?.querySelector<HTMLButtonElement>('[aria-current="page"]')
      ?? dialogRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')
    first?.focus()

    return () => {
      if (root) root.inert = oldInert
      document.body.style.overflow = priorBodyOverflow
      document.documentElement.style.overflow = priorHtmlOverflow
      // Restore focus after inert is released, not while the background is inert.
      window.requestAnimationFrame(() => triggerRef.current?.focus())
    }
  }, [open])

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Tab' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      setFocusMode('keyboard')
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeMenu()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>(
      'button:not(:disabled):not([tabindex="-1"])',
    ) ?? [])
    if (!focusable.length) {
      event.preventDefault()
      dialogRef.current?.focus()
      return
    }
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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="fos-nav-drawer__trigger"
        data-testid="navigation-drawer-trigger"
        aria-label={open ? 'Закрыть меню' : triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onPointerDown={() => { activationRef.current = 'pointer' }}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') activationRef.current = 'keyboard'
        }}
        onClick={() => open ? closeMenu() : openMenu()}
      >
        <span aria-hidden="true" className="fos-nav-drawer__hamburger">
          <i /><i /><i />
        </span>
      </button>
      {rendered && createPortal(
        <div
          className="fos-nav-drawer__layer"
          data-testid="navigation-drawer-layer"
          data-state={open ? 'open' : 'closing'}
          aria-hidden={open ? undefined : true}
          inert={open ? undefined : true}
        >
          <div
            className="fos-nav-drawer__scrim"
            data-testid="navigation-drawer-scrim"
            aria-hidden="true"
            onClick={closeMenu}
          />
          <div
            id={dialogId}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            tabIndex={-1}
            data-focus-mode={focusMode}
            onPointerDown={() => setFocusMode('pointer')}
            onKeyDown={onDialogKeyDown}
            className="fos-nav-drawer__panel"
            data-testid="navigation-drawer-panel"
          >
            <div
              className="fos-nav-drawer__items"
              onClick={event => {
                // Even tapping the already-active route should dismiss the menu.
                // Let SidebarNav own route changes; the wrapper owns dismissal.
                const target = event.target
                if (target instanceof Element &&
                  target.closest('button.fos-sidebar-nav__item:not([disabled])')) {
                  closeMenu()
                }
              }}
            >
              <SidebarNav
                items={items}
                activeId={activeId}
                ariaLabel={ariaLabel + ' — разделы'}
                glassTone="neutral"
                onSelect={onSelect}
                style={{ width: '100%' }}
              />
            </div>
            <div className="fos-nav-drawer__separator" role="presentation" />
            <div className="fos-nav-drawer__footer">{footerText}</div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
