import type { DemoSupportTicket } from '@/demo/support-fixtures'
import { ArtworkThumbnail } from '@/components/ui/artwork-thumbnail'
import chevron from '@/assets/orders/chevron.svg'
import './support.css'

export function SupportTicketRow({ ticket, onOpen }: { ticket: DemoSupportTicket; onOpen: () => void }) {
  return <button type="button" className="fos-cabinet__row fos-support-row" onClick={onOpen} data-testid={'ticket-row-' + ticket.id} data-focus-key={'ticket-' + ticket.id}>
    <ArtworkThumbnail label="ТКТ" /><span className="fos-cabinet__row-copy"><strong>{ticket.subject}</strong><small>{ticket.date} · {ticket.statusText}</small></span>
    <img className="fos-cabinet__chevron" src={chevron} alt="" />
  </button>
}
