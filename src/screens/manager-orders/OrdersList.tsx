import { OrderCard } from '@/components/orders/OrderCard'
import type { OrderListItem } from './model'

interface OrdersListProps {
  orders: readonly OrderListItem[]
  total: number
}

/** Reuses the domain-neutral card; no backend enum or routing assumptions. */
export function OrderRow({ order }: { order: OrderListItem }) {
  return (
    <li data-testid={'manager-order-' + order.id}>
      <OrderCard
        number={order.id}
        title={order.title}
        company={order.company}
        statusLabel={order.statusLabel}
      />
    </li>
  )
}

export function OrdersList({ orders, total }: OrdersListProps) {
  return (
    <section className="manager-orders-screen__list" aria-labelledby="manager-orders-list-title" data-testid="manager-orders-list">
      <header className="manager-orders-screen__list-header">
        <h2 id="manager-orders-list-title">Список заказов</h2>
        <span className="manager-orders-screen__count" role="status" aria-live="polite" data-testid="manager-order-count">
          {orders.length} из {total}
        </span>
      </header>
      {orders.length > 0 ? (
        <ul className="manager-orders-screen__items">
          {orders.map(order => <OrderRow order={order} key={order.id} />)}
        </ul>
      ) : (
        <p className="manager-orders-screen__empty" data-testid="manager-orders-empty">
          По выбранному фильтру заказов нет.
        </p>
      )}
    </section>
  )
}
