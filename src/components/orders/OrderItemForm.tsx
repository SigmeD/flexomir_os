import { useId, useLayoutEffect, useRef, useState } from 'react'
import { emptyDemoItem, validDemoItem, type DemoItem } from '@/demo/order-compose-model'
import uploadIcon from '@/assets/orders/upload.svg'

/** FOS Item Form 2029:7310, demo-only field choices, shared by Add/Edit. */
export function OrderItemForm({ item, onSave, onClose }: {
  item?: DemoItem; onSave: (item: DemoItem) => void; onClose: () => void
}) {
  const [initial] = useState(() => item ? { ...item } : emptyDemoItem())
  const [value, setValue] = useState(initial)
  const formRef = useRef<HTMLFormElement>(null)
  const fieldId = useId()
  const dirty = JSON.stringify(value) !== JSON.stringify(initial)
  const update = (patch: Partial<DemoItem>) => setValue(current => ({ ...current, ...patch }))
  useLayoutEffect(() => { formRef.current?.querySelector<HTMLInputElement>('input')?.focus() }, [])
  const fields = [
    ['name', 'Наименование продукции', 'text'], ['quantity', 'Количество', 'number'],
    ['width', 'Ширина, мм', 'number'], ['height', 'Высота, мм', 'number'],
  ] as const
  return (
    <form ref={formRef} className="fos-order-editor" data-testid="order-item-form" onSubmit={event => {
      event.preventDefault()
      if (dirty && validDemoItem(value)) onSave(value)
    }} onKeyDown={event => { if (event.key === 'Escape' && !dirty) { event.stopPropagation(); onClose() } }}>
      <h2>{item ? item.name : 'Новая позиция'}</h2>
      <p className="fos-order-editor__hint">Проверки и варианты полей — только демо. Производственный контракт не подключён.</p>
      <div className="fos-order-editor__grid">
        {fields.slice(0, 2).map(([key, label, type]) => <label key={key} className="fos-order-field">{label}
          <input type={type} min={type === 'number' ? '0' : undefined} step={key === 'quantity' ? '1' : 'any'} required value={value[key]} onChange={event => update({ [key]: event.target.value })} />
        </label>)}
        <fieldset className="fos-order-editor__print"><legend>Способ печати (UX-демо)</legend>
          {(['flex', 'digit'] as const).map(method => <label key={method}>
            <input type="radio" name={fieldId + '-print'} checked={value.printMethod === method} onChange={() => update({ printMethod: method })} />
            {method === 'flex' ? 'Флексопечать' : 'Цифровая печать'}
          </label>)}
        </fieldset>
        <div className="fos-order-field"><label htmlFor={fieldId + '-shape'}>Форма</label>
          <select id={fieldId + '-shape'} value={value.shape} required onChange={event => update({ shape: event.target.value })}>
            <option value="">Выберите форму</option><option>Прямоугольная</option><option>Круглая</option>
          </select>
        </div>
        {fields.slice(2).map(([key, label, type]) => <label key={key} className="fos-order-field">{label}
          <input type={type} min="0" step="any" required value={value[key]} onChange={event => update({ [key]: event.target.value })} />
        </label>)}
        <div className="fos-order-field"><label htmlFor={fieldId + '-material'}>Материал</label>
          <select id={fieldId + '-material'} value={value.material} required onChange={event => update({ material: event.target.value })}>
            <option value="">Выберите материал</option><option>Бумага</option><option>Плёнка</option>
          </select>
        </div>
      </div>
      <section className="fos-order-editor__artwork" aria-label="Макет этой позиции">
        <h3>Макет этой позиции</h3>
        {value.artworkMode !== 'HELP' && <>
          <label className="fos-order-field fos-order-editor__file">Выбрать файл макета
            <img src={uploadIcon} alt="" width="20" height="20" />
            <input key={value.fileName || 'empty'} type="file" onChange={event => update({ artworkMode: 'UPLOAD', fileName: event.target.files?.[0]?.name || '', unavailableArtwork: undefined })} />
          </label>
          {value.fileName && <p>Выбран локально: {value.fileName}</p>}
          {value.unavailableArtwork && <p>Исходный макет недоступен: {value.unavailableArtwork}. Выберите файл заново или запросите помощь.</p>}
          <button type="button" className="fos-order-action" disabled aria-describedby={fieldId + '-library'}>Мои макеты</button>
          <p id={fieldId + '-library'} className="fos-order-editor__hint">Библиотека компании и загрузка на сервер не подключены.</p>
        </>}
        <label className="fos-order-editor__help"><input type="checkbox" checked={value.artworkMode === 'HELP'} onChange={event => update({ artworkMode: event.target.checked ? 'HELP' : 'UPLOAD', fileName: '', unavailableArtwork: undefined })} />Нужна помощь с макетом</label>
      </section>
      <p role="status">{dirty ? 'Есть несохранённые изменения позиции' : 'Позиция без изменений'}</p>
      <div className="fos-order-editor__actions">
        <button className="fos-order-action fos-order-action--primary" type="submit" disabled={!dirty || !validDemoItem(value)}>Сохранить позицию</button>
        <button className="fos-order-action" type="button" disabled={!dirty} onClick={() => setValue({ ...initial })}>Восстановить значения</button>
        <button className="fos-order-action" type="button" disabled={dirty} onClick={onClose}>Закрыть форму позиции</button>
      </div>
    </form>
  )
}
