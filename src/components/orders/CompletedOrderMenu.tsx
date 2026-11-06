import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import moreIcon from '@/assets/orders/more.svg'
import sendIcon from '@/assets/orders/send.svg'

/** FOS completed header 2036:7604. Plain menu, no new Glass/motion implementation. */
export function CompletedOrderMenu({ onDuplicate }: { onDuplicate: () => void }) {
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const action = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  useLayoutEffect(() => { if (open) action.current?.focus() }, [open])
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  return (
    <div ref={container} className="fos-completed-actions" onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus() }
      if (open && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); action.current?.focus() }
    }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <button type="button" className="fos-order-icon-action fos-order-icon-action--send" disabled aria-label="Отправить завершённый заказ" title="Завершённый заказ доступен только для просмотра"><span><img src={sendIcon} alt="" /></span><small>Отправить</small></button>
      <button ref={trigger} type="button" className="fos-order-icon-action" aria-label="Ещё" title="Другие действия" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} onClick={() => setOpen(current => !current)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true) } }}><span><img src={moreIcon} alt="" /></span><small>Ещё</small></button>
      {open && <div id={menuId} role="menu" aria-label="Действия завершённого заказа" className="fos-completed-actions__menu"><button ref={action} type="button" role="menuitem" onClick={() => { setOpen(false); onDuplicate() }}>Дублировать заказ</button></div>}
    </div>
  )
}
