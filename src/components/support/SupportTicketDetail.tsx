import type { DemoSupportTicket } from '@/demo/support-fixtures'
import { ConversationPanel, type ConversationHandle, type ConversationState } from '@/components/messaging/ConversationPanel'
import type { Ref } from 'react'

export function SupportTicketDetail({ ticket, submitted = false, canReply = true, conversationRef, onStateChange }: { ticket: DemoSupportTicket; submitted?: boolean; canReply?: boolean; conversationRef?:Ref<ConversationHandle>; onStateChange?:(state:ConversationState)=>void }) {
  return <section className="fos-support-detail" data-testid="support-ticket-detail" aria-label="Содержание обращения">
    {submitted && <p className="fos-support-detail__outcome" role="status">Обращение отправлено · только в этой демосессии. Сервер не подключён.</p>}
    <p className="fos-support-detail__status">{ticket.statusText}</p>
    <ConversationPanel ref={conversationRef} onStateChange={onStateChange} key={JSON.stringify([ticket.owner,ticket.id])} context={JSON.stringify(['support',ticket.owner,ticket.id])} actor={ticket.owner} author="Вы" canReply={canReply} requireText seed={[
      { id: ticket.id + '-first', actor: ticket.owner, author: 'Вы', text: ticket.description, time: ticket.date, file: ticket.file, local: submitted, readBy:ticket.reply ? ['support'] : [] },
      ...(ticket.reply ? [{ id: ticket.id + '-reply', actor: 'support', author: 'Поддержка Flexomir OS', text: ticket.reply.message, time: ticket.reply.date }] : []),
    ]} />
  </section>
}
