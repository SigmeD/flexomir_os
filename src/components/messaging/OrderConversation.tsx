import { ConversationPanel } from './ConversationPanel'
import { useId } from 'react'
import { FosSectionHeading } from '@/components/ui/fos-section-heading'
import type { ConversationPhase } from './message-model'

// Memory-only adapters and drafts. Context includes company and object; no cross-thread fallback.
export function OrderConversation({ context, actor, canReply, legacyComment = '', phase = 'open' }: { context: string; actor: 'client' | 'manager'; canReply: boolean; legacyComment?: string; phase?:ConversationPhase }) {
  const heading = useId()
  return <section className="fos-order-conversation" aria-labelledby={heading}><FosSectionHeading id={heading}>Комментарии</FosSectionHeading>
    <ConversationPanel key={JSON.stringify([context,actor])} phase={phase} context={context} actor={actor} author={actor === 'client' ? 'Клиент' : 'Менеджер'} canReply={canReply}
      seed={legacyComment ? [{ id: 'legacy', text: legacyComment, author: 'Комментарий заказа', actor: 'legacy', time: '' }] : []} />
  </section>
}
