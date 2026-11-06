import type { OrderItemSummaryView } from './order-model'

/** FOS Order Item Summary 2025:6608: immutable display strings, not an Item form/schema. */
export function OrderItemSummary({ item, position }: { item: OrderItemSummaryView; position: number }) {
  return (
    <article className="fos-order-item-summary" data-testid="order-item-summary" data-item-id={item.id}>
      <h3>{String(position).padStart(2, '0')} · {item.name}</h3>
      <p className="fos-order-item-summary__specifications">{item.specifications}</p>
      <p className="fos-order-item-summary__artwork">{item.artworkLabel}</p>
    </article>
  )
}
