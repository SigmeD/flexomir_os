import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { FosSectionHeading } from '@/components/ui/fos-section-heading'
import { HeaderAction } from '@/components/ui/header-action'
import { MoreAction, OverflowMenu } from '@/components/ui/overflow-menu'
import { FOSInput } from '@/components/ui/fos-controls'
import { FOSDatePicker } from '@/components/ui/fos-date-picker'
import { OrderItemSummary } from './OrderItemSummary'
import { OrderDateFields } from './OrderDateFields'
import { ManagerDemoIntake } from './ManagerDemoIntake'
import type { OrderDetailContent, OrderListItem } from './order-model'
import './order-detail.css'
import { OrderConversation } from '@/components/messaging/OrderConversation'
import { SignedDocumentsSection } from '@/components/documents/SignedDocumentsSection'

interface OrderDetailProps {
  order: OrderListItem; detail: OrderDetailContent; onBack: () => void; actions?: ReactNode
  role?: 'client' | 'manager'; managerIntake?: boolean; submitted?: boolean
  demoProcessingState?: 'pending' | 'success' | 'error'
  onDemoProcessingStateChange?: (state: 'pending' | 'success' | 'error') => void
  demoProcessingEnabled?: boolean
  onEdit?: () => void
  canReply?: boolean
}
function dateValue(value?: string) {
  if (!value) return ''
  return /^\d{2}\.\d{2}\.\d{4}$/.test(value) ? value.slice(6) + '-' + value.slice(3, 5) + '-' + value.slice(0, 2) : value
}
/** Shared readonly composition; Manager-only data slots never create production commands. */
export function OrderDetail({ order, detail, onBack, actions, role = 'client', managerIntake = false, submitted = false, demoProcessingState, onDemoProcessingStateChange, demoProcessingEnabled = false, onEdit, canReply = false }: OrderDetailProps) {
  const title = submitted ? 'Заказ отправлен' : 'Заказ ' + order.id
  return <div className="fos-order-detail" data-testid="order-detail" data-role={role} data-order-id={order.id}>
    <PageHeader title={title} floatingWorkActions={!actions} autoFocus subtitleRole="status" subtitle={<span data-testid="order-detail-status">{order.statusLabel}</span>}
      breadcrumbs={[{ label: role === 'manager' ? 'Заказы' : 'Мои заказы', onSelect: onBack }, { label: title }]}
      actions={actions || <><HeaderAction action={role === 'manager' ? 'add' : 'send'} accessibleName={role === 'manager' ? 'Добавить позицию заказа' : 'Отправить заказ'} disabled />{onEdit ? <OverflowMenu items={[{ id: 'edit', label: 'Изменить', onSelect: onEdit, focusAfter: 'consumer' }]} /> : <MoreAction disabled />}</>} />
    <p className="fos-sr-only">{order.title} · {order.company} · Только просмотр.</p>
    <div className="fos-order-detail__body">
      {role === 'manager' && <FOSInput wrapperClassName="fos-order-detail__company" label="Компания" value={order.company} readOnly />}
      <section className="fos-order-detail__products" aria-labelledby="order-detail-items-title">
        <FosSectionHeading id="order-detail-items-title">Продукция</FosSectionHeading>
        {detail.items.length ? <ul className="fos-order-detail__items">{detail.items.map((item, index) => <li key={item.id}><OrderItemSummary item={item} position={index + 1} /></li>)}</ul>
          : <p className="fos-order-detail__empty">Позиции не указаны.</p>}
      </section>
      <section className="fos-order-detail__general" aria-labelledby="order-detail-general-title"><FosSectionHeading id="order-detail-general-title">Общие данные заказа</FosSectionHeading>
        <OrderDateFields className="fos-order-detail__dates">
          <FOSDatePicker label="Желаемый срок" value={dateValue(detail.requestedDate)} readOnly />
          <FOSDatePicker label="Согласованный срок" value={dateValue(detail.agreedDate)} readOnly />
        </OrderDateFields>
      </section>
      <SignedDocumentsSection key={'docs'+JSON.stringify([order.company,order.id])} context={JSON.stringify(['order',order.company,order.id])} canAdd={false} />
      <OrderConversation key={JSON.stringify([order.company,order.id,role])} context={JSON.stringify(['order',order.company,order.id])} actor={role} canReply={canReply} phase={order.communication?.phase??'readonly'} legacyComment={detail.comment} />
      {managerIntake && <ManagerDemoIntake state={demoProcessingState} onStateChange={onDemoProcessingStateChange} demoEnabled={demoProcessingEnabled} />}
    </div>
  </div>
}
