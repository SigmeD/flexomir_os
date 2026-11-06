import { useId, useLayoutEffect, useRef, useState } from 'react'
import { canSendDemo, itemSummary, validDemoDate, type DemoDraft, type DemoItem } from '@/demo/order-compose-model'
import { OrderItemForm } from './OrderItemForm'
import { OrderItemSummary } from './OrderItemSummary'
import sendIcon from '@/assets/orders/send.svg'
import chevronIcon from '@/assets/orders/chevron.svg'
import './order-compose.css'

/** Single draft composition for New and Repeat; no server commands or deletes. */
export function OrderComposer({ draft, onSave, onSend, onBack }: {
  draft: DemoDraft; onSave: (draft: DemoDraft) => void; onSend: (draft: DemoDraft) => void; onBack: () => void
}) {
  const [saved, setSaved] = useState(draft)
  const [value, setValue] = useState(draft)
  const [editing, setEditing] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const nextItem = useRef(1)
  const commentId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const returnFocus = useRef<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const dirty = JSON.stringify(value) !== JSON.stringify(saved)
  useLayoutEffect(() => { headingRef.current?.focus(); window.scrollTo(0, 0) }, [])
  useLayoutEffect(() => {
    if (editing !== null || !returnFocus.current) return
    const target = returnFocus.current
    rootRef.current?.querySelector<HTMLButtonElement>(target)?.focus()
    returnFocus.current = null
  }, [editing])
  function save(next: DemoDraft) { onSave(next); setSaved(next); setValue(next); setFeedback('Черновик сохранён только в памяти страницы') }
  function saveItem(item: DemoItem) {
    const existing = value.items.find(current => current.id === editing)
    let id = existing?.id
    if (!id) {
      do { id = value.id + '-ITEM-' + nextItem.current++ } while (value.items.some(current => current.id === id))
    }
    const next = { ...value, items: existing ? value.items.map(current => current.id === existing.id ? { ...item, id } : current) : [...value.items, { ...item, id }] }
    save(next)
    setEditing(null)
  }
  return (
    <div className="fos-order-composer" ref={rootRef} data-testid="order-composer" data-order-id={value.id}>
      {editing === null ? <>
        <button className="fos-order-detail__back" type="button" disabled={dirty} onClick={onBack}>К списку заказов</button>
        <header className="fos-orders-page__header"><div><h1 ref={headingRef} tabIndex={-1}>Новый заказ</h1><p>Черновик · {value.id}</p></div>
          <button className="fos-order-icon-action fos-order-icon-action--send" type="button" aria-label="Передать менеджеру (демо)" title="Передать менеджеру (демо)" disabled={!canSendDemo(value) || dirty} onClick={() => onSend(value)}><span><img src={sendIcon} alt="" /></span><small>Отправить</small></button>
        </header>
        <p className="fos-order-editor__hint">Демо: данные живут до перезагрузки страницы. Документ 1С не создаётся.</p>
        {value.sourceOrderId && <p>Дубликат заказа {value.sourceOrderId}. Исходный заказ не изменяется.</p>}
        <section className="fos-order-composer__section" aria-label="Продукция">
          <div className="fos-order-composer__section-heading"><h2>Продукция</h2><button data-add-item className="fos-order-action" type="button" onClick={() => { returnFocus.current = '[data-add-item]'; setEditing('new') }}>Добавить позицию</button></div>
          {value.items.length ? <ul className="fos-order-detail__items">{value.items.map((item, index) => <li key={item.id} data-item-id={item.id}>
            <OrderItemSummary item={itemSummary(item)} position={index + 1} />
            <button className="fos-order-action" type="button" data-edit-index={index} aria-label={'Изменить позицию ' + (index + 1)} onClick={() => { returnFocus.current = '[data-edit-index="' + index + '"]'; setEditing(item.id) }}>Изменить <img src={chevronIcon} alt="" width="20" height="20" /></button>
          </li>)}</ul> : <p>Позиции не указаны. Добавьте хотя бы одну для передачи.</p>}
        </section>
        <section className="fos-order-composer__section" aria-label="Общие данные заказа"><h2>Общие данные заказа</h2>
          <label className="fos-order-field fos-order-composer__date">Желаемый срок<input type="date" value={value.requestedDate} onChange={event => setValue(current => ({ ...current, requestedDate: event.target.value }))} /></label>
          <div className="fos-order-field"><label htmlFor={commentId}>Комментарий к заказу</label><textarea id={commentId} value={value.comment} placeholder="Необязательно" onChange={event => setValue(current => ({ ...current, comment: event.target.value }))} /></div>
        </section>
        <p role="status">{dirty ? 'Есть несохранённые изменения заказа' : feedback || 'Черновик без несохранённых изменений'}</p>
        <div className="fos-order-editor__actions"><button className="fos-order-action" type="button" disabled={!dirty || !validDemoDate(value.requestedDate)} onClick={() => save(value)}>Сохранить черновик</button>
          <button className="fos-order-action" type="button" disabled={!dirty} onClick={() => { setValue(saved); setFeedback('Значения восстановлены') }}>Восстановить значения заказа</button>
          <button className="fos-order-action" type="button" disabled aria-describedby="demo-delete-note">Удалить черновик / позицию</button>
        </div>
        <p id="demo-delete-note" className="fos-order-editor__hint">Удаление не согласовано. При несохранённых изменениях сначала сохраните или восстановите значения; переход не стирает их.</p>
      </> : <OrderItemForm key={editing} item={value.items.find(item => item.id === editing)} onSave={saveItem} onClose={() => setEditing(null)} />}
    </div>
  )
}
