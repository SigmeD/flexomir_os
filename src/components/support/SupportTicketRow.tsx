import { FosSummaryRow, FosSummaryRowCopy } from '@/components/ui/fos-summary-row'
import type { DemoSupportTicket } from '@/demo/support-fixtures'
import { ArtworkThumbnail } from '@/components/ui/artwork-thumbnail'
import './support.css'

export function SupportTicketRow({ ticket, onOpen }: { ticket: DemoSupportTicket; onOpen: () => void }) {
  return <FosSummaryRow type="button" className="fos-support-row" onClick={onOpen} data-testid={'ticket-row-' + ticket.id} data-focus-key={'ticket-' + ticket.id}
    leading={<ArtworkThumbnail label="ТКТ" />}>
    <FosSummaryRowCopy className="fos-cabinet__row-copy" title={ticket.subject} metadata={<>{ticket.date} · {ticket.statusText}</>} />
  </FosSummaryRow>
}
