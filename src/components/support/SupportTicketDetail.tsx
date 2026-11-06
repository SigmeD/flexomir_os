import type { DemoSupportTicket } from '@/demo/support-fixtures'

export function SupportTicketDetail({ ticket, submitted = false }: { ticket: DemoSupportTicket; submitted?: boolean }) {
  return <section className="fos-support-detail" data-testid="support-ticket-detail" aria-label="Содержание обращения">
    {submitted && <p className="fos-support-detail__outcome" role="status">Обращение отправлено · только в этой демосессии. Сервер не подключён.</p>}
    <p className="fos-support-detail__status">{ticket.statusText}</p>
    <article className="fos-support-message"><h2>Вы</h2><div><p>{ticket.description}</p><small>{ticket.date}</small></div></article>
    {ticket.reply && <article className="fos-support-message fos-support-message--team" data-testid="support-team-reply"><h2>Поддержка Flexomir OS</h2><div><p>{ticket.reply.message}</p><small>{ticket.reply.date}</small></div></article>}
  </section>
}
