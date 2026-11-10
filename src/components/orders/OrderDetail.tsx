import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { HeaderAction } from '@/components/ui/header-action'
import { MoreAction } from '@/components/ui/overflow-menu'
import { FOSDateField, FOSInput, FOSTextarea } from '@/components/ui/fos-controls'
import { OrderItemSummary } from './OrderItemSummary'
import { OrderDateFields } from './OrderDateFields'
import { ManagerDemoIntake } from './ManagerDemoIntake'
import type { OrderDetailContent, OrderListItem } from './order-model'
import './order-detail.css'

interface OrderDetailProps {
  order: OrderListItem; detail: OrderDetailContent; onBack: () => void; actions?: ReactNode
  role?: 'client' | 'manager'; managerIntake?: boolean; submitted?: boolean
  demoProcessingState?: 'pending' | 'success' | 'error'
  onDemoProcessingStateChange?: (state: 'pending' | 'success' | 'error') => void
  demoProcessingEnabled?: boolean
}
function dateValue(value?: string) {
  if (!value) return ''
  return /^\d{2}\.\d{2}\.\d{4}$/.test(value) ? value.slice(6) + '-' + value.slice(3, 5) + '-' + value.slice(0, 2) : value
}
/** Shared readonly composition; Manager-only data slots never create production commands. */
export function OrderDetail({ order, detail, onBack, actions, role = 'client', managerIntake = false, submitted = false, demoProcessingState, onDemoProcessingStateChange, demoProcessingEnabled = false }: OrderDetailProps) {
  const title = submitted ? 'Заказ отправлен' : 'Заказ ' + order.id
  return <div className="fos-order-detail" data-testid="order-detail" data-role={role} data-order-id={order.id}>
    <PageHeader title={title} floatingWorkActions={!actions} autoFocus subtitle={<span data-testid="order-detail-status">{order.statusLabel}</span>}
      breadcrumbs={[{ label: role === 'manager' ? 'Заказы' : 'Мои заказы', onSelect: onBack }, { label: title }]}
      actions={actions || <><HeaderAction action={role === 'manager' ? 'add' : 'send'} accessibleName={role === 'manager' ? 'Добавить позицию заказа' : 'Отправить заказ'} disabled /><MoreAction disabled /></>} />
    <p className="fos-sr-only">{order.title} · {order.company} · Только просмотр.</p>
    <div className="fos-order-detail__body">
      {role === 'manager' && <FOSInput wrapperClassName="fos-order-detail__company" label="Компания" value={order.company} readOnly />}
      <section className="fos-order-detail__products" aria-labelledby="order-detail-items-title">
        <h2 id="order-detail-items-title">Продукция</h2>
        {detail.items.length ? <ul className="fos-order-detail__items">{detail.items.map((item, index) => <li key={item.id}><OrderItemSummary item={item} position={index + 1} /></li>)}</ul>
          : <p className="fos-order-detail__empty">Позиции не указаны.</p>}
      </section>
      <section className="fos-order-detail__general" aria-labelledby="order-detail-general-title"><h2 id="order-detail-general-title">Общие данные заказа</h2>
        <OrderDateFields className="fos-order-detail__dates">
          <FOSDateField label="Желаемый срок" value={dateValue(detail.requestedDate)} readOnly />
          {role === 'manager' && <FOSDateField label="Согласованный срок" value={dateValue(detail.agreedDate)} readOnly />}
        </OrderDateFields>
        <FOSTextarea label="Комментарии" value={detail.comment || ''} placeholder="Необязательно" readOnly />
      </section>
      {managerIntake && <ManagerDemoIntake state={demoProcessingState} onStateChange={onDemoProcessingStateChange} demoEnabled={demoProcessingEnabled} />}
    </div>
  </div>
}
