import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FosPopupSurface, type FosPopupSurfaceProps } from './fos-popup-surface'
import { FosPopupRows } from './fos-popup-rows'
import './fos-popup.css'

export interface FosPopupItem { id: string; label: string; disabled?: boolean; reason?: string; icon?: ReactNode; testId?: string }
type Selection = { mode: 'navigation' | 'listbox'; selectedId?: string }
  | { mode: 'actions'; selectedId?: never }
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
  /** Adapter is committing a selection and waiting for the canonical lens to rest. */
  selectionPending?: boolean
}

/** Owner-approved v0.3 hover across popup adapters; frozen material/Rows stay canonical. */
export const FosPopup = forwardRef<HTMLDivElement, FosPopupProps>(function FosPopup({
  mode, selectedId, selectionPending = false, items, onSelect, semanticRows, header, footer, rowClassName = '', labelClassName, iconClassName,
  rowsClassName, lensTestId, wrapRows, className = '', ...props
}, ref) {
  const [activatedId, setActivatedId] = useState<string>()
  const [previewId, setPreviewId] = useState<string>()
  const [previewVisible, setPreviewVisible] = useState(false)
  const previewVisibleRef = useRef(false)
  const previewRows = useRef<HTMLDivElement | null>(null)
  const [baselineId, setBaselineId] = useState(selectedId)
  const attach = useCallback((node: HTMLDivElement | null) => {
    previewRows.current = node?.querySelector<HTMLDivElement>('.fos-popup-rows') ?? null
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref])
  useLayoutEffect(() => {
    // Semantic GlassSelect rows and native-proxy options use the same enabled test.
    // Empty string is a valid optional value; disabled placeholders are not a baseline.
    const row = Array.from(previewRows.current?.querySelectorAll<HTMLElement>('[data-popup-item]') ?? [])
      .find(item => selectedId !== undefined && item.dataset.popupItem === selectedId
        && !item.matches(':disabled, [data-disabled], [aria-disabled="true"]'))
    setBaselineId(row ? selectedId : undefined)
  }, [selectedId, items, semanticRows, props['data-state']])
  const persistentId = mode === 'actions' ? activatedId : baselineId
  useLayoutEffect(() => { if (props['data-state'] !== 'closed') setActivatedId(undefined) }, [props['data-state']])
  useLayoutEffect(() => {
    setPreviewId(undefined)
    setPreviewVisible(false)
    previewVisibleRef.current = false
    if (props['data-state'] === 'closed') setActivatedId(undefined)
  }, [selectedId, selectionPending, props['data-state']])
  useEffect(() => {
    if (previewVisible || previewId === undefined || persistentId !== undefined) return
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
  }, [previewVisible, previewId, persistentId])
  useLayoutEffect(() => {
    // Frozen Rows own overlap while the lens exists. The adapter owns removal
    // of its transient optics when there is no preview/activation to render.
    if (previewId === undefined && persistentId === undefined) {
      previewRows.current?.querySelectorAll<HTMLElement>('[data-popup-label], [data-popup-icon]').forEach(element => {
        element.style.removeProperty('--fos-sidebar-label-scale')
        element.style.removeProperty('--fos-sidebar-icon-scale')
      })
    }
  }, [previewId, persistentId, props['data-state']])
  const preview = (event: PointerEvent<HTMLDivElement>) => {
    previewRows.current = event.currentTarget
    if (selectionPending) return
    const row = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-popup-item]') : null
    const hover = (event.pointerType === 'mouse' || event.pointerType === 'pen') && event.buttons === 0
    const target = hover && props['data-state'] !== 'closed' && row && event.currentTarget.contains(row)
      && !row.matches(':disabled, [data-disabled], [aria-disabled="true"]') ? row.dataset.popupItem : undefined
    if (target !== undefined) {
      setPreviewId(target)
      previewVisibleRef.current = true
      setPreviewVisible(true)
    } else hidePreview()
  }
  const hidePreview = () => {
    previewVisibleRef.current = false
    setPreviewVisible(false)
    if (persistentId !== undefined) setPreviewId(undefined)
  }
  const clearPreview = () => { hidePreview(); setPreviewId(undefined) }
  const activate = (item: FosPopupItem) => {
    if (item.disabled) return
    clearPreview()
    // An action has no persistent selected state. First activation has no invented travel origin.
    if (mode === 'actions') setActivatedId(item.id)
    onSelect?.(item.id)
  }
  const targetId = props['data-state'] === 'closed' ? undefined
    : !selectionPending && previewVisible ? previewId : persistentId ?? previewId
  const rows = <FosPopupRows selectedId={targetId} className={rowsClassName} lensTestId={lensTestId}
      onPointerMove={preview} onPointerLeave={hidePreview}>
      {semanticRows ?? items?.map(item => {
        const content = <>{item.icon && <span className={iconClassName} data-popup-icon="">{item.icon}</span>}<span className={labelClassName} data-popup-label="">{item.label}</span>{item.disabled && item.reason && <span className="fos-sr-only">: {item.reason}</span>}</>
        const attributes = { 'data-popup-item': item.id, 'data-testid': item.testId, className: 'fos-popup__item ' + rowClassName, title: item.reason }
        return mode === 'actions'
          ? <DropdownMenu.Item key={item.id} {...attributes} disabled={item.disabled} textValue={item.label}
              onPointerMove={event => event.preventDefault()}
              onPointerLeave={event => event.preventDefault()}
              onSelect={() => activate(item)}>{content}</DropdownMenu.Item>
          : <FosButtonRoot family="option" key={item.id} {...attributes} type="button" role={mode === 'listbox' ? 'option' : undefined}
              aria-selected={mode === 'listbox' ? selectedId === item.id : undefined}
              aria-current={mode === 'navigation' && selectedId === item.id ? 'page' : undefined}
              tabIndex={mode === 'listbox' ? -1 : undefined} disabled={item.disabled} onClick={() => activate(item)}>{content}</FosButtonRoot>
      })}
    </FosPopupRows>
  return <FosPopupSurface {...props} ref={attach}
    onKeyDownCapture={event => { props.onKeyDownCapture?.(event); clearPreview() }}
    onClickCapture={event => { props.onClickCapture?.(event); clearPreview() }}
    onPointerDownCapture={event => { props.onPointerDownCapture?.(event); if (event.pointerType === 'touch') clearPreview() }}
    role={props.role ?? (mode === 'actions' ? 'menu' : mode === 'listbox' ? 'listbox' : undefined)}
    data-fos-popup={mode} data-hover-preview="v0.3"
    data-preview-visible={props['data-state'] !== 'closed' && (previewVisible || persistentId !== undefined)} className={'fos-popup ' + className}>
    {header}
    {wrapRows ? wrapRows(rows) : rows}
    {footer}
  </FosPopupSurface>
})
