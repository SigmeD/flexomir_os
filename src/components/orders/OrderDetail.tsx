import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { OrderItemSummary } from './OrderItemSummary'
import type { OrderDetailContent, OrderListItem } from './order-model'
import './order-detail.css'

interface OrderDetailProps {
  order: OrderListItem
  detail: OrderDetailContent
  onBack: () => void
  actions?: ReactNode
}

/** One read-only composition for both roles. No commands, editable fields or API/1C semantics. */
export function OrderDetail({ order, detail, onBack, actions }: OrderDetailProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [order.id])

  return (
    <div className="fos-order-detail" data-testid="order-detail">
      <button type="button" className="fos-order-detail__back" onClick={onBack}>К списку заказов</button>
      <header className="fos-orders-page__header">
        <div>
          <h1 ref={headingRef} tabIndex={-1}>Заказ {order.id}</h1>
          <p className="fos-order-detail__status" data-testid="order-detail-status">{order.statusLabel}</p>
          <p className="fos-order-detail__name">{order.title}</p>
        </div>
        {actions}
      </header>
      <p className="fos-orders-page__disclaimer">Только просмотр.</p>
      <dl className="fos-order-detail__fields" aria-label="Компания заказа">
        <div><dt>Компания</dt><dd>{order.company}</dd></div>
      </dl>
      <section className="fos-order-detail__section" aria-labelledby="order-detail-items-title">
        <h2 id="order-detail-items-title">Продукция</h2>
        {detail.items.length ? (
          <ul className="fos-order-detail__items">
            {detail.items.map((item, index) => (
              <li key={item.id}><OrderItemSummary item={item} position={index + 1} /></li>
            ))}
          </ul>
        ) : <p className="fos-order-detail__empty">Позиции не указаны.</p>}
      </section>
      <section className="fos-order-detail__section" aria-labelledby="order-detail-general-title">
        <h2 id="order-detail-general-title">Общие данные заказа</h2>
        <dl className="fos-order-detail__fields fos-order-detail__fields--dates">
          <div><dt>Желаемый срок</dt><dd>{detail.requestedDate || 'Не указан'}</dd></div>
          <div><dt>Согласованный срок</dt><dd>{detail.agreedDate || 'Не указан'}</dd></div>
          <div className="fos-order-detail__comment"><dt>Комментарий к заказу</dt><dd>{detail.comment || 'Нет комментария.'}</dd></div>
        </dl>
      </section>
    </div>
  )
}
