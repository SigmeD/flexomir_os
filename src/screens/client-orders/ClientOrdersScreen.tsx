import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { cabinetItems, type CabinetSection } from '@/components/layout/CabinetPage'
import { useCabinetNavigation } from '@/components/layout/CabinetNavigation'
import { OrdersList } from '@/components/orders/OrdersList'
import { OrderDetail } from '@/components/orders/OrderDetail'
import { OrderComposer } from '@/components/orders/OrderComposer'
import { CompletedOrderMenu } from '@/components/orders/CompletedOrderMenu'
import type { OrderDemoController } from '@/demo/OrderDemoWorkspace'
import { useOrderPreview } from '@/components/orders/useOrderPreview'
import { ORDER_STATUS_FILTERS, type OrderListItem, type OrderStatusFilterId } from '@/components/orders/order-model'
import { GlassPillTabs } from '@/components/ui/glass-pill-tabs'
import { HeaderAction } from '@/components/ui/header-action'
import { PageHeader } from '@/components/ui/page-header'
import { MoreAction } from '@/components/ui/overflow-menu'
import type { SidebarNavItem } from '@/components/ui/sidebar-nav'
import '@/components/orders/orders-page.css'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useOrderExitGuard } from '@/components/orders/useOrderExitGuard'
import { canEditDemoItems } from '@/demo/order-compose-model'

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
  const navigation = useCabinetNavigation()
  const [filterId, setLocalFilterId] = useState<OrderStatusFilterId>(initialFilterId)
  const [navigationSection, setNavigationSection] = useState<CabinetSection>('orders')
  const [reviewEditingId, setReviewEditingId] = useState<string | null>(null)
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const exitGuard = useOrderExitGuard()
  const setFilterId = (id: OrderStatusFilterId) => { setLocalFilterId(id); onFilterChange?.(id) }
  const presentedOrders = orders
  const preview = useOrderPreview(presentedOrders, exitGuard, true)
  const visibleOrders = filterId === 'all' ? presentedOrders : presentedOrders.filter(order => order.filterId === filterId)
  const selectedDraft = demo?.drafts.find(draft => draft.id === preview.selectedOrder?.id && draft.stage === 'draft' && draft.ownerRole === 'client' && draft.company === companyName)
  const selectedReview = demo?.drafts.find(order => order.id === preview.selectedOrder?.id && order.stage === 'sent' && order.company === companyName && canEditDemoItems(order, 'client'))
  const editingReview = selectedReview?.id === reviewEditingId ? selectedReview : undefined
  const editingDraft = Boolean(selectedDraft || editingReview)
  const editorStateChange = demo?.onEditorStateChange
  useEffect(() => { editorStateChange?.(editingDraft); return () => editorStateChange?.(false) }, [editingDraft, editorStateChange])

  function navigateFromShell(id: string) {
    const destination = id as CabinetSection | 'profile'
    const leave = () => {
      setReviewEditingId(null)
      if (destination === 'profile') { setNavigationSection('orders'); navigation?.openProfile?.(); return }
      if (destination === 'orders') preview.backToList()
      else {
        preview.backToList()
        navigation?.navigate(destination)
      }
    }
    exitGuard.requestExit(leave)
  }

  return (
    <div className="fos-orders-page" data-testid="client-orders-screen" ref={preview.surfaceRef}>
      <AppShell
        items={navigation ? cabinetItems('client', navigation.ready) : clientNav} activeId={navigationSection} onSelect={navigateFromShell} drawerSelectionResetKey={exitGuard.resetKey} onProfileReturnToRoot={preview.backToList} onOpenProfile={() => navigateFromShell('profile')}
        roleLabel="Клиент" identityLabel={companyName} variant="client" navigationLabel="Навигация клиента" menuLabel="Меню клиента"
        triggerLabel="Открыть меню клиента" footerText={companyName}
      >
        <main className="fos-orders-page__main" data-layout="standard" data-view={selectedDraft || editingReview ? 'compose' : preview.selectedOrder ? 'detail' : 'list'}>
          {editingReview && demo ? <OrderComposer key={editingReview.id + '-review'} draft={editingReview} actorRole="client" onSave={order => { demo.saveReviewOrder(order); setReviewEditingId(null) }} onSend={() => {}}
            onBack={() => navigateFromShell('orders')} onCancelReview={() => setReviewEditingId(null)} onNavigationSectionChange={setNavigationSection} onItemExitActionsChange={exitGuard.registerItem} onOrderExitActionsChange={exitGuard.registerOrder} /> : selectedDraft && demo ? (
            <OrderComposer key={selectedDraft.id} draft={selectedDraft} onSave={demo.saveDraft} onSend={demo.sendDraft} onBack={() => navigateFromShell('orders')} onNavigationSectionChange={setNavigationSection} onItemExitActionsChange={exitGuard.registerItem} onOrderExitActionsChange={exitGuard.registerOrder} onDeleteDraft={id => demo.deleteDraft(id, 'client')} />
          ) : preview.selectedOrder?.detail ? (
            <OrderDetail order={preview.selectedOrder} detail={preview.selectedOrder.detail} onBack={() => navigateFromShell('orders')} onExit={() => navigateFromShell('orders')} onCancelOrder={selectedReview ? () => setCancelOrderId(selectedReview.id) : undefined} canReply={demo?.drafts.find(record => record.id === preview.selectedOrder?.id && record.company === companyName)?.communication?.canReply ?? preview.selectedOrder.communication?.canReply ?? false} onEdit={selectedReview ? () => setReviewEditingId(selectedReview.id) : undefined}
              actions={demo && preview.selectedOrder.filterId === 'done' ? <CompletedOrderMenu onExit={() => navigateFromShell('orders')} onDuplicate={() => {
                const id = demo.duplicateOrder(preview.selectedOrder!.id)
                if (id) { setFilterId('all'); preview.openCreatedOrder(id) }
              }} /> : undefined} />
          ) : (
            <>
              <PageHeader title="Мои заказы" floatingWorkActions breadcrumbs={[{ label: 'Мои заказы' }]} actions={<><HeaderAction action="add" accessibleName="Добавить заказ" data-create-order disabled={!demo} onAction={() => {
                  if (!demo) return
                  const id = demo.createDraft()
                  setFilterId('all')
                  preview.openCreatedOrder(id)
                }} /><MoreAction disabled /></>} />
              <p className="fos-sr-only">Демонстрационные данные. Интеграция с 1С не подключена.</p>
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
      {exitGuard.dialog}
      <ConfirmDialog open={cancelOrderId !== null} title="Отменить заказ?" body="Заказ останется в истории со статусом «Отменён»." confirmLabel="Да" cancelLabel="Нет" onConfirm={() => { if (cancelOrderId) demo?.cancelOrder(cancelOrderId, companyName); setCancelOrderId(null) }} onCancel={() => setCancelOrderId(null)} onDismiss={() => setCancelOrderId(null)} />
    </div>
  )
}
