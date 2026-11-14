import { FosSummaryRow } from '@/components/ui/fos-summary-row'
import { OrderItemSummary } from './OrderItemSummary'
import type { OrderItemSummaryView } from './order-model'
import chevron from '@/assets/orders/chevron.svg'
import './order-item-row.css'

/** Whole clickable Summary 2025:6608, not a second Edit button beneath a static card. */
export function OrderItemRow({ item, position, onOpen, disabled = false }: { item: OrderItemSummaryView; position: number; onOpen: () => void; disabled?: boolean }) {
  return <FosSummaryRow overlay surface="card" className="fos-order-item-row" type="button" disabled={disabled} aria-label={'Изменить позицию ' + position} onClick={onOpen} trailing={<img className="fos-order-item-row__chevron" src={chevron} alt="" />}>
    <OrderItemSummary item={item} position={position} />
  </FosSummaryRow>
}
