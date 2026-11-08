import { useEffect, useState } from 'react'
import { GlassPillTabs } from '@/components/ui/glass-pill-tabs'
import { HeaderAction } from '@/components/ui/header-action'
import { PageHeader } from '@/components/ui/page-header'
import { MoreAction } from '@/components/ui/overflow-menu'
import type { SidebarNavItem } from '@/components/ui/sidebar-nav'
import { AppShell } from '@/components/layout/AppShell'
import { cabinetItems, type CabinetSection } from '@/components/layout/CabinetPage'
import { useCabinetNavigation } from '@/components/layout/CabinetNavigation'
import { OrderComposer } from '@/components/orders/OrderComposer'
import type { DemoDraft } from '@/demo/order-compose-model'
import type { DemoCompany } from '@/demo/company-fixtures'
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
  newOrderIds?: readonly string[]
  processingStates?: Readonly<Record<string, 'pending' | 'success' | 'error'>>
  onProcessingStateChange?: (id: string, state: 'pending' | 'success' | 'error') => void
  demoTools?: boolean
  managerDrafts?: readonly DemoDraft[]
  managerCompanies?: readonly Pick<DemoCompany, 'id' | 'name'>[]
  onCreateOrder?: () => string
  onSaveManagerDraft?: (draft: DemoDraft) => void
  onEditorStateChange?: (open: boolean) => void
}

/**
 * FE-08: composed React screen with explicit data inputs.
 * No 1C mapping, backend statuses, real navigation or server-side ACL here.
 * Accepted Glass primitives remain unchanged.
 */
export function ManagerOrdersScreen({ orders, demoOrderIds = [], initialFilterId = 'all', onFilterChange, newOrderIds = [], processingStates = {}, onProcessingStateChange, demoTools = false, managerDrafts = [], managerCompanies = [], onCreateOrder, onSaveManagerDraft, onEditorStateChange }: ManagerOrdersScreenProps) {
  const navigation = useCabinetNavigation()
  const [filterId, setFilterId] = useState<OrderStatusFilterId>(initialFilterId)
  const [queue, setQueue] = useState<'new' | 'all'>('all')
  const [managerDraftDirty, setManagerDraftDirty] = useState(false)
  const preview = useOrderPreview(orders)
  const queueOrders = queue === 'new' ? orders.filter(order => newOrderIds.includes(order.id)) : orders
  const selectedManagerDraft = managerDrafts.find(draft => draft.id === preview.selectedOrder?.id)
  useEffect(() => { onEditorStateChange?.(Boolean(selectedManagerDraft && managerDraftDirty)); return () => onEditorStateChange?.(false) }, [selectedManagerDraft, managerDraftDirty, onEditorStateChange])
  const visibleOrders = filterId === 'all'
    ? queueOrders
    : queueOrders.filter(order => order.filterId === filterId)

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
        onSelect={id => { if (selectedManagerDraft && managerDraftDirty) return; if (id === 'orders') preview.backToList(); else navigation?.navigate(id as CabinetSection) }}
        roleLabel="Менеджер"
        variant="manager"
        navigationLabel="Навигация менеджера"
        menuLabel="Меню менеджера"
        triggerLabel="Открыть меню менеджера"
        footerText="Менеджер"
      >
        <main className="fos-orders-page__main" data-role="manager" data-view={preview.selectedOrder ? 'detail' : 'list'}>
          {selectedManagerDraft ? <OrderComposer key={selectedManagerDraft.id} draft={selectedManagerDraft} onSave={onSaveManagerDraft ?? (() => {})} onSend={() => {}} onBack={() => { if (!managerDraftDirty) preview.backToList() }} onDraftDirtyChange={setManagerDraftDirty} managerCompanies={managerCompanies} /> : preview.selectedOrder?.detail ? (
            <>
              <OrderDetail order={preview.selectedOrder} detail={preview.selectedOrder.detail} onBack={preview.backToList} role="manager" managerIntake={demoOrderIds.includes(preview.selectedOrder.id)} demoProcessingState={processingStates[preview.selectedOrder.id] ?? 'pending'} onDemoProcessingStateChange={state => onProcessingStateChange?.(preview.selectedOrder!.id, state)} demoProcessingEnabled={demoTools} />
            </>
          ) : (
            <>
              <PageHeader title="Заказы" breadcrumbs={[{ label: 'Заказы' }]} actions={<><HeaderAction action="add" accessibleName="Добавить заказ" disabled={!onCreateOrder} onAction={() => { const id = onCreateOrder?.(); if (id) preview.openCreatedOrder(id) }} /><MoreAction disabled /></>} />
              <p className="fos-sr-only">
                Демонстрационные данные. Интеграция с 1С не подключена.
              </p>

              <section className="fos-orders-page__filters" aria-label="Фильтры заказов">
                <GlassPillTabs items={[{ id: 'new', label: 'Новые' }, { id: 'all', label: 'Все' }]} value={queue} onValueChange={value => { if (value === 'new' || value === 'all') setQueue(value) }} ariaLabel="Очередь заказов менеджера" />
                <GlassPillTabs
                  items={ORDER_STATUS_FILTERS}
                  value={filterId}
                  onValueChange={onSelectFilter}
                  ariaLabel="Фильтр заказов по статусу"
                />
              </section>

              <OrdersList orders={visibleOrders} total={queueOrders.length} onOpen={preview.openOrder} />
            </>
          )}
        </main>
      </AppShell>
    </div>
  )
}
