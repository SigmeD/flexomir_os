import { useCallback, useRef, useState } from 'react'
import { CabinetPage, type CabinetRole, type CabinetSection } from '@/components/layout/CabinetPage'
import { usePreviewNavigation } from '@/components/layout/usePreviewNavigation'
import { PageHeader } from '@/components/ui/page-header'
import { HeaderAction } from '@/components/ui/header-action'
import { MoreAction, OverflowMenu } from '@/components/ui/overflow-menu'
import { SupportTicketRow } from '@/components/support/SupportTicketRow'
import { SupportTicketForm, type SupportInput } from '@/components/support/SupportTicketForm'
import { SupportTicketDetail } from '@/components/support/SupportTicketDetail'
import { supportFixtures, type DemoSupportTicket } from '@/demo/support-fixtures'
import type { MessageDraft } from '@/components/messaging/message-model'
import type { MessageComposerHandle } from '@/components/messaging/MessageComposer'
import type { ConversationHandle, ConversationState } from '@/components/messaging/ConversationPanel'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { deleteLocalContext } from '@/components/messaging/local-communication'

/** Shared requester UI. Owner enabled local follow-up; Manager remains a requester, not a support operator. */
export function SupportScreen({ role, empty = false, errorFixture = false, onNavigate }: { role: CabinetRole; empty?: boolean; errorFixture?: boolean; onNavigate?: (section: CabinetSection) => void }) {
  const [tickets, setTickets] = useState<readonly DemoSupportTicket[]>(() => empty ? [] : supportFixtures(role))
  const [input, setInput] = useState<SupportInput>({ subject: '', description: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof SupportInput, boolean>>>({})
  const [error, setError] = useState('')
  const submitted = useRef(new Set<string>())
  const sequence = useRef(100)
  const operations = useRef(new Map<string,string>())
  const failedOnce = useRef(false)
  const createComposer = useRef<MessageComposerHandle>(null), conversation = useRef<ConversationHandle>(null)
  const saveToList = useRef(false), saveLock = useRef(false)
  const [saving,setSaving] = useState(false),[createBusy,setCreateBusy] = useState(false),[confirmDelete,setConfirmDelete] = useState(false)
  const [conversationState,setConversationState] = useState<ConversationState & {id:string}>({id:'',dirty:false,canSave:true,busy:false})
  const nav = usePreviewNavigation()
  const own = tickets.filter(ticket => ticket.owner === role)
  const ticket = own.find(item => 'ticket/' + item.id === nav.path)
  const onConversationState = useCallback((state:ConversationState)=>setConversationState({...state,id:ticket?.id??''}),[ticket?.id])
  const creating = nav.path === 'new'
  const valid = Boolean(input.subject.trim() && input.description.trim())
  async function send(draft: MessageDraft, operationId: string) {
    if (!creating || !valid || !draft.text.trim()) throw new Error('Укажите тему и описание обращения')
    if (errorFixture && !failedOnce.current) { failedOnce.current = true; throw new Error('Демо: Ошибка отправки. Повторите попытку; ввод сохранён локально.') }
    const previous = operations.current.get(operationId)
    if (previous) { nav.replace(saveToList.current ? 'list' : 'ticket/' + previous); return }
    const id = role + '-' + sequence.current++
    operations.current.set(operationId,id)
    setTickets(current => [...current, { id, owner: role, subject: input.subject.trim(), description: draft.text.trim(), file: draft.file, date: 'Демосессия', statusText: 'Сохранено только в демосессии' }])
    submitted.current.add(id)
    setInput({ subject: '', description: '' }); setTouched({}); setError('')
    // Replace the create page: Back returns to the own list, not a resubmittable form.
    if(saveToList.current)nav.replace('list')
    else nav.replace('ticket/' + id)
  }
  const state=conversationState.id===ticket?.id ? conversationState : {dirty:false,canSave:true,busy:false}
  const busy=saving || createBusy || Boolean(ticket&&state.busy)
  const canSave=creating ? valid&&!busy : Boolean(ticket&&!busy&&state.canSave&&state.dirty)
  async function save() {
    if(!canSave||saveLock.current)return
    saveLock.current=true;setSaving(true)
    try{
      if(creating){saveToList.current=true;await createComposer.current?.submit()}
      else if(ticket&&await conversation.current?.commit())nav.back()
    }finally{saveToList.current=false;saveLock.current=false;setSaving(false)}
  }
  function removeTicket(){
    if(busy)return
    if(ticket){
      deleteLocalContext(JSON.stringify(['support',ticket.owner,ticket.id]))
      setTickets(current=>current.filter(item=>item.id!==ticket.id));submitted.current.delete(ticket.id)
    }
    setInput({subject:'',description:''});setTouched({});setError('');setConfirmDelete(false);nav.replace('list')
  }
  function cancelDelete(){setConfirmDelete(false);requestAnimationFrame(()=>document.querySelector<HTMLElement>(`[data-testid="${role}-support-screen"] .fos-more`)?.focus({preventScroll:true}))}
  const title = ticket?.subject ?? (creating ? 'Новое обращение' : 'Мои обращения')
  const parentBreadcrumb = ticket && role === 'client' ? 'Поддержка' : 'Мои обращения'
  return <CabinetPage role={role} section="support" onNavigate={onNavigate}>
    <PageHeader title={title} floatingWorkActions autoFocus={creating || Boolean(ticket)} breadcrumbs={nav.path === 'list' ? [{ label: 'Мои обращения' }] : [{ label: parentBreadcrumb, onSelect: nav.back }, { label: title }]}
      actions={<><HeaderAction action={nav.path === 'list' ? 'add' : 'save'} accessibleName={nav.path === 'list' ? 'Добавить обращение' : 'Сохранить обращение'} data-focus-key="support-add"
        disabled={nav.path !== 'list' && !canSave} onAction={nav.path === 'list' ? () => nav.open('new') : ()=>{void save()}} />{nav.path==='list' ? <MoreAction disabled/> : <OverflowMenu disabled={busy} label="Действия обращения" items={[
          {id:'delete',label:'Удалить обращение',onSelect:()=>setConfirmDelete(true),focusAfter:'consumer'},
          {id:'duplicate',label:'Дублировать обращение',disabled:true},
        ]}/>}</>} />
    {ticket ? <SupportTicketDetail conversationRef={conversation} onStateChange={onConversationState} ticket={ticket} submitted={submitted.current.has(ticket.id)} canReply /> : creating ? <SupportTicketForm composerRef={createComposer} onBusyChange={setCreateBusy} value={input} onChange={setInput} descriptionLabel={role === 'client' ? 'Описание' : 'Сообщение'} touched={touched} onBlur={field => setTouched(current => ({ ...current, [field]: true }))} error={error} onSubmit={send} /> : <>
      <ul className="fos-cabinet__rows fos-support-list" aria-label="Мои обращения">{own.map(item => <li key={item.id}><SupportTicketRow ticket={item} onOpen={() => nav.open('ticket/' + item.id, { attribute: 'data-focus-key', value: 'ticket-' + item.id })} /></li>)}</ul>
      {!own.length && <p className="fos-cabinet__empty" data-testid="support-empty" role="status">Обращений пока нет.</p>}
    </>}
    {confirmDelete&&<ConfirmDialog open title="Удалить обращение?" body="Обращение и его локальная переписка будут удалены из этой демосессии." confirmLabel="Удалить" cancelLabel="Отмена" onConfirm={removeTicket} onCancel={cancelDelete}/>}
    <p className="fos-cabinet__notice">Демонстрационные обращения и ответы команды. Данные существуют только в этой демосессии.</p>
  </CabinetPage>
}
