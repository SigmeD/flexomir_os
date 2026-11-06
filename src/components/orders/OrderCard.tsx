import './order-card.css'

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
  return (
    <article className="fos-order-card" data-testid={'order-card-' + number}>
      <div className="fos-order-card__content">
        {onOpen ? (
          <button
            type="button"
            className="fos-order-card__open"
            onClick={onOpen}
            aria-label={'Открыть заказ ' + number}
            data-order-open={number}
          >
            {number}
          </button>
        ) : (
          <strong className="fos-order-card__number">{number}</strong>
        )}
        <span className="fos-order-card__title">{title}</span>
        <span className="fos-order-card__company">{company}</span>
      </div>
      <span className="fos-order-card__status">{statusLabel}</span>
    </article>
  )
}
