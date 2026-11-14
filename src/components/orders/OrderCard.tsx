import { FosSummaryRow, FosSummaryRowCopy } from '@/components/ui/fos-summary-row'
import { ArtworkThumbnail } from '@/components/ui/artwork-thumbnail'
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
  const content = <><FosSummaryRowCopy className="fos-order-card__content" title={<>Заказ {number}</>} metadataAs="span"
    metadata={<><span className="fos-order-card__status">{statusLabel}</span> · <span className="fos-order-card__company">{company}</span></>}
    classes={{ title:'fos-order-card__number', metadata:'fos-order-card__meta' }}><span className="fos-sr-only">{title}</span></FosSummaryRowCopy><span className="fos-sr-only">Открыть заказ {number}</span></>
  const leading = <ArtworkThumbnail className="fos-order-card__thumbnail" />
  return (
    <article className="fos-order-card" data-testid={'order-card-' + number}>
      {onOpen ? <FosSummaryRow surface="card" leading={leading} type="button" className="fos-order-card__open" onClick={onOpen} data-order-open={number}>{content}</FosSummaryRow> : <FosSummaryRow readOnly surface="card" leading={leading} className="fos-order-card__open">{content}</FosSummaryRow>}
    </article>
  )
}
