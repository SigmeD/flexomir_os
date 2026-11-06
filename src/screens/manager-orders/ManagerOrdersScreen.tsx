import { useState } from 'react'
import { GlassPillTabs } from '@/components/ui/glass-pill-tabs'
import { HeaderAction } from '@/components/ui/header-action'
import { SidebarNav, type SidebarNavItem } from '@/components/ui/sidebar-nav'
import { OrdersList } from './OrdersList'
import { MANAGER_ORDERS_DEMO, MANAGER_ORDER_FILTERS, type DemoFilterId } from './fixtures'
import './manager-orders.css'

const managerNav: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы', icon: 'orders' },
  { id: 'clients', label: 'Клиенты', icon: 'clients', disabled: true },
  { id: 'support', label: 'Поддержка', icon: 'support', disabled: true },
]

const EMPTY_ORDERS: typeof MANAGER_ORDERS_DEMO = []

/**
 * FE-08: a composed React screen, not another component laboratory.
 * Filter state is UI-local. Neither the 1C mapping nor real routes/ACL exist.
 * Shared Glass primitives remain unchanged.
 */
export function ManagerOrdersScreen({ previewEmpty = false }: { previewEmpty?: boolean }) {
  const [filterId, setFilterId] = useState<DemoFilterId>('all')
  const orders = previewEmpty ? EMPTY_ORDERS : MANAGER_ORDERS_DEMO
  const visibleOrders = filterId === 'all'
    ? orders
    : orders.filter(order => order.filterId === filterId)

  const onSelectFilter = (id: string) => {
    if (MANAGER_ORDER_FILTERS.some(filter => filter.id === id && !filter.disabled)) {
      setFilterId(id as DemoFilterId)
    }
  }

  return (
    <div className="manager-orders-screen" data-testid="manager-orders-screen">
      <aside className="manager-orders-screen__aside" aria-label="Навигация">
        <div className="manager-orders-screen__brand">FLEXOMIR OS</div>
        <p className="manager-orders-screen__role">Менеджер</p>
        <SidebarNav
          items={managerNav}
          activeId="orders"
          onSelect={() => {}}
          ariaLabel="Навигация менеджера"
        />
      </aside>
      <main className="manager-orders-screen__main">
        <div className="manager-orders-screen__mobile-brand">FLEXOMIR OS / Менеджер</div>
        <header className="manager-orders-screen__header">
          <div>
            <p className="manager-orders-screen__eyebrow">Заказы</p>
            <h1>Заказы</h1>
          </div>
          <HeaderAction action="add" accessibleName="Добавить заказ" disabled />
        </header>

        <p className="manager-orders-screen__disclaimer">
          Демонстрационные данные. Интеграция с 1С не подключена.
        </p>

        <section className="manager-orders-screen__filters" aria-label="Фильтры заказов">
          <GlassPillTabs
            items={MANAGER_ORDER_FILTERS}
            value={filterId}
            onValueChange={onSelectFilter}
            ariaLabel="Фильтр заказов по статусу"
          />
        </section>

        <OrdersList orders={visibleOrders} total={orders.length} />
      </main>
    </div>
  )
}
