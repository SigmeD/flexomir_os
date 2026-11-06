import { OrderItemSummary } from './OrderItemSummary'
import type { OrderItemSummaryView } from './order-model'
import chevron from '@/assets/orders/chevron.svg'
import './order-item-row.css'

/** Whole clickable Summary 2025:6608, not a second Edit button beneath a static card. */
export function OrderItemRow({ item, position, onOpen, disabled = false }: { item: OrderItemSummaryView; position: number; onOpen: () => void; disabled?: boolean }) {
  return <button type="button" className="fos-order-item-row" disabled={disabled} aria-label={'Изменить позицию ' + position} onClick={onOpen}><OrderItemSummary item={item} position={position} /><img className="fos-order-item-row__chevron" src={chevron} alt="" /></button>
}
