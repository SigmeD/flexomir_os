import { useState } from 'react'
import { GlassPillTabs } from '@/components/ui/glass-pill-tabs'
import { HeaderAction } from '@/components/ui/header-action'
import { SidebarNav, type SidebarNavItem } from '@/components/ui/sidebar-nav'
import { OrdersList } from './OrdersList'
import { ORDER_STATUS_FILTERS, type OrderListItem, type OrderStatusFilterId } from './model'
import './manager-orders.css'

const managerNav: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы', icon: 'orders' },
  // Pending PO/Owner decision: "Клиенты" vs "Компании" in Manager UX.
  { id: 'clients', label: 'Клиенты', icon: 'clients', disabled: true },
  { id: 'support', label: 'Поддержка', icon: 'support', disabled: true },
]

interface ManagerOrdersScreenProps {
  /** Supplied by App in the isolated preview; real API binding remains a separate frontend task. */
  orders: readonly OrderListItem[]
}

/**
 * FE-08: composed React screen with explicit data inputs.
 * No 1C mapping, backend statuses, real navigation or server-side ACL here.
 * Accepted Glass primitives remain unchanged.
 */
export function ManagerOrdersScreen({ orders }: ManagerOrdersScreenProps) {
  const [filterId, setFilterId] = useState<OrderStatusFilterId>('all')
  const visibleOrders = filterId === 'all'
    ? orders
    : orders.filter(order => order.filterId === filterId)

  const onSelectFilter = (id: string) => {
    if (ORDER_STATUS_FILTERS.some(filter => filter.id === id && !filter.disabled)) {
      setFilterId(id as OrderStatusFilterId)
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
            items={ORDER_STATUS_FILTERS}
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
