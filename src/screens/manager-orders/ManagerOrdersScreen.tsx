import { useState } from 'react'
import { GlassPillTabs } from '@/components/ui/glass-pill-tabs'
import { HeaderAction } from '@/components/ui/header-action'
import type { SidebarNavItem } from '@/components/ui/sidebar-nav'
import { AppShell } from '@/components/layout/AppShell'
import { OrdersList } from './OrdersList'
import { OrderDetail } from '@/components/orders/OrderDetail'
import { useOrderPreview } from '@/components/orders/useOrderPreview'
import { ORDER_STATUS_FILTERS, type OrderListItem, type OrderStatusFilterId } from './model'
import '@/components/orders/orders-page.css'

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
  const preview = useOrderPreview(orders)
  const visibleOrders = filterId === 'all'
    ? orders
    : orders.filter(order => order.filterId === filterId)

  const onSelectFilter = (id: string) => {
    if (ORDER_STATUS_FILTERS.some(filter => filter.id === id && !filter.disabled)) {
      setFilterId(id as OrderStatusFilterId)
    }
  }

  return (
    <div className="fos-orders-page" data-testid="manager-orders-screen" ref={preview.surfaceRef}>
      <AppShell
        items={managerNav}
        activeId="orders"
        onSelect={() => {}}
        roleLabel="Менеджер"
        navigationLabel="Навигация менеджера"
        menuLabel="Меню менеджера"
        triggerLabel="Открыть меню менеджера"
        footerText="Менеджер"
      >
        <main className="fos-orders-page__main">
          {preview.selectedOrder?.detail ? (
            <OrderDetail order={preview.selectedOrder} detail={preview.selectedOrder.detail} onBack={preview.backToList} />
          ) : (
            <>
              <header className="fos-orders-page__header">
                <div>
                  <p className="fos-orders-page__eyebrow">Заказы</p>
                  <h1>Заказы</h1>
                </div>
                <HeaderAction action="add" accessibleName="Добавить заказ" disabled />
              </header>

              <p className="fos-orders-page__disclaimer">
                Демонстрационные данные. Интеграция с 1С не подключена.
              </p>

              <section className="fos-orders-page__filters" aria-label="Фильтры заказов">
                <GlassPillTabs
                  items={ORDER_STATUS_FILTERS}
                  value={filterId}
                  onValueChange={onSelectFilter}
                  ariaLabel="Фильтр заказов по статусу"
                />
              </section>

              <OrdersList orders={visibleOrders} total={orders.length} onOpen={preview.openOrder} />
            </>
          )}
        </main>
      </AppShell>
    </div>
  )
}
