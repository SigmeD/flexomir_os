import { forwardRef, useLayoutEffect, useState, type ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FosPopupSurface, type FosPopupSurfaceProps } from './fos-popup-surface'
import { FosPopupRows } from './fos-popup-rows'
import './fos-popup.css'

export interface FosPopupItem { id: string; label: string; disabled?: boolean; reason?: string; icon?: ReactNode; testId?: string }
type Selection = { mode: 'navigation' | 'listbox'; selectedId?: string } | { mode: 'actions'; selectedId?: never }
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

/** Public composition: semantic adapters cannot select a different material or hover driver. */
export const FosPopup = forwardRef<HTMLDivElement, FosPopupProps>(function FosPopup({
  mode, selectedId, items, onSelect, semanticRows, header, footer, rowClassName = '', labelClassName, iconClassName,
  rowsClassName, lensTestId, wrapRows, className = '', ...props
}, ref) {
  const [activatedId, setActivatedId] = useState<string>()
  useLayoutEffect(() => { if (props['data-state'] !== 'closed') setActivatedId(undefined) }, [props['data-state']])
  const activate = (item: FosPopupItem) => {
    if (item.disabled) return
    // An action has no persistent selected state. First activation has no invented travel origin.
    if (mode === 'actions') setActivatedId(item.id)
    onSelect?.(item.id)
  }
  const rows = <FosPopupRows selectedId={mode === 'actions' ? activatedId : selectedId} className={rowsClassName} lensTestId={lensTestId}>
      {semanticRows ?? items?.map(item => {
        const content = <>{item.icon && <span className={iconClassName} data-popup-icon="">{item.icon}</span>}<span className={labelClassName} data-popup-label="">{item.label}</span>{item.disabled && item.reason && <span className="fos-sr-only">: {item.reason}</span>}</>
        const attributes = { 'data-popup-item': item.id, 'data-testid': item.testId, className: 'fos-popup__item ' + rowClassName, title: item.reason }
        return mode === 'actions'
          ? <DropdownMenu.Item key={item.id} {...attributes} disabled={item.disabled} textValue={item.label} onSelect={() => activate(item)}>{content}</DropdownMenu.Item>
          : <button key={item.id} {...attributes} type="button" role={mode === 'listbox' ? 'option' : undefined}
              aria-selected={mode === 'listbox' ? selectedId === item.id : undefined}
              aria-current={mode === 'navigation' && selectedId === item.id ? 'page' : undefined}
              tabIndex={mode === 'listbox' ? -1 : undefined} disabled={item.disabled} onClick={() => activate(item)}>{content}</button>
      })}
    </FosPopupRows>
  return <FosPopupSurface {...props} ref={ref}
    role={props.role ?? (mode === 'actions' ? 'menu' : mode === 'listbox' ? 'listbox' : undefined)}
    data-fos-popup={mode} className={'fos-popup ' + className}>
    {header}
    {wrapRows ? wrapRows(rows) : rows}
    {footer}
  </FosPopupSurface>
})
