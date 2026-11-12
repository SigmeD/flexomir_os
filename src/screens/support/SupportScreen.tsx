import { useRef, useState } from 'react'
import { CabinetPage, type CabinetRole, type CabinetSection } from '@/components/layout/CabinetPage'
import { usePreviewNavigation } from '@/components/layout/usePreviewNavigation'
import { PageHeader } from '@/components/ui/page-header'
import { HeaderAction } from '@/components/ui/header-action'
import { MoreAction } from '@/components/ui/overflow-menu'
import { SupportTicketRow } from '@/components/support/SupportTicketRow'
import { SupportTicketForm, type SupportInput } from '@/components/support/SupportTicketForm'
import { SupportTicketDetail } from '@/components/support/SupportTicketDetail'
import { supportFixtures, type DemoSupportTicket } from '@/demo/support-fixtures'
import type { MessageDraft } from '@/components/messaging/message-model'

/** Shared requester UI. Manager is not a support operator; local follow-up requires an explicit demo capability. */
export function SupportScreen({ role, empty = false, errorFixture = false, onNavigate }: { role: CabinetRole; empty?: boolean; errorFixture?: boolean; onNavigate?: (section: CabinetSection) => void }) {
  const [tickets, setTickets] = useState<readonly DemoSupportTicket[]>(() => empty ? [] : supportFixtures(role))
  const [input, setInput] = useState<SupportInput>({ subject: '', description: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof SupportInput, boolean>>>({})
  const [error, setError] = useState('')
  const submitted = useRef(new Set<string>())
  const sequence = useRef(100)
  const operations = useRef(new Map<string,string>())
  const failedOnce = useRef(false)
  const nav = usePreviewNavigation()
  const own = tickets.filter(ticket => ticket.owner === role)
  const ticket = own.find(item => 'ticket/' + item.id === nav.path)
  const creating = nav.path === 'new'
  const valid = Boolean(input.subject.trim() && input.description.trim())
  async function send(draft: MessageDraft, operationId: string) {
    if (!creating || !valid || !draft.text.trim()) throw new Error('Укажите тему и описание обращения')
    if (errorFixture && !failedOnce.current) { failedOnce.current = true; throw new Error('Демо: Ошибка отправки. Повторите попытку; ввод сохранён локально.') }
    const previous = operations.current.get(operationId)
    if (previous) { nav.replace('ticket/' + previous); return }
    const id = role + '-' + sequence.current++
    operations.current.set(operationId,id)
    setTickets(current => [...current, { id, owner: role, subject: input.subject.trim(), description: draft.text.trim(), file: draft.file, date: 'Демосессия', statusText: 'Сохранено только в демосессии' }])
    submitted.current.add(id)
    setInput({ subject: '', description: '' }); setTouched({}); setError('')
    // Replace the create page: Back returns to the own list, not a resubmittable form.
    nav.replace('ticket/' + id)
  }
  const title = ticket?.subject ?? (creating ? 'Новое обращение' : 'Мои обращения')
  const parentBreadcrumb = ticket && role === 'client' ? 'Поддержка' : 'Мои обращения'
  return <CabinetPage role={role} section="support" onNavigate={onNavigate}>
    <PageHeader title={title} floatingWorkActions autoFocus={creating || Boolean(ticket)} breadcrumbs={nav.path === 'list' ? [{ label: 'Мои обращения' }] : [{ label: parentBreadcrumb, onSelect: nav.back }, { label: title }]}
      actions={creating ? undefined : <><HeaderAction action={nav.path === 'list' ? 'add' : 'save'} accessibleName={nav.path === 'list' ? 'Добавить обращение' : 'Сохранить обращение'} data-focus-key="support-add"
        disabled={nav.path !== 'list' && !ticket} onAction={nav.path === 'list' ? () => nav.open('new') : nav.back} /><MoreAction disabled /></>} />
    {ticket ? <SupportTicketDetail ticket={ticket} submitted={submitted.current.has(ticket.id)} canReply={new URLSearchParams(window.location.search).get('commDemo') === '1'} /> : creating ? <SupportTicketForm value={input} onChange={setInput} descriptionLabel={role === 'client' ? 'Описание' : 'Сообщение'} touched={touched} onBlur={field => setTouched(current => ({ ...current, [field]: true }))} error={error} onSubmit={send} /> : <>
      <ul className="fos-cabinet__rows fos-support-list" aria-label="Мои обращения">{own.map(item => <li key={item.id}><SupportTicketRow ticket={item} onOpen={() => nav.open('ticket/' + item.id, { attribute: 'data-focus-key', value: 'ticket-' + item.id })} /></li>)}</ul>
      {!own.length && <p className="fos-cabinet__empty" data-testid="support-empty" role="status">Обращений пока нет.</p>}
    </>}
    <p className="fos-cabinet__notice">Демонстрационные обращения и ответы команды. Данные существуют только в этой демосессии.</p>
  </CabinetPage>
}
