import { FosGlassMaterial } from '@/components/ui/fos-glass-material'
import { useState } from 'react'
import './glass-material-lab.css'

type Order = { id: string; title: string; status: string }
type Choice = { value: string; label: string }

export function GlassMaterialLab({ orders, statuses }: { orders: ReadonlyArray<Order>; statuses: ReadonlyArray<Choice> }) {
  const query = new URLSearchParams(window.location.search)
  const requested = Number(query.get('strength') ?? '0.1')
  const strength = Number.isFinite(requested) ? Math.min(1, Math.max(0, requested)) : 0.1
  const optics = query.get('phase') === 'optics'
  const [position, setPosition] = useState(0)
  return <main className="fos-material-lab" data-material-phase={optics ? 'optics' : 'material'}>
    <header>
      <p className="fos-material-eyebrow">FLEXOMIR · МАТЕРИАЛ</p>
      <h1>Одна линза над заказами</h1>
      <p>Настоящие HTML-строки. Сила преломления: <strong>{strength}</strong>.</p>
    </header>
    <nav className="fos-proof-controls" aria-label="Сила преломления">
      {[0, 0.1, 0.6].map(value => <a key={value} aria-current={strength === value ? 'page' : undefined}
        href={`/?view=material&phase=optics&strength=${value}`}>{value === 0 ? 'Нулевой контроль' : `Сила ${value}`}</a>)}
    </nav>
    {!optics && <div className="fos-proof-controls">
      <button type="button" onClick={() => setPosition(value => (value + 1) % 4)}>Сместить линзу ниже</button>
      <button type="button" onClick={() => setPosition(0)}>Вернуть линзу</button>
      <a href="/?view=material&phase=optics&strength=0">Проверка оптики без оформления</a>
    </div>}
    <section className="fos-proof-scene" aria-label="Заказы под линзой">
      <div data-material-orders="">
        {orders.map(order => <article className="fos-proof-order" key={order.id} data-order-id={order.id}>
          <div><strong data-material-text="">{order.id}</strong><span>{order.title}</span></div>
          <span className="fos-proof-status">{statuses.find(status => status.value === order.status)?.label}</span>
        </article>)}
      </div>
      <FosGlassMaterial className="fos-proof-lens" strength={strength} radius={18} blur={optics ? 0 : 1.5} dome={0}
        lighting={optics ? 'native' : 'sidebar'} shadow={optics ? 'native' : 'reference'}
        centerOpacity={optics ? 0 : .16} motion={optics ? 'none' : 'travel'} travelY={position * 76} aria-hidden="true" />
    </section>
  </main>
}
