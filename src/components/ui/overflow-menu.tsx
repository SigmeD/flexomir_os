import { forwardRef, useRef, type ComponentProps } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import moreIcon from '@/assets/orders/more.svg'
import type { HeaderActionPresentation } from './header-action'
import './overflow-menu.css'

/** More 1914:650. Transparent 48px hit area; never a primary circle. */
export const MoreAction = forwardRef<HTMLButtonElement, ComponentProps<'button'> & { presentation?: HeaderActionPresentation }>(function MoreAction({ presentation = 'auto', className = '', ...props }, ref) {
  return <button type="button" aria-label="Ещё" title="Ещё" {...props} ref={ref} className={'fos-more fos-more--' + presentation + ' ' + className}><span className="fos-more__hit"><img src={moreIcon} alt="" /></span><span className="fos-more__caption" aria-hidden="true">Ещё</span><span className="fos-more__tooltip" aria-hidden="true">Ещё</span></button>
})
export interface OverflowItem { id: string; label: string; onSelect?: () => void; disabled?: boolean; reason?: string; focusAfter?: 'trigger' | 'consumer' }
/** Menus 1914:655..676 share one accessible Radix lifecycle, no visual engine. */
export function OverflowMenu({ items, disabled = false, presentation = 'auto' }: { items: readonly OverflowItem[]; disabled?: boolean; presentation?: HeaderActionPresentation }) {
  const consumerFocus = useRef(false)
  return <DropdownMenu.Root modal={false}>
    <DropdownMenu.Trigger asChild><MoreAction disabled={disabled} presentation={presentation} /></DropdownMenu.Trigger>
    <DropdownMenu.Portal><DropdownMenu.Content className="fos-overflow" align="end" sideOffset={8} collisionPadding={16} aria-label="Действия заказа" onCloseAutoFocus={event => {
      // A navigating consumer owns focus after a chosen action; Escape/outside use Radix return focus.
      if (consumerFocus.current) event.preventDefault()
      consumerFocus.current = false
    }}>
      {items.map(item => <DropdownMenu.Item key={item.id} disabled={item.disabled} className="fos-overflow__item" title={item.reason} textValue={item.label} onSelect={() => { consumerFocus.current = item.focusAfter === 'consumer'; item.onSelect?.() }}>
        {item.label}{item.disabled && item.reason && <span className="fos-sr-only">: {item.reason}</span>}
      </DropdownMenu.Item>)}
    </DropdownMenu.Content></DropdownMenu.Portal>
  </DropdownMenu.Root>
}
