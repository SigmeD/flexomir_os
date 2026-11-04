import { useMemo, useState } from 'react'
import { GlassMaterialLab } from './GlassMaterialLab'
import {
  GlassSelect,
  GlassSelectTrigger,
  GlassSelectContent,
  GlassSelectItem,
} from '@/components/ui/glass-select'

type Status = 'all' | 'draft' | 'review' | 'production' | 'done'
type Order = { id: string; title: string; status: Exclude<Status, 'all'> }

const statuses: ReadonlyArray<{ value: Status; label: string }> = [
  { value: 'all', label: 'Все заказы' },
  { value: 'draft', label: 'Черновики' },
  { value: 'review', label: 'На рассмотрении' },
  { value: 'production', label: 'На производстве' },
  { value: 'done', label: 'Завершённые' },
]

const orders: ReadonlyArray<Order> = [
  { id: 'DEMO-001', title: 'Демонстрационный заказ 01', status: 'draft' },
  { id: 'DEMO-002', title: 'Демонстрационный заказ 02', status: 'review' },
  { id: 'DEMO-003', title: 'Демонстрационный заказ 03', status: 'production' },
  { id: 'DEMO-004', title: 'Демонстрационный заказ 04', status: 'draft' },
  { id: 'DEMO-005', title: 'Демонстрационный заказ 05', status: 'review' },
]

function GlassFilterDemo() {
  const appearance = new URLSearchParams(window.location.search).get('glass') === 'matte' ? 'matte' : 'current'
  const [status, setStatus] = useState<Status>('all')
  const matching = useMemo(() => status === 'all' ? orders : orders.filter(o => o.status === status), [status])
  const name = statuses.find(s => s.value === status)!.label

  function choose(value: string) {
    if (!statuses.some(s => s.value === value)) return
    setStatus(value as Status)
  }

  return (
    <main className="page">
      <header className="page-header">
        <div className="overline">ЗАКАЗЫ / КЛИЕНТСКИЙ КАБИНЕТ</div>
        <h1>Мои заказы</h1>
        <p>Выбор статуса изменяет только отображение заказов.</p>
      </header>

      <section className="filter-card" aria-labelledby="filter-title">
        <div className="filter-top"><h2 id="filter-title">ФИЛЬТР ПО СТАТУСУ</h2><small>Демонстрация / без API и 1С</small></div>
        <div className="trigger-label" id="status-label">Статус заказа</div>
        <div data-testid="filter-control" role="group" aria-labelledby="status-label">
          <GlassSelect value={status} onValueChange={choose} appearance={appearance}>
            <GlassSelectTrigger placeholder="Статус заказа" aria-labelledby="status-label" />
            <GlassSelectContent>
              {statuses.map(opt => (
                <GlassSelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </GlassSelectItem>
              ))}
            </GlassSelectContent>
          </GlassSelect>
        </div>

        <div className="orders" data-testid="orders-list">
          <div className="orders-head"><strong>{name}</strong><small>{matching.length} из {orders.length} · учебные данные</small></div>
          {matching.length ? matching.map(o => (
            <div className="order-row" key={o.id}>
              <div><b>{o.id}</b><small>{o.title}</small></div>
              <span className="order-badge">{statuses.find(s => s.value === o.status)!.label.replace('Черновики', 'Черновик')}</span>
            </div>
          )) : <p className="no-orders">По выбранному статусу заказов нет.</p>}
        </div>
      </section>

    </main>
  )
}

export function App() {
  return new URLSearchParams(window.location.search).get('view') === 'material'
    ? <GlassMaterialLab orders={orders} statuses={statuses} />
    : <GlassFilterDemo />
}
