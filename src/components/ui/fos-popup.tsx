import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FosPopupSurface, type FosPopupSurfaceProps } from './fos-popup-surface'
import { FosPopupRows } from './fos-popup-rows'
import './fos-popup.css'

export interface FosPopupItem { id: string; label: string; disabled?: boolean; reason?: string; icon?: ReactNode; testId?: string }
type Selection = { mode: 'navigation' | 'listbox'; selectedId?: string; actionPreview?: never }
  | { mode: 'actions'; selectedId?: never; actionPreview?: 'account-hover-v0.3' }
type RowInput = { items: readonly FosPopupItem[]; onSelect: (id: string) => void; semanticRows?: never }
  | { mode: 'listbox'; semanticRows: ReactNode; items?: never; onSelect?: never }
export type FosPopupProps = Omit<FosPopupSurfaceProps, 'children' | 'onSelect'> & Selection & RowInput & {
  header?: ReactNode
  footer?: ReactNode
  rowClassName?: string
  labelClassName?: string
  iconClassName?: string
  rowsClassName?: string
  lensTestId?: string
  wrapRows?: (rows: ReactNode) => ReactNode
}

/** Owner-approved Account action preview; material and frozen Rows stay canonical. */
export const FosPopup = forwardRef<HTMLDivElement, FosPopupProps>(function FosPopup({
  mode, selectedId, actionPreview, items, onSelect, semanticRows, header, footer, rowClassName = '', labelClassName, iconClassName,
  rowsClassName, lensTestId, wrapRows, className = '', ...props
}, ref) {
  const [activatedId, setActivatedId] = useState<string>()
  const [previewId, setPreviewId] = useState<string>()
  const [previewVisible, setPreviewVisible] = useState(false)
  const previewVisibleRef = useRef(false)
  const previewRows = useRef<HTMLDivElement | null>(null)
  const previewEnabled = mode === 'actions' && actionPreview === 'account-hover-v0.3'
  useLayoutEffect(() => { if (props['data-state'] !== 'closed') setActivatedId(undefined) }, [props['data-state']])
  useLayoutEffect(() => {
    setPreviewId(undefined)
    setPreviewVisible(false)
    previewVisibleRef.current = false
    if (previewEnabled && props['data-state'] === 'closed') setActivatedId(undefined)
  }, [previewEnabled, props['data-state']])
  useEffect(() => {
    if (!previewEnabled || previewVisible || !previewId) return
    // Keep the SAME lens during its fade. A re-entry cancels this cleanup;
    // reduced motion has no transition and removes the preview immediately.
    let current = true
    const animations = previewRows.current?.getAnimations() ?? []
    void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      // Cancellation can resolve before React flushes passive-effect cleanup.
      // Pointer intent is synchronous, so an old fade cannot clear a re-entry.
      if (current && !previewVisibleRef.current) setPreviewId(undefined)
    })
    return () => { current = false }
  }, [previewEnabled, previewVisible, previewId])
  useLayoutEffect(() => {
    // Frozen Rows own overlap while the lens exists. The experiment owns removal
    // of its transient optics when there is no preview/activation to render.
    if (!previewEnabled || (!previewId && !activatedId)) {
      previewRows.current?.querySelectorAll<HTMLElement>('[data-popup-label], [data-popup-icon]').forEach(element => {
        element.style.removeProperty('--fos-sidebar-label-scale')
        element.style.removeProperty('--fos-sidebar-icon-scale')
      })
    }
  }, [previewEnabled, previewId, activatedId, props['data-state']])
  const preview = (event: PointerEvent<HTMLDivElement>) => {
    previewRows.current = event.currentTarget
    const row = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-popup-item]') : null
    const hover = (event.pointerType === 'mouse' || event.pointerType === 'pen') && event.buttons === 0
    const target = hover && props['data-state'] !== 'closed' && row && event.currentTarget.contains(row)
      && !row.matches(':disabled, [data-disabled], [aria-disabled="true"]') ? row.dataset.popupItem : undefined
    if (target) setPreviewId(target)
    previewVisibleRef.current = !!target
    setPreviewVisible(!!target)
  }
  const hidePreview = () => { previewVisibleRef.current = false; setPreviewVisible(false) }
  const clearPreview = () => { hidePreview(); setPreviewId(undefined) }
  const activate = (item: FosPopupItem) => {
    if (item.disabled) return
    // An action has no persistent selected state. First activation has no invented travel origin.
    if (mode === 'actions') { clearPreview(); setActivatedId(item.id) }
    onSelect?.(item.id)
  }
  const actionTarget = previewEnabled ? (props['data-state'] === 'closed' ? undefined : previewId ?? activatedId) : activatedId
  const rows = <FosPopupRows selectedId={mode === 'actions' ? actionTarget : selectedId} className={rowsClassName} lensTestId={lensTestId}
      onPointerMove={previewEnabled ? preview : undefined}
      onPointerLeave={previewEnabled ? hidePreview : undefined}>
      {semanticRows ?? items?.map(item => {
        const content = <>{item.icon && <span className={iconClassName} data-popup-icon="">{item.icon}</span>}<span className={labelClassName} data-popup-label="">{item.label}</span>{item.disabled && item.reason && <span className="fos-sr-only">: {item.reason}</span>}</>
        const attributes = { 'data-popup-item': item.id, 'data-testid': item.testId, className: 'fos-popup__item ' + rowClassName, title: item.reason }
        return mode === 'actions'
          ? <DropdownMenu.Item key={item.id} {...attributes} disabled={item.disabled} textValue={item.label}
              onPointerMove={previewEnabled ? event => event.preventDefault() : undefined}
              onPointerLeave={previewEnabled ? event => event.preventDefault() : undefined}
              onSelect={() => activate(item)}>{content}</DropdownMenu.Item>
          : <FosButtonRoot family="option" key={item.id} {...attributes} type="button" role={mode === 'listbox' ? 'option' : undefined}
              aria-selected={mode === 'listbox' ? selectedId === item.id : undefined}
              aria-current={mode === 'navigation' && selectedId === item.id ? 'page' : undefined}
              tabIndex={mode === 'listbox' ? -1 : undefined} disabled={item.disabled} onClick={() => activate(item)}>{content}</FosButtonRoot>
      })}
    </FosPopupRows>
  return <FosPopupSurface {...props} ref={ref}
    onKeyDownCapture={event => { props.onKeyDownCapture?.(event); if (previewEnabled) clearPreview() }}
    onPointerDownCapture={event => { props.onPointerDownCapture?.(event); if (previewEnabled && event.pointerType === 'touch') clearPreview() }}
    role={props.role ?? (mode === 'actions' ? 'menu' : mode === 'listbox' ? 'listbox' : undefined)}
    data-fos-popup={mode} data-action-preview={previewEnabled ? 'account-hover-v0.3' : undefined}
    data-preview-visible={previewEnabled ? props['data-state'] !== 'closed' && (previewVisible || !!activatedId) : undefined} className={'fos-popup ' + className}>
    {header}
    {wrapRows ? wrapRows(rows) : rows}
    {footer}
  </FosPopupSurface>
})
