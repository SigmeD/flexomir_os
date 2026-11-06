import { useRef, useState } from 'react'
import { ClientOrdersScreen } from '@/screens/client-orders/ClientOrdersScreen'
import { ManagerOrdersScreen } from '@/screens/manager-orders/ManagerOrdersScreen'
import { CLIENT_DEMO_COMPANY, CLIENT_ORDERS_DEMO } from '@/screens/client-orders/fixtures'
import { MANAGER_ORDERS_DEMO } from '@/screens/manager-orders/fixtures'
import { canSendDemo, draftView, type DemoDraft } from './order-compose-model'
import { COMPLETED_DEMO_ITEMS, COMPLETED_DEMO_ORDER } from './order-compose-fixtures'
import type { OrderStatusFilterId } from '@/components/orders/order-model'

export interface OrderDemoController {
  drafts: readonly DemoDraft[]
  createDraft: () => string
  saveDraft: (draft: DemoDraft) => void
  sendDraft: (draft: DemoDraft) => void
  duplicateOrder: (sourceId: string) => string | undefined
  onEditorStateChange: (open: boolean) => void
}

/** All state dies on reload. No browser persistence, auth, upload or network requests. */
export function OrderDemoWorkspace({ role, empty = false }: { role: 'client' | 'manager'; empty?: boolean }) {
  const [drafts, setDrafts] = useState<readonly DemoDraft[]>([])
  const [currentRole, setCurrentRole] = useState(role)
  const [editorOpen, setEditorOpen] = useState(false)
  const [version, setVersion] = useState(0)
  const [clientFilter, setClientFilter] = useState<OrderStatusFilterId>('all')
  const [managerFilter, setManagerFilter] = useState<OrderStatusFilterId>('all')
  const nextOrder = useRef(100)
  const controller: OrderDemoController = {
    drafts,
    onEditorStateChange: setEditorOpen,
    createDraft() {
      const id = 'DEMO-NEW-' + nextOrder.current++
      setDrafts(current => [...current, { id, company: CLIENT_DEMO_COMPANY, items: [], requestedDate: '', comment: '', stage: 'draft' }])
      return id
    },
    saveDraft(draft) {
      setDrafts(current => current.map(saved => saved.id === draft.id && saved.stage === 'draft'
        ? { ...draft, stage: 'draft', items: draft.items.map(item => ({ ...item })) } : saved))
    },
    sendDraft(draft) {
      if (!canSendDemo(draft)) return
      setDrafts(current => current.map(saved => saved.id === draft.id && saved.stage === 'draft'
        ? { ...draft, stage: 'sent', items: draft.items.map(item => ({ ...item })) } : saved))
    },
    duplicateOrder(sourceId) {
      if (sourceId !== COMPLETED_DEMO_ORDER.id || COMPLETED_DEMO_ORDER.filterId !== 'done') return
      const id = 'DEMO-NEW-' + nextOrder.current++
      const items = COMPLETED_DEMO_ITEMS.map((item, index) => ({ ...item, id: id + '-ITEM-' + (index + 1), fileName: '' }))
      setDrafts(current => [...current, { id, company: CLIENT_DEMO_COMPANY, items, requestedDate: '', comment: COMPLETED_DEMO_ORDER.detail?.comment || '', stage: 'draft', sourceOrderId: sourceId }])
      return id
    },
  }
  const sent = drafts.filter(draft => draft.stage === 'sent')
  return <div className="fos-demo-workspace">
    {new URLSearchParams(window.location.search).get('demoTools') === '1' && <aside className="fos-demo-workspace__controls" aria-label="Управление демонстрацией">
      <p>Демо двух ролей · данные до перезагрузки</p>
      <div><button className="fos-order-action" type="button" disabled={editorOpen} aria-pressed={currentRole === 'client'} onClick={() => setCurrentRole('client')}>Демо: клиент</button>
        <button className="fos-order-action" type="button" disabled={editorOpen} aria-pressed={currentRole === 'manager'} onClick={() => setCurrentRole('manager')}>Демо: менеджер</button>
        <button className="fos-order-action" type="button" disabled={editorOpen} onClick={() => { setDrafts([]); nextOrder.current = 100; setClientFilter('all'); setManagerFilter('all'); setVersion(current => current + 1) }}>Сбросить демо</button></div>
      {editorOpen && <p>Для смены роли или сброса сохраните изменения и вернитесь к списку.</p>}
    </aside>}
    {currentRole === 'client'
      ? <ClientOrdersScreen key={'client-' + version} orders={[...(empty ? [] : [...CLIENT_ORDERS_DEMO, COMPLETED_DEMO_ORDER]), ...drafts.map(draftView)]} companyName={CLIENT_DEMO_COMPANY} demo={controller} initialFilterId={clientFilter} onFilterChange={setClientFilter} />
      : <ManagerOrdersScreen key={'manager-' + version} orders={[...(empty ? [] : MANAGER_ORDERS_DEMO), ...sent.map(draftView)]} demoOrderIds={sent.map(draft => draft.id)} initialFilterId={managerFilter} onFilterChange={setManagerFilter} />}
  </div>
}
