import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { OrdersList } from '@/components/orders/OrdersList'
import { OrderDetail } from '@/components/orders/OrderDetail'
import { OrderComposer } from '@/components/orders/OrderComposer'
import { CompletedOrderMenu } from '@/components/orders/CompletedOrderMenu'
import type { OrderDemoController } from '@/demo/OrderDemoWorkspace'
import { useOrderPreview } from '@/components/orders/useOrderPreview'
import { ORDER_STATUS_FILTERS, type OrderListItem, type OrderStatusFilterId } from '@/components/orders/order-model'
import { GlassPillTabs } from '@/components/ui/glass-pill-tabs'
import { HeaderAction } from '@/components/ui/header-action'
import type { SidebarNavItem } from '@/components/ui/sidebar-nav'
import '@/components/orders/orders-page.css'

const clientNav: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы', icon: 'orders' },
  { id: 'artworks', label: 'Макеты', icon: 'artworks', disabled: true },
  { id: 'support', label: 'Поддержка', icon: 'support', disabled: true },
]

interface ClientOrdersScreenProps {
  orders: readonly OrderListItem[]
  companyName: string
  demo?: OrderDemoController
  initialFilterId?: OrderStatusFilterId
  onFilterChange?: (id: OrderStatusFilterId) => void
}

/** Client composition: supplied data scope is never a substitute for server authorization. */
export function ClientOrdersScreen({ orders, companyName, demo, initialFilterId = 'all', onFilterChange }: ClientOrdersScreenProps) {
  const [filterId, setLocalFilterId] = useState<OrderStatusFilterId>(initialFilterId)
  const setFilterId = (id: OrderStatusFilterId) => { setLocalFilterId(id); onFilterChange?.(id) }
  const preview = useOrderPreview(orders)
  const visibleOrders = filterId === 'all' ? orders : orders.filter(order => order.filterId === filterId)
  const selectedDraft = demo?.drafts.find(draft => draft.id === preview.selectedOrder?.id && draft.stage === 'draft')
  const editingDraft = Boolean(selectedDraft)
  const editorStateChange = demo?.onEditorStateChange
  useEffect(() => { editorStateChange?.(editingDraft); return () => editorStateChange?.(false) }, [editingDraft, editorStateChange])

  return (
    <div className="fos-orders-page" data-testid="client-orders-screen" ref={preview.surfaceRef}>
      <AppShell
        items={clientNav} activeId="orders" onSelect={() => {}}
        roleLabel="Клиент" navigationLabel="Навигация клиента" menuLabel="Меню клиента"
        triggerLabel="Открыть меню клиента" footerText={companyName}
      >
        <main className="fos-orders-page__main">
          {selectedDraft && demo ? (
            <OrderComposer key={selectedDraft.id} draft={selectedDraft} onSave={demo.saveDraft} onSend={demo.sendDraft} onBack={preview.backToList} />
          ) : preview.selectedOrder?.detail ? (
            <OrderDetail order={preview.selectedOrder} detail={preview.selectedOrder.detail} onBack={preview.backToList}
              actions={demo && preview.selectedOrder.filterId === 'done' ? <CompletedOrderMenu onDuplicate={() => {
                const id = demo.duplicateOrder(preview.selectedOrder!.id)
                if (id) { setFilterId('all'); preview.openCreatedOrder(id) }
              }} /> : undefined} />
          ) : (
            <>
              <header className="fos-orders-page__header">
                <div>
                  <p className="fos-orders-page__eyebrow">{companyName}</p>
                  <h1>Мои заказы</h1>
                </div>
                <HeaderAction action="add" accessibleName="Добавить заказ" data-create-order disabled={!demo} onAction={() => {
                  if (!demo) return
                  const id = demo.createDraft()
                  setFilterId('all')
                  preview.openCreatedOrder(id)
                }} />
              </header>
              <p className="fos-orders-page__disclaimer">Демонстрационные данные. Интеграция с 1С не подключена.</p>
              <section className="fos-orders-page__filters" aria-label="Фильтры заказов">
                <GlassPillTabs
                  items={ORDER_STATUS_FILTERS} value={filterId}
                  onValueChange={value => {
                    if (ORDER_STATUS_FILTERS.some(filter => filter.id === value && !filter.disabled)) {
                      setFilterId(value as OrderStatusFilterId)
                    }
                  }}
                  ariaLabel="Фильтр заказов по статусу"
                />
              </section>
              <OrdersList orders={visibleOrders} total={orders.length} idPrefix="client" onOpen={preview.openOrder} />
            </>
          )}
        </main>
      </AppShell>
    </div>
  )
}
