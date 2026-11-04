import { useState } from 'react'
import { GlassPillTabs, type GlassPillFilter } from './components/ui/glass-pill-tabs'
import './GlassPillTabsLab.css'

const initial: readonly GlassPillFilter[] = [
  { id: 'all', label: 'Все заказы' },
  { id: 'draft', label: 'Черновики' },
  { id: 'review', label: 'На рассмотрении' },
  { id: 'work', label: 'В работе' },
  { id: 'done', label: 'Завершённые' },
]
const orders = [
  { id: 'DEMO-001', filter: 'draft' },
  { id: 'DEMO-002', filter: 'review' },
  { id: 'DEMO-003', filter: 'work' },
  { id: 'DEMO-004', filter: 'done' },
  { id: 'DEMO-005', filter: 'draft' },
  { id: 'DEMO-006', filter: 'work' },
]

export function GlassPillTabsLab() {
  const [items, setItems] = useState<GlassPillFilter[]>(() => initial.map(item => ({ ...item })))
  const [value, setValue] = useState('all')
  const [sequence, setSequence] = useState(1)
  const selected = items.find(item => item.id === value)?.label ?? 'Все заказы'
  const filtered = value === 'all' ? orders : orders.filter(order => order.filter === value)

  const add = () => {
    if (items.length >= 12) return
    setItems(old => [...old, { id: 'extra-' + sequence, label: 'Демо-этап ' + sequence }])
    setSequence(old => old + 1)
  }
  const remove = () => {
    if (items.length <= 1) return
    const newItems = items.slice(0, -1)
    if (value === items[items.length - 1].id) setValue(newItems[0].id)
    setItems(newItems)
  }
  const reset = () => {
    setItems(initial.map(item => ({ ...item })))
    setValue('all')
    setSequence(1)
  }

  return (
    <main className="pill-lab" data-testid="glass-pill-lab">
      <div className="pill-lab__eyebrow">FLEXOMIR OS / COMPONENT LAB / GL-03</div>
      <h1>Compact Glass Pill Tabs</h1>
      <p>Горизонтальная линза из общего стеклянного материала. Прокручивайте ряд пальцем, выбирайте статусы нажатием.</p>
      <section className="pill-lab__card">
        <div className="pill-lab__header"><h2>Мои заказы</h2><small>React-пилот · без API / 1С</small></div>
        <div className="pill-lab__filter-label">Статус заказа</div>
        <GlassPillTabs
          items={items} value={value} onValueChange={setValue}
          ariaLabel="Фильтр заказов по статусу"
        />
        <p className="pill-lab__hint">Свайп прокручивает вкладки, нажатие выбирает фильтр. Активная вкладка автоматически появляется в видимой области.</p>
        <div className="pill-lab__results-head">
          <strong data-testid="pill-selected-label">{selected}</strong>
          <span data-testid="pill-order-count">{filtered.length} из {orders.length} · учебные данные</span>
        </div>
        <div className="pill-lab__orders" data-testid="pill-demo-orders">
          {filtered.length ? filtered.map(order => (
            <div className="pill-lab__order" key={order.id}>
              <div><strong>{order.id}</strong><small>Демонстрационный заказ</small></div>
              <span>{initial.find(filter => filter.id === order.filter)?.label ?? 'Демо'}</span>
            </div>
          )) : <p className="pill-lab__empty">По выбранному фильтру заказов нет.</p>}
        </div>
        <div className="pill-lab__tools">
          <strong>Тест масштабирования</strong>
          <p>Только демонстрационные фильтры. Это не создание бизнес-статусов.</p>
          <div>
            <button type="button" data-testid="pill-add" disabled={items.length >= 12} onClick={add}>+ Добавить</button>
            <button type="button" data-testid="pill-remove" disabled={items.length <= 1} onClick={remove}>Убрать последнюю</button>
            <button type="button" data-testid="pill-reset" onClick={reset}>Сбросить</button>
          </div>
          <small data-testid="pill-filter-count">{items.length} фильтров · ограничение 12 только для демонстрации</small>
        </div>
      </section>
      <p className="pill-lab__footnote">«В работе» — название фильтра интерфейса. Соответствие статусам 1С не определено этим компонентом.</p>
    </main>
  )
}
