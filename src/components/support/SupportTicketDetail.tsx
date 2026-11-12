import type { DemoSupportTicket } from '@/demo/support-fixtures'
import { ConversationPanel } from '@/components/messaging/ConversationPanel'

export function SupportTicketDetail({ ticket, submitted = false, canReply = false }: { ticket: DemoSupportTicket; submitted?: boolean; canReply?: boolean }) {
  return <section className="fos-support-detail" data-testid="support-ticket-detail" aria-label="Содержание обращения">
    {submitted && <p className="fos-support-detail__outcome" role="status">Обращение отправлено · только в этой демосессии. Сервер не подключён.</p>}
    <p className="fos-support-detail__status">{ticket.statusText}</p>
    <ConversationPanel key={JSON.stringify([ticket.owner,ticket.id])} context={JSON.stringify(['support',ticket.owner,ticket.id])} actor={ticket.owner} author="Вы" canReply={canReply} requireText seed={[
      { id: ticket.id + '-first', actor: ticket.owner, author: 'Вы', text: ticket.description, time: ticket.date, file: ticket.file, local: submitted },
      ...(ticket.reply ? [{ id: ticket.id + '-reply', actor: 'support', author: 'Поддержка Flexomir OS', text: ticket.reply.message, time: ticket.reply.date }] : []),
    ]} />
  </section>
}
