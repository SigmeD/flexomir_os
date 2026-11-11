import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { forwardRef, useRef, type ComponentProps } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import moreIcon from '@/assets/orders/more.svg'
import type { HeaderActionPresentation } from './header-action'
import { FosPopup } from './fos-popup'
import './overflow-menu.css'

/** More 1914:650. Transparent 48px hit area; never a primary circle. */
export const MoreAction = forwardRef<HTMLButtonElement, ComponentProps<'button'> & { presentation?: HeaderActionPresentation }>(function MoreAction({ presentation = 'auto', className = '', ...props }, ref) {
  return <FosButtonRoot family="navigation" type="button" aria-label="Ещё" title="Ещё" {...props} ref={ref} className={'fos-more fos-more--' + presentation + ' ' + className}><span className="fos-more__hit"><img src={moreIcon} alt="" /></span><span className="fos-more__caption" aria-hidden="true">Ещё</span><span className="fos-more__tooltip" aria-hidden="true">Ещё</span></FosButtonRoot>
})
export interface OverflowItem { id: string; label: string; onSelect?: () => void; disabled?: boolean; reason?: string; focusAfter?: 'trigger' | 'consumer' }
/** Menus 1914:655..676 share one accessible Radix lifecycle, no visual engine. */
export function OverflowMenu({ items, disabled = false, presentation = 'auto' }: { items: readonly OverflowItem[]; disabled?: boolean; presentation?: HeaderActionPresentation }) {
  const consumerFocus = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const escapeFocus = useRef(false)
  return <DropdownMenu.Root modal={false} onOpenChange={open => { if (open) escapeFocus.current = false }}>
    <DropdownMenu.Trigger asChild><MoreAction ref={triggerRef} disabled={disabled} presentation={presentation} /></DropdownMenu.Trigger>
    <DropdownMenu.Portal><DropdownMenu.Content asChild align="end" sideOffset={8} collisionPadding={16} aria-label="Действия заказа" onEscapeKeyDown={() => { escapeFocus.current = true }} onInteractOutside={event => {
      const target = event.detail.originalEvent.target
      if (target instanceof Node && triggerRef.current?.contains(target)) event.preventDefault()
      else escapeFocus.current = false
    }} onCloseAutoFocus={event => {
      // A navigating consumer owns focus after a chosen action; Escape/outside use Radix return focus.
      if (consumerFocus.current) event.preventDefault()
      else if (escapeFocus.current) {
        event.preventDefault()
        triggerRef.current?.focus()
      }
      consumerFocus.current = false
      escapeFocus.current = false
    }}>
      <FosPopup mode="actions" className="fos-overflow" contentClassName="fos-overflow__content" rowClassName="fos-overflow__item"
        items={items} onSelect={id => { const item = items.find(candidate => candidate.id === id); if (item) { consumerFocus.current = item.focusAfter === 'consumer'; item.onSelect?.() } }} />
    </DropdownMenu.Content></DropdownMenu.Portal>
  </DropdownMenu.Root>
}
