import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { SidebarNav, type SidebarNavItem } from './sidebar-nav'
import './navigation-drawer.css'

export interface NavigationDrawerProps {
  items: readonly SidebarNavItem[]
  activeId: string
  /** Updates the selected navigation item so the existing SidebarNav lens can travel.
   * Do NOT unmount/navigate the screen inside this callback: the lens must remain
   * mounted until it reaches the target. Use onSelectionSettled for route changes.
   */
  onSelect: (id: string) => void
  /** Optional route commit, called only AFTER the selection lens has settled.
   * Pass actual navigation here; omit for visual-only/demo selection.
   */
  onSelectionSettled?: (id: string) => void
  /** Selection lifecycle:
   * true (default): close after the approved lens spring reaches the new item.
   * false: keep menu open to compare sections; only scrim/Escape/trigger dismiss.
   * The route commit callback must not unmount the menu in keep-open mode.
   */
  closeOnSelection?: boolean
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
  items, activeId, onSelect, onSelectionSettled, closeOnSelection = true, ariaLabel, footerText,
  triggerLabel = 'Открыть меню',
}: NavigationDrawerProps) {
  const dialogId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const exitTimer = useRef<number | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const pendingIdRef = useRef<string | null>(null)
  const pendingRequestRef = useRef(0)
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
    pendingRequestRef.current += 1
    pendingIdRef.current = null
    setPendingId(null)
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

  function requestSelection(id: string) {
    // Never interrupt an in-flight lens transition by closing on a duplicate tap.
    if (pendingIdRef.current === id) return
    if (id === activeId && pendingIdRef.current === null) {
      if (closeOnSelection) closeMenu()
      return
    }
    pendingRequestRef.current += 1
    pendingIdRef.current = id
    setPendingId(id)
    // The host updates selected UI state; real routing belongs to onSelectionSettled.
    onSelect(id)
  }

  // Wait for the ACTUAL spring to report rest instead of using an arbitrary
  // 300/500ms delay. FosGlassMaterial already exposes data-motion-state and
  // the lens geometry, so no duplicate animation driver or changes to the
  // owner-approved SidebarNav are needed.
  useEffect(() => {
    if (!open || pendingId === null) return
    const dialog = dialogRef.current
    if (!dialog) return
    const requestId = pendingRequestRef.current
    let resolved = false
    let fallback: number | undefined

    const finish = () => {
      if (resolved || requestId !== pendingRequestRef.current) return
      resolved = true
      if (fallback !== undefined) window.clearTimeout(fallback)
      observer.disconnect()
      // Both modes wait for the SAME accepted spring. The alternative
      // inspection mode only clears pending state and leaves the menu open.
      if (closeOnSelection) {
        closeMenu()
      } else {
        pendingRequestRef.current += 1
        pendingIdRef.current = null
        setPendingId(null)
      }
      onSelectionSettled?.(pendingId)
    }

    const check = () => {
      if (resolved || requestId !== pendingRequestRef.current) return
      const selected = Array.from(dialog.querySelectorAll<HTMLButtonElement>(
        '.fos-sidebar-nav__item[aria-current="page"]',
      )).find(row => row.dataset.testid === 'sidebar-nav-' + pendingId)
      const lens = dialog.querySelector<HTMLElement>('[data-testid="sidebar-selected-lens"]')
      if (!selected || !lens) return
      const state = lens.dataset.motionState
      if (state !== 'settled' && state !== 'off') return
      // Also compare actual rendered positions: React may have just switched
      // aria-current while the spring still carries momentum from the old row.
      const selectedBox = selected.getBoundingClientRect()
      const lensBox = lens.getBoundingClientRect()
      if (Math.abs(selectedBox.top - lensBox.top) > 0.75) return
      finish()
    }

    const observer = new MutationObserver(check)
    observer.observe(dialog, {
      attributes: true,
      subtree: true,
      attributeFilter: ['aria-current', 'data-motion-state', 'data-travel-target', 'style'],
    })
    // Guard against a dead animation driver or a parent failing to update the
    // controlled activeId. Normal operation NEVER uses this timeout; the
    // spring's rest event wins. No infinite modal on unexpected errors.
    fallback = window.setTimeout(finish, 5000)
    check()

    return () => {
      observer.disconnect()
      if (fallback !== undefined) window.clearTimeout(fallback)
    }
  }, [open, pendingId, activeId, onSelectionSettled, closeOnSelection])

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
          data-selection-transition={pendingId !== null ? 'moving' : 'idle'}
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
                // SidebarNav calls requestSelection for a NEW route.
                // It intentionally does not dispatch onSelect on its already
                // selected row; dismiss that row here without interrupting
                // a pending spring transition.
                const target = event.target
                if (!(target instanceof Element)) return
                const button = target.closest<HTMLButtonElement>('button.fos-sidebar-nav__item:not([disabled])')
                if (closeOnSelection &&
                  button?.getAttribute('aria-current') === 'page' &&
                  pendingIdRef.current === null) {
                  closeMenu()
                }
              }}
            >
              <SidebarNav
                items={items}
                activeId={activeId}
                ariaLabel={ariaLabel + ' — разделы'}
                glassTone="neutral"
                onSelect={requestSelection}
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
