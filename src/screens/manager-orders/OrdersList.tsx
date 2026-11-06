import type { ManagerOrderPreview } from './fixtures'
import { MANAGER_ORDER_STATUS_LABELS } from './fixtures'

interface OrdersListProps {
  orders: readonly ManagerOrderPreview[]
  total: number
}

/** One non-clickable row until the real Order Detail route and permissions exist. */
export function OrderRow({ order }: { order: ManagerOrderPreview }) {
  return (
    <li className="manager-orders__row" data-testid={'manager-order-' + order.id}>
      <div className="manager-orders__row-main">
        <strong className="manager-orders__number">{order.id}</strong>
        <span className="manager-orders__title">{order.title}</span>
      </div>
      <span className="manager-orders__company">{order.company}</span>
      <span className="manager-orders__status">{MANAGER_ORDER_STATUS_LABELS[order.status]}</span>
    </li>
  )
}

export function OrdersList({ orders, total }: OrdersListProps) {
  return (
    <section className="manager-orders__list-card" aria-label="Список заказов" data-testid="manager-orders-list">
      <header className="manager-orders__list-head">
        <h2>Список заказов</h2>
        <span role="status" aria-live="polite" data-testid="manager-order-count">
          {orders.length} из {total}
        </span>
      </header>
      {orders.length > 0 ? (
        <ul className="manager-orders__rows">
          {orders.map(order => <OrderRow order={order} key={order.id} />)}
        </ul>
      ) : (
        <div className="manager-orders__empty" data-testid="manager-orders-empty">
          По выбранному фильтру заказов нет.
        </div>
      )}
    </section>
  )
}
