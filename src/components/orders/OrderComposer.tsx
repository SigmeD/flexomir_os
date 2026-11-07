import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { canSendDemo, itemSummary, validDemoDate, type DemoDraft, type DemoItem } from '@/demo/order-compose-model'
import { HeaderAction } from '@/components/ui/header-action'
import { PageHeader } from '@/components/ui/page-header'
import { OverflowMenu } from '@/components/ui/overflow-menu'
import { FOSDateField, FOSSelect, FOSTextarea } from '@/components/ui/fos-controls'
import { OrderItemForm } from './OrderItemForm'
import { OrderItemRow } from './OrderItemRow'
import { SectionAddItem } from './SectionAddItem'
import type { CabinetSection } from '@/components/layout/CabinetPage'
import './order-compose.css'

/** One CURRENT composition for New/Repeat. Draft changes are ephemeral, never server autosave. */
export function OrderComposer({ draft, onSave, onSend, onBack, onItemEditorChange, onNavigationSectionChange, managerCompanies = [] }: {
  draft: DemoDraft; onSave: (draft: DemoDraft) => void; onSend: (draft: DemoDraft) => void; onBack: () => void
  onItemEditorChange?: (open: boolean) => void
  onNavigationSectionChange?: (section: CabinetSection) => void
  managerCompanies?: readonly { id: string; name: string }[]
}) {
  const [value, setValue] = useState(draft)
  const [editing, setEditing] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const managerUnsaved = value.ownerRole === 'manager' && JSON.stringify(value) !== JSON.stringify(draft)
  const nextItem = useRef(1)
  const returnFocus = useRef<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  // A manager's unsaved company/items/date also block navigation and demo reset.
  useEffect(() => {
    onItemEditorChange?.(editing !== null || managerUnsaved)
    return () => onItemEditorChange?.(false)
  }, [editing, managerUnsaved, onItemEditorChange])
  useLayoutEffect(() => {
    if (editing !== null) return
    const target = returnFocus.current ? root.current?.querySelector<HTMLElement>(returnFocus.current) : root.current?.querySelector<HTMLElement>('h1')
    target?.focus({ preventScroll: true })
    returnFocus.current = null
  }, [editing])
  function save(next: DemoDraft) {
    setValue(next); if (value.ownerRole !== 'manager') onSave(next); setFeedback('Черновик сохранён только в памяти страницы')
  }
  function addItem() { returnFocus.current = '[data-add-item]'; setEditing('new') }
  function saveItem(item: DemoItem) {
    const existing = value.items.find(current => current.id === editing)
    let id = existing?.id
    if (!id) { do { id = value.id + '-ITEM-' + nextItem.current++ } while (value.items.some(current => current.id === id)) }
    save({ ...value, items: existing ? value.items.map(current => current.id === existing.id ? { ...item, id } : current) : [...value.items, { ...item, id }] })
    setEditing(null)
  }
  return <div className="fos-order-composer" ref={root} data-testid="order-composer" data-order-id={value.id}>
    {editing === null ? <>
      <PageHeader title="Новый заказ" subtitle={value.ownerRole === 'manager' ? 'Черновик менеджера · приватно в демосессии' : 'Черновик'} breadcrumbs={[{ label: value.ownerRole === 'manager' ? 'Заказы' : 'Мои заказы', onSelect: onBack, disabled: managerUnsaved }, { label: 'Новый заказ' }]} actions={<>
        {value.ownerRole === 'manager'
          ? <HeaderAction action="save" accessibleName="Сохранить черновик менеджера" disabled={JSON.stringify(value) === JSON.stringify(draft) || !value.company} onAction={() => { onSave(value); setFeedback('Черновик сохранён только в памяти страницы') }} />
          : <HeaderAction action="send" accessibleName="Передать менеджеру (демо)" disabled={!canSendDemo(value)} onAction={() => onSend(value)} />}
        <OverflowMenu items={[
          { id: 'add', label: 'Добавить позицию', onSelect: addItem, focusAfter: 'consumer' },
          { id: 'delete', label: 'Удалить черновик', disabled: true, reason: 'Удаление не согласовано' },
        ]} />
      </>} />
      <div className="fos-order-composer__body">
        {value.ownerRole === 'manager' && <FOSSelect wrapperClassName="fos-order-composer__company" label="Компания" value={managerCompanies.find(company => company.name === value.company)?.id ?? ''} onChange={event => {
          const selected = managerCompanies.find(company => company.id === event.target.value)
          if (selected) save({ ...value, company: selected.name })
        }} required>
          <option value="">Выберите компанию</option>{managerCompanies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
        </FOSSelect>}
        <section className="fos-order-composer__products" data-empty={value.items.length === 0 || undefined} aria-labelledby="compose-products-title">
          <div className="fos-order-composer__section-heading"><h2 id="compose-products-title">Продукция</h2><SectionAddItem onClick={addItem} /></div>
          {value.items.length ? <ul className="fos-order-detail__items">{value.items.map((item, index) => <li key={item.id} data-item-id={item.id}>
            <OrderItemRow item={itemSummary(item)} position={index + 1} onOpen={() => { returnFocus.current = '[data-item-id="' + item.id + '"] button'; setEditing(item.id) }} />
          </li>)}</ul> : <p className="fos-order-detail__empty">Позиция ещё не добавлена. Добавьте первую позицию.</p>}
        </section>
        <section className="fos-order-composer__general" aria-labelledby="compose-general-title"><h2 id="compose-general-title">Общие данные заказа</h2>
          <FOSDateField wrapperClassName="fos-order-composer__date" label="Желаемый срок" value={value.requestedDate} error={!validDemoDate(value.requestedDate) ? 'Проверьте дату' : undefined} onChange={event => save({ ...value, requestedDate: event.target.value })} />
          <FOSTextarea label="Комментарии" placeholder="Необязательно" value={value.comment} onChange={event => save({ ...value, comment: event.target.value })} />
        </section>
      </div>
      <p className="fos-sr-only" role="status">{feedback || 'Черновик только в памяти страницы'}</p>
    </> : <OrderItemForm key={editing} item={value.items.find(item => item.id === editing)} onSave={saveItem} onClose={() => setEditing(null)} onBackToList={onBack} onNavigationSectionChange={onNavigationSectionChange} />}
  </div>
}
