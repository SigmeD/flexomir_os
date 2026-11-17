import { OrderCard } from './OrderCard'
import type { OrderListItem } from './order-model'

interface OrdersListProps {
  orders: readonly OrderListItem[]
  total: number
  /** Unique DOM/test namespace; no role logic or data selection here. */
  idPrefix?: string
  onOpen?: (id: string) => void
  snapshot?: boolean
}

export function OrderRow({ order, idPrefix = 'manager', onOpen, snapshot = false }: {
  order: OrderListItem; idPrefix?: string; onOpen?: (id: string) => void; snapshot?: boolean
}) {
  return (
    <li data-testid={snapshot ? undefined : idPrefix + '-order-' + order.id}>
      <OrderCard
        number={order.id} title={order.title} company={order.company} statusLabel={order.statusLabel}
        onOpen={!snapshot && onOpen && order.detail ? () => onOpen(order.id) : undefined} snapshot={snapshot}
      />
    </li>
  )
}

/** Shared list/empty presentation. Receives already-scoped records from its host. */
export function OrdersList({ orders, total, idPrefix = 'manager', onOpen, snapshot = false }: OrdersListProps) {
  const titleId = idPrefix + '-orders-list-title'
  return (
    <section className="fos-orders-page__list" aria-labelledby={titleId} data-testid={snapshot ? undefined : idPrefix + '-orders-list'}>
      <header className="fos-orders-page__list-header">
        <h2 id={titleId}>Список заказов</h2>
        <span className="fos-orders-page__count" role={snapshot ? undefined : 'status'} aria-live={snapshot ? undefined : 'polite'} data-testid={snapshot ? undefined : idPrefix + '-order-count'}>
          {orders.length} из {total}
        </span>
      </header>
      {orders.length ? (
        <ul className="fos-orders-page__items">
          {orders.map(order => <OrderRow order={order} idPrefix={idPrefix} onOpen={onOpen} snapshot={snapshot} key={order.id} />)}
        </ul>
      ) : (
        <p className="fos-orders-page__empty" data-testid={snapshot ? undefined : idPrefix + '-orders-empty'}>
          По выбранному фильтру заказов нет.
        </p>
      )}
    </section>
  )
}
