import { useState } from 'react'
import { GlassPillTabs } from '@/components/ui/glass-pill-tabs'
import { HeaderAction } from '@/components/ui/header-action'
import { PageHeader } from '@/components/ui/page-header'
import { MoreAction } from '@/components/ui/overflow-menu'
import type { SidebarNavItem } from '@/components/ui/sidebar-nav'
import { AppShell } from '@/components/layout/AppShell'
import { cabinetItems, type CabinetSection } from '@/components/layout/CabinetPage'
import { useCabinetNavigation } from '@/components/layout/CabinetNavigation'
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
  demoOrderIds?: readonly string[]
  initialFilterId?: OrderStatusFilterId
  onFilterChange?: (id: OrderStatusFilterId) => void
}

/**
 * FE-08: composed React screen with explicit data inputs.
 * No 1C mapping, backend statuses, real navigation or server-side ACL here.
 * Accepted Glass primitives remain unchanged.
 */
export function ManagerOrdersScreen({ orders, demoOrderIds = [], initialFilterId = 'all', onFilterChange }: ManagerOrdersScreenProps) {
  const navigation = useCabinetNavigation()
  const [filterId, setFilterId] = useState<OrderStatusFilterId>(initialFilterId)
  const preview = useOrderPreview(orders)
  const visibleOrders = filterId === 'all'
    ? orders
    : orders.filter(order => order.filterId === filterId)

  const onSelectFilter = (id: string) => {
    if (ORDER_STATUS_FILTERS.some(filter => filter.id === id && !filter.disabled)) {
      setFilterId(id as OrderStatusFilterId)
      onFilterChange?.(id as OrderStatusFilterId)
    }
  }

  return (
    <div className="fos-orders-page" data-testid="manager-orders-screen" ref={preview.surfaceRef}>
      <AppShell
        items={navigation ? cabinetItems('manager', navigation.ready) : managerNav}
        activeId="orders"
        onSelect={id => { if (id === 'orders') preview.backToList(); else navigation?.navigate(id as CabinetSection) }}
        roleLabel="Менеджер"
        variant="manager"
        navigationLabel="Навигация менеджера"
        menuLabel="Меню менеджера"
        triggerLabel="Открыть меню менеджера"
        footerText="Менеджер"
      >
        <main className="fos-orders-page__main" data-role="manager" data-view={preview.selectedOrder ? 'detail' : 'list'}>
          {preview.selectedOrder?.detail ? (
            <>
              <OrderDetail order={preview.selectedOrder} detail={preview.selectedOrder.detail} onBack={preview.backToList} role="manager" managerIntake={demoOrderIds.includes(preview.selectedOrder.id)} />
            </>
          ) : (
            <>
              <PageHeader title="Заказы" breadcrumbs={[{ label: 'Заказы' }]} actions={<><HeaderAction action="add" accessibleName="Добавить заказ" disabled /><MoreAction disabled /></>} />
              <p className="fos-sr-only">
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
