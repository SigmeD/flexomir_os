import { useState } from 'react'
import { FOSDateField, FOSInput, FOSSelect, FOSTextarea } from './components/ui/fos-controls'
import { HeaderAction } from './components/ui/header-action'
import { OverflowMenu } from './components/ui/overflow-menu'
import { PageHeader } from './components/ui/page-header'
import { PrintingMethodControl } from './components/orders/PrintingMethodControl'
import { ArtworkSource } from './components/orders/ArtworkSource'
import { emptyDemoItem } from './demo/order-compose-model'

/** Isolated contract rendering for the masters currently consumed by Orders only. */
export function OrdersComponentsLab() {
  const [value, setValue] = useState('')
  const [item, setItem] = useState(emptyDemoItem())
  return <main data-testid="orders-components-lab" style={{ padding: '52px 20px', maxWidth: 1100, margin: 'auto', background: 'white' }}>
    <PageHeader title="Компоненты заказов" actions={<><HeaderAction action="save" accessibleName="Сохранить" /><HeaderAction action="send" accessibleName="Отправить" /><HeaderAction action="edit" accessibleName="Изменить" /><OverflowMenu items={[{ id: 'preview', label: 'Проверить' }, { id: 'disabled', label: 'Недоступное действие', disabled: true }]} /></>} />
    <div style={{ display: 'grid', gap: 24, marginTop: 32 }}>
      <FOSInput label="Поле" value={value} onChange={event => setValue(event.target.value)} placeholder="Placeholder" />
      <FOSInput label="Ошибка поля" error="Проверьте значение" value="" onChange={() => {}} />
      <FOSInput label="Только чтение" value="Readonly" readOnly />
      <FOSSelect label="Выбор" value={value} onChange={event => setValue(event.target.value)}><option value="">Выберите значение</option><option value="sample">Пример</option></FOSSelect>
      <FOSDateField label="Дата" /><FOSTextarea label="Комментарий" placeholder="Необязательно" />
      <PrintingMethodControl value={item.printMethod} onChange={printMethod => setItem(current => ({ ...current, printMethod }))} />
      <ArtworkSource value={item} onChange={patch => setItem(current => ({ ...current, ...patch }))} />
    </div>
  </main>
}
