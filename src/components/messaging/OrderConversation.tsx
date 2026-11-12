import { ConversationPanel } from './ConversationPanel'
import { useId } from 'react'

// Memory-only adapters and drafts. Context includes company and object; no cross-thread fallback.
export function OrderConversation({ context, actor, canReply, legacyComment = '' }: { context: string; actor: 'client' | 'manager'; canReply: boolean; legacyComment?: string }) {
  const heading = useId()
  return <section className="fos-order-conversation" aria-labelledby={heading}><h2 id={heading}>Комментарии</h2>
    <ConversationPanel key={JSON.stringify([context,actor])} context={context} actor={actor} author={actor === 'client' ? 'Клиент' : 'Менеджер'} canReply={canReply}
      seed={legacyComment ? [{ id: 'legacy', text: legacyComment, author: 'Комментарий заказа', actor: 'legacy', time: '' }] : []} />
  </section>
}
