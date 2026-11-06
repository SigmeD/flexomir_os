import { OrderCard } from '@/components/orders/OrderCard'
import type { ManagerOrderPreview } from './fixtures'
import { MANAGER_ORDER_STATUS_LABELS } from './fixtures'

interface OrdersListProps {
  orders: readonly ManagerOrderPreview[]
  total: number
}

/** Screen adapter: demo status code never enters generic OrderCard. */
export function OrderRow({ order }: { order: ManagerOrderPreview }) {
  return (
    <li data-testid={'manager-order-' + order.id}>
      <OrderCard
        number={order.id}
        title={order.title}
        company={order.company}
        statusLabel={MANAGER_ORDER_STATUS_LABELS[order.status]}
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
