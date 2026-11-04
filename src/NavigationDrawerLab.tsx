import { useState } from 'react'
import { NavigationDrawer } from '@/components/ui/navigation-drawer'
import type { SidebarNavItem } from '@/components/ui/sidebar-nav'
import './NavigationDrawerLab.css'

// CURRENT Client Navigation Drawer Figma is text-only, even though the accepted
// desktop SidebarNav can optionally render icons. Do not invent mobile icons.
const clientItems: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы' },
  { id: 'artworks', label: 'Макеты' },
  { id: 'support', label: 'Поддержка' },
]
const managerItems: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы' },
  { id: 'clients', label: 'Клиенты' },
  { id: 'support', label: 'Поддержка' },
]

export function NavigationDrawerLab() {
  const [role, setRole] = useState<'client' | 'manager'>('client')
  const [selected, setSelected] = useState({ client: 'orders', manager: 'orders' })
  const [settled, setSettled] = useState({ client: null as string | null, manager: null as string | null })
  const items = role === 'client' ? clientItems : managerItems
  const activeId = selected[role]
  const label = items.find(item => item.id === activeId)?.label ?? '—'

  return (
    <div className="nav-drawer-lab">
      <header className="nav-drawer-lab__header">
        <strong className="nav-drawer-lab__brand">FLEXOMIR OS</strong>
        <div className="nav-drawer-lab__menu-slot">
          <NavigationDrawer
            key={role}
            items={items}
            activeId={activeId}
            ariaLabel={role === 'client' ? 'Меню клиента' : 'Меню менеджера'}
            footerText={role === 'client' ? 'ООО «Клиент»' : 'Менеджер · тестовый режим'}
            onSelect={id => setSelected(current => ({ ...current, [role]: id }))}
            onSelectionSettled={id => setSettled(current => ({ ...current, [role]: id }))}
          />
        </div>
      </header>

      <main className="nav-drawer-lab__main" data-testid="drawer-test-background">
        <p className="nav-drawer-lab__eyebrow">FOS V2 / GL-02B / НАВИГАЦИЯ</p>
        <h1>{role === 'client' ? 'Мои заказы' : 'Заказы'}</h1>
        <p className="nav-drawer-lab__caption">
          Тестовый экран для навигационного меню. Открытие, закрытие и выбор
          раздела не создают заказов и не обращаются к API.
        </p>
        <div className="nav-drawer-lab__settings">
          <span>Режим:</span>
          <div role="group" aria-label="Тестовая роль">
            <button type="button" data-testid="drawer-role-client"
              aria-pressed={role === 'client'} onClick={() => setRole('client')}>Клиент</button>
            <button type="button" data-testid="drawer-role-manager"
              aria-pressed={role === 'manager'} onClick={() => setRole('manager')}>Менеджер</button>
          </div>
        </div>
        <section className="nav-drawer-lab__card">
          <p className="nav-drawer-lab__card-title">Тестовая область</p>
          <p role="status" data-testid="drawer-selection">Выбрано: {label}</p>
          <p data-testid="drawer-settled">Линза завершила переход: {
            items.find(item => item.id === settled[role])?.label ?? '—'
          }</p>
          <p>Проверьте нажатие вне меню, Escape, удержание фокуса клавиатурой и отсутствие прокрутки страницы за открытой панелью.</p>
        </section>
        <div className="nav-drawer-lab__scroll-witness" data-testid="drawer-scroll-witness">
          <span>Контроль фонового скролла</span>
          <span>GL-02B — изолированная демонстрация</span>
        </div>
      </main>
    </div>
  )
}
