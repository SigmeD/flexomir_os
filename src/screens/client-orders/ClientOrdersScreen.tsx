import { useCallback, useEffect, useRef, useState } from 'react'
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
import type { OrderItemExitActions } from '@/components/orders/OrderItemForm'
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
  processingStates?: Readonly<Record<string, 'pending' | 'success' | 'error'>>
}

/** Client composition: supplied data scope is never a substitute for server authorization. */
export function ClientOrdersScreen({ orders, companyName, demo, initialFilterId = 'all', onFilterChange, processingStates = {} }: ClientOrdersScreenProps) {
  const navigation = useCabinetNavigation()
  const [filterId, setLocalFilterId] = useState<OrderStatusFilterId>(initialFilterId)
  const [itemEditorOpen, setItemEditorOpen] = useState(false)
  const [navigationSection, setNavigationSection] = useState<CabinetSection>('orders')
  const [pendingNavigation, setPendingNavigation] = useState<CabinetSection | 'profile' | null>(null)
  const [drawerResetKey, setDrawerResetKey] = useState(0)
  const [newDraftId, setNewDraftId] = useState<string | null>(null)
  const [reviewEditingId, setReviewEditingId] = useState<string | null>(null)
  const orderExitActions = useRef<OrderItemExitActions | null>(null)
  const registerOrderExitActions = useCallback((actions: OrderItemExitActions | null) => { orderExitActions.current = actions }, [])
  const navigationCommitStarted = useRef(false)
  const itemExitActions = useRef<OrderItemExitActions | null>(null)
  const registerItemExitActions = useCallback((actions: OrderItemExitActions | null) => { itemExitActions.current = actions }, [])
  const setFilterId = (id: OrderStatusFilterId) => { setLocalFilterId(id); onFilterChange?.(id) }
  const resultLabel: Record<'pending' | 'success' | 'error', string> = { pending: 'Ожидает ответа (демо)', success: 'Демо-обработка завершена', error: 'Ошибка демо-обработки' }
  const presentedOrders = orders.map(order => processingStates[order.id] ? { ...order, statusLabel: resultLabel[processingStates[order.id]] } : order)
  const preview = useOrderPreview(presentedOrders)
  const visibleOrders = filterId === 'all' ? presentedOrders : presentedOrders.filter(order => order.filterId === filterId)
  const selectedDraft = demo?.drafts.find(draft => draft.id === preview.selectedOrder?.id && draft.stage === 'draft')
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
    if (itemExitActions.current?.dirty || orderExitActions.current?.dirty) {
      navigationCommitStarted.current = false
      setPendingNavigation(destination)
      return
    }
    leave()
  }

  function finishItemNavigation(discard: boolean) {
    if (pendingNavigation === null || navigationCommitStarted.current) return
    const actions = itemExitActions.current
    if (discard) { actions?.discard(); orderExitActions.current?.discard() }
    else if (actions?.dirty && !actions.commit()) {
      setDrawerResetKey(current => current + 1)
      return
    }
    // An item commit above can change the order synchronously in this same event.
    if (!discard && orderExitActions.current && !orderExitActions.current.commit()) return
    navigationCommitStarted.current = true
    setReviewEditingId(null)
    const destination = pendingNavigation
    setPendingNavigation(null)
    if (destination === 'profile') { setNavigationSection('orders'); navigation?.openProfile?.(); return }
    if (destination === 'orders') preview.backToList()
    else {
      preview.backToList()
      navigation?.navigate(destination)
    }
  }

  function dismissItemNavigation() {
    navigationCommitStarted.current = false
    setPendingNavigation(null)
    setDrawerResetKey(current => current + 1)
  }

  return (
    <div className="fos-orders-page" data-testid="client-orders-screen" ref={preview.surfaceRef}>
      <AppShell
        items={navigation ? cabinetItems('client', navigation.ready) : clientNav} activeId={navigationSection} onSelect={navigateFromShell} drawerSelectionResetKey={drawerResetKey} onProfileReturnToRoot={preview.backToList} onOpenProfile={() => navigateFromShell('profile')}
        roleLabel="Клиент" identityLabel={companyName} variant="client" navigationLabel="Навигация клиента" menuLabel="Меню клиента"
        triggerLabel="Открыть меню клиента" footerText={companyName}
      >
        <main className="fos-orders-page__main" data-layout="standard" data-view={selectedDraft ? 'compose' : preview.selectedOrder ? 'detail' : 'list'}>
          {editingReview && demo ? <OrderComposer key={editingReview.id + '-review'} draft={editingReview} actorRole="client" onSave={order => { demo.saveReviewOrder(order); setReviewEditingId(null) }} onSend={() => {}}
            onBack={() => navigateFromShell('orders')} onCancelReview={() => setReviewEditingId(null)} onItemEditorChange={setItemEditorOpen} onNavigationSectionChange={setNavigationSection} onItemExitActionsChange={registerItemExitActions} onOrderExitActionsChange={registerOrderExitActions} /> : selectedDraft && demo ? (
            <OrderComposer key={selectedDraft.id} draft={selectedDraft} isNewDraft={newDraftId === selectedDraft.id} onSave={demo.saveDraft} onSend={demo.sendDraft} onBack={preview.backToList} onItemEditorChange={setItemEditorOpen} onNavigationSectionChange={setNavigationSection} onItemExitActionsChange={registerItemExitActions} onDeleteDraft={id => demo.deleteDraft(id, 'client')} />
          ) : preview.selectedOrder?.detail ? (
            <OrderDetail order={preview.selectedOrder} detail={preview.selectedOrder.detail} onBack={preview.backToList} canReply={demo?.drafts.find(record => record.id === preview.selectedOrder?.id && record.company === companyName)?.communication?.canReply ?? false} submitted={demo?.drafts.some(draft => draft.id === preview.selectedOrder?.id && draft.stage === 'sent')} onEdit={selectedReview ? () => setReviewEditingId(selectedReview.id) : undefined}
              actions={demo && preview.selectedOrder.filterId === 'done' ? <CompletedOrderMenu onDuplicate={() => {
                const id = demo.duplicateOrder(preview.selectedOrder!.id)
                if (id) { setFilterId('all'); preview.openCreatedOrder(id) }
              }} /> : undefined} />
          ) : (
            <>
              <PageHeader title="Мои заказы" floatingWorkActions breadcrumbs={[{ label: 'Мои заказы' }]} actions={<><HeaderAction action="add" accessibleName="Добавить заказ" data-create-order disabled={!demo} onAction={() => {
                  if (!demo) return
                  const id = demo.createDraft()
                  setNewDraftId(id)
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
              <OrdersList orders={visibleOrders} total={orders.length} idPrefix="client" onOpen={id => { setNewDraftId(null); preview.openOrder(id) }} />
            </>
          )}
        </main>
      </AppShell>
      <ConfirmDialog
        open={pendingNavigation !== null}
        title="Сохранить изменения?"
        confirmLabel="Да"
        cancelLabel="Нет"
        onConfirm={() => finishItemNavigation(false)}
        onCancel={() => finishItemNavigation(true)}
        onDismiss={dismissItemNavigation}
      />
    </div>
  )
}
