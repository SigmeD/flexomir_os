import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { canEditDemoItems, canSendDemo, itemSummary, validDemoDate, validDemoItem, validDemoReview, type DemoDraft, type DemoItem } from '@/demo/order-compose-model'
import { HeaderAction } from '@/components/ui/header-action'
import { PageHeader } from '@/components/ui/page-header'
import { FosSectionHeading } from '@/components/ui/fos-section-heading'
import { OverflowMenu } from '@/components/ui/overflow-menu'
import { FOSInput, FOSSelect } from '@/components/ui/fos-controls'
import { FOSDatePicker } from '@/components/ui/fos-date-picker'
import { displayDate } from '@/components/ui/date-only'
import { OrderItemForm } from './OrderItemForm'
import { OrderItemRow } from './OrderItemRow'
import { OrderDateFields } from './OrderDateFields'
import { SectionAddItem } from './SectionAddItem'
import type { OrderItemExitActions } from './OrderItemForm'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import type { CabinetSection } from '@/components/layout/CabinetPage'
import './order-compose.css'
import { OrderConversation } from '@/components/messaging/OrderConversation'
import { SignedDocumentsSection } from '@/components/documents/SignedDocumentsSection'

/** One CURRENT composition for New/Repeat. Draft changes are ephemeral, never server autosave. */
export function OrderComposer({ draft, isNewDraft = false, onSave, onSend, onBack, onItemEditorChange, onDraftDirtyChange, onNavigationSectionChange, onItemExitActionsChange, onDeleteDraft, managerCompanies = [], actorRole = draft.ownerRole, onCancelReview, onOrderExitActionsChange }: {
  draft: DemoDraft; onSave: (draft: DemoDraft) => void; onSend: (draft: DemoDraft) => void; onBack: () => void
  isNewDraft?: boolean
  onItemEditorChange?: (open: boolean) => void
  onDraftDirtyChange?: (dirty: boolean) => void
  onNavigationSectionChange?: (section: CabinetSection) => void
  onItemExitActionsChange?: (actions: OrderItemExitActions | null) => void
  onDeleteDraft?: (id: string) => void
  managerCompanies?: readonly { id: string; name: string }[]
  actorRole?: DemoDraft['ownerRole']
  onCancelReview?: () => void
  onOrderExitActionsChange?: (actions: OrderItemExitActions | null) => void
}) {
  const [value, setValue] = useState(draft)
  const valueRef = useRef(value)
  const isReview = draft.stage === 'sent'
  const editable = canEditDemoItems(draft, actorRole)
  const [copySeed, setCopySeed] = useState<DemoItem | undefined>()
  const [requestedDateInput, setRequestedDateInput] = useState(() => displayDate(draft.requestedDate))
  const [dateInputValid, setDateInputValid] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const nextItem = useRef(1)
  const returnFocus = useRef<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  function cancelDelete() {
    setConfirmDelete(false)
    root.current?.querySelector<HTMLButtonElement>('button.fos-more')?.focus({ preventScroll: true })
  }
  useEffect(() => { onItemEditorChange?.(editing !== null); return () => onItemEditorChange?.(false) }, [editing, onItemEditorChange])
  useEffect(() => { onDraftDirtyChange?.(JSON.stringify(value) !== JSON.stringify(draft) || !dateInputValid || requestedDateInput !== displayDate(draft.requestedDate)); return () => onDraftDirtyChange?.(false) }, [value, draft, dateInputValid, requestedDateInput, onDraftDirtyChange])
  useLayoutEffect(() => {
    if (editing !== null) return
    const target = returnFocus.current ? root.current?.querySelector<HTMLElement>(returnFocus.current) : root.current?.querySelector<HTMLElement>('h1')
    target?.focus({ preventScroll: true })
    returnFocus.current = null
  }, [editing])
  useEffect(() => {
    if (!isReview) return
    onOrderExitActionsChange?.({
      dirty: JSON.stringify(value) !== JSON.stringify(draft) || !dateInputValid || requestedDateInput !== displayDate(draft.requestedDate),
      commit: () => {
        const current = valueRef.current
        if (!editable || !dateInputValid || !validDemoReview(current)) return false
        onSave(current)
        return true
      },
      discard: () => onCancelReview?.(),
    })
    return () => onOrderExitActionsChange?.(null)
  }, [value, draft, editable, dateInputValid, requestedDateInput, isReview, onOrderExitActionsChange, onSave, onCancelReview])
  function save(next: DemoDraft) {
    if (!editable) return
    valueRef.current = next
    setValue(next); if (!isReview && actorRole !== 'manager') onSave(next); setFeedback('Изменения только в памяти страницы')
  }
  function addItem() { if (!editable) return; setCopySeed(undefined); returnFocus.current = '[data-add-item]'; setEditing('new') }
  function commitItem(item: DemoItem) {
    if (!editable || !validDemoItem(item)) return
    const currentValue = valueRef.current
    const existing = currentValue.items.find(current => current.id === editing)
    let id = existing?.id
    if (!id) { do { id = currentValue.id + '-ITEM-' + nextItem.current++ } while (currentValue.items.some(current => current.id === id)) }
    save({ ...currentValue, items: existing ? currentValue.items.map(current => current.id === existing.id ? { ...item, id } : current) : [...currentValue.items, { ...item, id }] })
  }
  function saveItem(item: DemoItem) {
    if (!editable || !validDemoItem(item)) return
    commitItem(item)
    setEditing(null)
  }
  function duplicateItem() {
    if (!editable) return
    const source = valueRef.current.items.find(item => item.id === editing)
    if (!source) return
    setCopySeed({ ...source, id: '' })
    setEditing('copy')
  }
  function deleteItem() {
    const current = valueRef.current
    if (!editable || (isReview && current.items.length <= 1)) return
    const index = current.items.findIndex(item => item.id === editing)
    if (index < 0) return
    const items = current.items.filter(item => item.id !== editing)
    const next = items[Math.min(index, items.length - 1)]
    returnFocus.current = next ? '[data-item-id="' + next.id + '"] button' : '[data-add-item]'
    save({ ...current, items })
    setEditing(null)
  }
  const title = isNewDraft ? 'Новый заказ' : 'Заказ ' + value.id
  return <div className="fos-order-composer" ref={root} data-testid="order-composer" data-order-id={value.id} data-order-role={value.ownerRole}>
    {editing === null ? <>
      <PageHeader title={title} floatingWorkActions subtitle={isReview ? 'На рассмотрении' : 'Черновик'} subtitleRole="status" breadcrumbs={[{ label: actorRole === 'manager' ? 'Заказы' : 'Мои заказы', onSelect: onBack }, { label: title }]} actions={<>
        {isReview ? <HeaderAction action="save" accessibleName="Сохранить заказ" disabled={!editable || !dateInputValid || !validDemoReview(value) || JSON.stringify(value) === JSON.stringify(draft)} onAction={() => { if (editable && dateInputValid && validDemoReview(value)) onSave(value) }} /> : value.ownerRole === 'manager'
          ? <HeaderAction action="save" accessibleName="Сохранить черновик менеджера" disabled={!dateInputValid || JSON.stringify(value) === JSON.stringify(draft) || !value.company} onAction={() => { if (!dateInputValid) return; onSave(value); setFeedback('Черновик сохранён только в памяти страницы') }} />
          : <HeaderAction action="send" accessibleName="Передать менеджеру (демо)" disabled={!dateInputValid || !canSendDemo(value)} onAction={() => { if (dateInputValid && canSendDemo(value)) onSend(value) }} />}
        <OverflowMenu items={[
          { id: 'add', label: 'Добавить позицию', disabled: !editable, onSelect: addItem, focusAfter: 'consumer' },
          ...(isReview ? [{ id: 'cancel', label: 'Отменить изменения', onSelect: onCancelReview, focusAfter: 'consumer' as const }] : [{ id: 'delete', label: 'Удалить черновик', disabled: !onDeleteDraft, reason: onDeleteDraft ? undefined : 'Удаление доступно только для черновика демосессии', onSelect: () => setConfirmDelete(true) }]),
        ]} />
      </>} />
      <div className="fos-order-composer__body">
        {actorRole === 'manager' && isReview && <FOSInput wrapperClassName="fos-order-composer__company" label="Компания" value={value.company} readOnly />}
        {actorRole === 'manager' && !isReview && <FOSSelect wrapperClassName="fos-order-composer__company" label="Компания" value={managerCompanies.find(company => company.name === value.company)?.id ?? ''} onChange={event => {
          const selected = managerCompanies.find(company => company.id === event.target.value)
          if (selected) save({ ...value, company: selected.name })
        }} required>
          <option value="">Выберите компанию</option>{managerCompanies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
        </FOSSelect>}
        <section className="fos-order-composer__products" data-empty={value.items.length === 0 || undefined} aria-labelledby="compose-products-title">
          <div className="fos-order-composer__section-heading"><FosSectionHeading id="compose-products-title">Продукция</FosSectionHeading>{editable && <SectionAddItem onClick={addItem} />}</div>
          {value.items.length ? <ul className="fos-order-detail__items">{value.items.map((item, index) => <li key={item.id} data-item-id={item.id}>
            <OrderItemRow item={itemSummary(item)} position={index + 1} onOpen={() => { returnFocus.current = '[data-item-id="' + item.id + '"] button'; setEditing(item.id) }} />
          </li>)}</ul> : <p className="fos-order-detail__empty">Позиция ещё не добавлена. Добавьте первую позицию.</p>}
        </section>
        <section className="fos-order-composer__general" aria-labelledby="compose-general-title"><FosSectionHeading id="compose-general-title">Общие данные заказа</FosSectionHeading>
          <OrderDateFields className="fos-order-composer__dates">
            <FOSDatePicker label="Желаемый срок" value={value.requestedDate} inputDraft={requestedDateInput} onInputDraftChange={setRequestedDateInput} onValidityChange={setDateInputValid}
              error={!dateInputValid || !validDemoDate(value.requestedDate) ? 'Проверьте дату' : undefined} onValueChange={requestedDate => save({ ...value, requestedDate })} />
            {value.ownerRole === 'client' && <FOSDatePicker label="Согласованный срок" value="" readOnly />}
          </OrderDateFields>
        </section>
        <SignedDocumentsSection key={'docs'+JSON.stringify([value.company,value.id])} context={JSON.stringify(['order',value.company,value.id])} canAdd={editable} />
        <OrderConversation key={JSON.stringify([value.company,value.id,actorRole])} context={JSON.stringify(['order',value.company,value.id])} actor={actorRole} canReply={value.communication?.canReply ?? false} phase={value.communication?.phase??'open'} legacyComment={value.comment} />
      </div>
      <p className="fos-sr-only" role="status">{feedback || 'Черновик только в памяти страницы'}</p>
      <ConfirmDialog open={confirmDelete} title="Удалить черновик?" body="Черновик будет удалён из текущей демонстрационной сессии." confirmLabel="Да" cancelLabel="Отмена" onConfirm={() => {
        onDeleteDraft?.(value.id)
        setConfirmDelete(false)
        onBack()
      }} onCancel={cancelDelete} onDismiss={cancelDelete} />
    </> : <OrderItemForm key={editing} item={value.items.find(item => item.id === editing)} initialValue={editing === 'copy' ? copySeed : undefined} onSave={saveItem} onCommit={commitItem}
      onDuplicate={editable ? duplicateItem : undefined} onDelete={editable ? deleteItem : undefined} deleteDisabledReason={isReview && value.items.length <= 1 ? 'В заказе на рассмотрении должна остаться хотя бы одна позиция' : undefined}
      role={actorRole} orderLabel={title} onClose={() => setEditing(null)} onBackToList={onBack} onNavigationSectionChange={onNavigationSectionChange} onExitActionsChange={onItemExitActionsChange} />}
  </div>
}
