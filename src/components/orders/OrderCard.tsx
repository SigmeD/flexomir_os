import './order-card.css'
import chevron from '@/assets/orders/chevron.svg'

/**
 * Pure order summary. No knowledge of Manager/Client role, 1C enums or API.
 * The optional opener belongs to the preview host; no production routes or ACL here.
 */
export interface OrderCardProps {
  number: string
  title: string
  company: string
  statusLabel: string
  onOpen?: () => void
}

export function OrderCard({ number, title, company, statusLabel, onOpen }: OrderCardProps) {
  const content = <><span className="fos-order-card__thumbnail" aria-hidden="true">МАКЕТ</span><span className="fos-order-card__content"><strong className="fos-order-card__number">Заказ {number}</strong><span className="fos-order-card__meta"><span className="fos-order-card__status">{statusLabel}</span> · <span className="fos-order-card__company">{company}</span></span><span className="fos-sr-only">{title}</span></span><img className="fos-order-card__chevron" src={chevron} alt="" /></>
  return (
    <article className="fos-order-card" data-testid={'order-card-' + number}>
      {onOpen ? <button type="button" className="fos-order-card__open" onClick={onOpen} aria-label={'Открыть заказ ' + number} data-order-open={number}>{content}</button> : <div className="fos-order-card__open">{content}</div>}
    </article>
  )
}
