import { forwardRef, useEffect, useState, type ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FosPopupSurface, type FosPopupSurfaceProps } from './fos-popup-surface'
import { FosPopupRows } from './fos-popup-rows'
import './fos-popup.css'

export interface FosPopupItem { id: string; label: string; disabled?: boolean; reason?: string; icon?: ReactNode }
type Selection = { mode: 'navigation' | 'listbox'; selectedId?: string } | { mode: 'actions'; selectedId?: never }
export type FosPopupProps = Omit<FosPopupSurfaceProps, 'children' | 'hoverLens' | 'sidebarMaterial' | 'onSelect'> & Selection & {
  items: readonly FosPopupItem[]
  onSelect: (id: string) => void
  header?: ReactNode
  footer?: ReactNode
  rowClassName?: string
}

/** Review-only dev switch. Ordinary routes keep the approved adapters until rollout acceptance. */
export function isFosPopupPilot() { return import.meta.env.DEV && new URLSearchParams(window.location.search).get('popupPilot') === '1' }

/** Public composition: semantic adapters cannot select a different material or hover driver. */
export const FosPopup = forwardRef<HTMLDivElement, FosPopupProps>(function FosPopup({
  mode, selectedId, items, onSelect, header, footer, rowClassName = '', className = '', ...props
}, ref) {
  const [activatedId, setActivatedId] = useState<string>()
  useEffect(() => { if (props['data-state'] !== 'closed') setActivatedId(undefined) }, [props['data-state']])
  const activate = (item: FosPopupItem) => {
    if (item.disabled) return
    // An action has no persistent selected state. First activation has no invented travel origin.
    if (mode === 'actions') setActivatedId(item.id)
    onSelect(item.id)
  }
  return <FosPopupSurface {...props} ref={ref} hoverLens={false} sidebarMaterial
    role={props.role ?? (mode === 'actions' ? 'menu' : mode === 'listbox' ? 'listbox' : undefined)}
    data-fos-popup={mode} className={'fos-popup ' + className}>
    {header}
    <FosPopupRows selectedId={mode === 'actions' ? activatedId : selectedId}>
      {items.map(item => {
        const content = <>{item.icon && <span data-popup-icon="">{item.icon}</span>}<span data-popup-label="">{item.label}</span>{item.disabled && item.reason && <span className="fos-sr-only">: {item.reason}</span>}</>
        const attributes = { 'data-popup-item': item.id, className: 'fos-popup__item ' + rowClassName, title: item.reason }
        return mode === 'actions'
          ? <DropdownMenu.Item key={item.id} {...attributes} disabled={item.disabled} textValue={item.label} onSelect={() => activate(item)}>{content}</DropdownMenu.Item>
          : <button key={item.id} {...attributes} type="button" role={mode === 'listbox' ? 'option' : undefined}
              aria-selected={mode === 'listbox' ? selectedId === item.id : undefined}
              aria-current={mode === 'navigation' && selectedId === item.id ? 'page' : undefined}
              tabIndex={mode === 'listbox' ? -1 : undefined} disabled={item.disabled} onClick={() => activate(item)}>{content}</button>
      })}
    </FosPopupRows>
    {footer}
  </FosPopupSurface>
})
