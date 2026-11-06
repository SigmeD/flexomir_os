import { OrderCard } from './OrderCard'
import type { OrderListItem } from './order-model'

interface OrdersListProps {
  orders: readonly OrderListItem[]
  total: number
  /** Unique DOM/test namespace; no role logic or data selection here. */
  idPrefix?: string
  onOpen?: (id: string) => void
}

export function OrderRow({ order, idPrefix = 'manager', onOpen }: {
  order: OrderListItem; idPrefix?: string; onOpen?: (id: string) => void
}) {
  return (
    <li data-testid={idPrefix + '-order-' + order.id}>
      <OrderCard
        number={order.id} title={order.title} company={order.company} statusLabel={order.statusLabel}
        onOpen={onOpen && order.detail ? () => onOpen(order.id) : undefined}
      />
    </li>
  )
}

/** Shared list/empty presentation. Receives already-scoped records from its host. */
export function OrdersList({ orders, total, idPrefix = 'manager', onOpen }: OrdersListProps) {
  const titleId = idPrefix + '-orders-list-title'
  return (
    <section className="fos-orders-page__list" aria-labelledby={titleId} data-testid={idPrefix + '-orders-list'}>
      <header className="fos-orders-page__list-header">
        <h2 id={titleId}>Список заказов</h2>
        <span className="fos-orders-page__count" role="status" aria-live="polite" data-testid={idPrefix + '-order-count'}>
          {orders.length} из {total}
        </span>
      </header>
      {orders.length ? (
        <ul className="fos-orders-page__items">
          {orders.map(order => <OrderRow order={order} idPrefix={idPrefix} onOpen={onOpen} key={order.id} />)}
        </ul>
      ) : (
        <p className="fos-orders-page__empty" data-testid={idPrefix + '-orders-empty'}>
          По выбранному фильтру заказов нет.
        </p>
      )}
    </section>
  )
}
