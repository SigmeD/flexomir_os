import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { OrderItemSummary } from './OrderItemSummary'
import type { OrderItemSummaryView } from './order-model'
import chevron from '@/assets/orders/chevron.svg'
import './order-item-row.css'

/** Whole clickable Summary 2025:6608, not a second Edit button beneath a static card. */
export function OrderItemRow({ item, position, onOpen, disabled = false }: { item: OrderItemSummaryView; position: number; onOpen: () => void; disabled?: boolean }) {
  return <div className="fos-order-item-row"><OrderItemSummary item={item} position={position} /><FosButtonRoot family="row" type="button" className="fos-order-item-row__hit" disabled={disabled} aria-label={'Изменить позицию ' + position} onClick={onOpen} /><img className="fos-order-item-row__chevron" src={chevron} alt="" /></div>
}
