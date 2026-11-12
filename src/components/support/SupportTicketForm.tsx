import { FOSInput } from '@/components/ui/fos-controls'
import { MessageComposer, type MessageComposerHandle } from '@/components/messaging/MessageComposer'
import type { Ref } from 'react'
import { MessageThread } from '@/components/messaging/MessageThread'
import type { MessageDraft } from '@/components/messaging/message-model'

export interface SupportInput { subject: string; description: string }
export function SupportTicketForm({ value, onChange, descriptionLabel, touched, onBlur, error, onSubmit, composerRef, onBusyChange }: {
  value: SupportInput; onChange: (value: SupportInput) => void; descriptionLabel: string
  touched: Partial<Record<keyof SupportInput, boolean>>; onBlur: (field: keyof SupportInput) => void; error?: string; onSubmit: (draft: MessageDraft, operationId: string) => Promise<void>
  composerRef?: Ref<MessageComposerHandle>; onBusyChange?:(busy:boolean)=>void
}) {
  return <div className="fos-support-form" data-testid="support-ticket-form">
    <FOSInput label="Тема" placeholder="Коротко опишите проблему или вопрос" value={value.subject} required
      onChange={event => onChange({ ...value, subject: event.target.value })} onBlur={() => onBlur('subject')}
      error={touched.subject && !value.subject.trim() ? 'Укажите тему обращения' : undefined} />
    <div className="fos-field"><span className="fos-field__label">{descriptionLabel}</span><MessageThread messages={[]} ownActor="requester" showHistory={false}>
      <MessageComposer ref={composerRef} onBusyChange={onBusyChange} label={descriptionLabel} text={value.description} onTextChange={description => onChange({ ...value, description })}
        canSubmit={Boolean(value.subject.trim() && value.description.trim())} requiredText onBlur={() => onBlur('description')} error={error || (touched.description && !value.description.trim() ? 'Опишите обращение' : undefined)} onSubmit={onSubmit} clearOnSuccess={false} submitLabel="Отправить обращение локально" />
    </MessageThread></div>
  </div>
}
