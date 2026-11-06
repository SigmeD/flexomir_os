import { FOSInput, FOSTextarea } from '@/components/ui/fos-controls'

export interface SupportInput { subject: string; description: string }
export function SupportTicketForm({ value, onChange, descriptionLabel, touched, onBlur, error, onSubmit }: {
  value: SupportInput; onChange: (value: SupportInput) => void; descriptionLabel: string
  touched: Partial<Record<keyof SupportInput, boolean>>; onBlur: (field: keyof SupportInput) => void; error?: string; onSubmit: () => void
}) {
  return <form className="fos-support-form" data-testid="support-ticket-form" onSubmit={event => { event.preventDefault(); onSubmit() }}>
    <FOSInput label="Тема" placeholder="Коротко опишите проблему или вопрос" value={value.subject} required
      onChange={event => onChange({ ...value, subject: event.target.value })} onBlur={() => onBlur('subject')}
      error={touched.subject && !value.subject.trim() ? 'Укажите тему обращения' : undefined} />
    <FOSTextarea label={descriptionLabel} placeholder="Опишите проблему или вопрос. При необходимости укажите номер заказа или макета." value={value.description} required
      onChange={event => onChange({ ...value, description: event.target.value })} onBlur={() => onBlur('description')}
      error={touched.description && !value.description.trim() ? 'Опишите обращение' : undefined} />
    {error && <p className="fos-field__error" role="alert">{error}</p>}
  </form>
}
