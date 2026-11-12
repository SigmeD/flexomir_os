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
export interface OverflowContextPoint { x: number; y: number; opener: HTMLElement }
/** Menus 1914:655..676 share one accessible Radix lifecycle, no visual engine. */
export function OverflowMenu({ items, disabled = false, presentation = 'auto', label = 'Действия заказа', context }: { items: readonly OverflowItem[]; disabled?: boolean; presentation?: HeaderActionPresentation; label?: string
  context?: { point: OverflowContextPoint | null; onClose: () => void }
}) {
  const consumerFocus = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const escapeFocus = useRef(false)
  const selected = useRef(false)
  const point = useRef<OverflowContextPoint | null>(null)
  const contextPress = useRef<number | null>(null)
  if (context?.point && context.point !== point.current) { point.current = context.point; contextPress.current = null }
  return <DropdownMenu.Root modal={false} open={context ? Boolean(context.point) : undefined} onOpenChange={open => { if (open) { escapeFocus.current = false; selected.current = false } else context?.onClose() }}>
    <DropdownMenu.Trigger asChild>{context ? <FosButtonRoot ref={triggerRef} family="utility" type="button" tabIndex={-1} disabled aria-hidden="true" aria-label={label} className="fos-context-anchor" style={{left:point.current?.x ?? 0,top:point.current?.y ?? 0}} /> : <MoreAction ref={triggerRef} disabled={disabled} presentation={presentation} />}</DropdownMenu.Trigger>
    <DropdownMenu.Portal><DropdownMenu.Content asChild align={context ? 'start' : 'end'} sideOffset={context ? 2 : 8} collisionPadding={16} aria-label={label}
      onPointerDownCapture={context ? event => { contextPress.current = event.button === 0 ? event.pointerId : null } : undefined}
      onPointerCancelCapture={context ? () => { contextPress.current = null } : undefined}
      onPointerUpCapture={context ? event => {
        // A context/long-hold opening release can land on a newly placed row.
        // Radix Item otherwise synthesizes a click for an unpaired pointer-up.
        const pressedInside = contextPress.current === event.pointerId
        contextPress.current = null
        if (event.button !== 0 || !pressedInside) { event.preventDefault(); event.stopPropagation() }
      } : undefined}
      onEscapeKeyDown={() => { escapeFocus.current = true }} onInteractOutside={event => {
      const target = event.detail.originalEvent.target
      if (target instanceof Node && triggerRef.current?.contains(target)) event.preventDefault()
      else escapeFocus.current = false
    }} onCloseAutoFocus={event => {
      if (context) {
        event.preventDefault()
        if (!consumerFocus.current && (escapeFocus.current || selected.current)) point.current?.opener.focus({preventScroll:true})
        consumerFocus.current = false; escapeFocus.current = false; selected.current = false
        return
      }
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
        items={items} onSelect={id => { const item = items.find(candidate => candidate.id === id); if (item) { selected.current = true; consumerFocus.current = item.focusAfter === 'consumer'; item.onSelect?.() } }} />
    </DropdownMenu.Content></DropdownMenu.Portal>
  </DropdownMenu.Root>
}
