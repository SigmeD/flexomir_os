import { useState } from 'react'
import { SidebarNav, type SidebarNavItem } from '@/components/ui/sidebar-nav'
import './SidebarNavLab.css'

const managerItems: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы' },
  { id: 'clients', label: 'Клиенты' },
  { id: 'support', label: 'Поддержка' },
]

const clientItems: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы' },
  { id: 'artworks', label: 'Макеты' },
  { id: 'support', label: 'Поддержка' },
]

function RoleNavSample({
  role, caption, items,
}: {
  role: 'manager' | 'client'
  caption: string
  items: readonly SidebarNavItem[]
}) {
  const [selected, setSelected] = useState('orders')
  const current = items.find(item => item.id === selected)
  return (
    <section className="sidebar-lab__sample" data-testid={'sidebar-lab-' + role}>
      <h2>{caption}</h2>
      <div className="sidebar-lab__pane">
        <p className="sidebar-lab__brand">FLEXOMIR OS</p>
        <p className="sidebar-lab__user">{caption}</p>
        <SidebarNav
          items={items}
          activeId={selected}
          onSelect={setSelected}
          ariaLabel={'Навигация ' + (role === 'manager' ? 'менеджера' : 'клиента')}
          className="sidebar-lab__nav"
        />
      </div>
      <p role="status" data-testid={'sidebar-status-' + role}>
        Выбрано: {current?.label ?? '—'}
      </p>
    </section>
  )
}

/** Navigation anatomy only: no real routes or responsive drawer behavior. */
export function SidebarNavLab() {
  return (
    <main className="sidebar-lab">
      <header className="sidebar-lab__intro">
        <p className="sidebar-lab__eyebrow">FLEXOMIR OS / COMPONENT LAB / GL-02A</p>
        <h1>Sidebar / Glass Lens</h1>
        <p>Общий Figma-компонент для двух ролей. Нажатие меняет только тестовое выделение. Наведение не переносит линзу.</p>
      </header>
      <div className="sidebar-lab__panes">
        <RoleNavSample role="manager" caption="Менеджер" items={managerItems} />
        <RoleNavSample role="client" caption="Клиент" items={clientItems} />
      </div>
      <p className="sidebar-lab__footnote">
        Тестируем внутреннее содержимое навигации 208×44 и анимацию 2.2.5 C.
        На планшете и мобильном итоговая навигация будет открываться в отдельном Drawer — его пока не реализовали.
      </p>
    </main>
  )
}
