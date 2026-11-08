import { Activity, useRef, useState, type ReactNode } from 'react'
import { ClientOrdersScreen } from '@/screens/client-orders/ClientOrdersScreen'
import { ManagerOrdersScreen } from '@/screens/manager-orders/ManagerOrdersScreen'
import { CLIENT_DEMO_COMPANY, CLIENT_ORDERS_DEMO } from '@/screens/client-orders/fixtures'
import { MANAGER_ORDERS_DEMO } from '@/screens/manager-orders/fixtures'
import { DEMO_IMPORTED_1C_ORDER } from './order-fixtures'
import { canSendDemo, draftView, type DemoDraft } from './order-compose-model'
import { COMPLETED_DEMO_ITEMS, COMPLETED_DEMO_ORDER } from './order-compose-fixtures'
import type { OrderStatusFilterId } from '@/components/orders/order-model'
import { FOSAction } from '@/components/ui/fos-controls'
import { CabinetNavigation } from '@/components/layout/CabinetNavigation'
import type { CabinetSection } from '@/components/layout/CabinetPage'
import { ManagerCompaniesScreen } from '@/screens/companies/ManagerCompaniesScreen'
import { SupportScreen } from '@/screens/support/SupportScreen'
import { ClientLayoutsScreen } from '@/screens/layouts/ClientLayoutsScreen'
import { DEMO_COMPANIES } from './company-fixtures'

export interface OrderDemoController {
  drafts: readonly DemoDraft[]
  createDraft: (ownerRole?: 'client' | 'manager') => string
  saveDraft: (draft: DemoDraft) => void
  sendDraft: (draft: DemoDraft) => void
  duplicateOrder: (sourceId: string) => string | undefined
  onEditorStateChange: (open: boolean) => void
}

/** All state dies on reload. No browser persistence, auth, upload or network requests. */
export function OrderDemoWorkspace({ role, empty = false, initialSection = 'orders', errorFixture = '', presentationMode = false, diagnosticMessage }: { role: 'client' | 'manager'; empty?: boolean; initialSection?: CabinetSection; errorFixture?: string; presentationMode?: boolean; diagnosticMessage?: string }) {
  const [drafts, setDrafts] = useState<readonly DemoDraft[]>([])
  const [currentRole, setCurrentRole] = useState(role)
  const [sections, setSections] = useState<Record<'client' | 'manager', CabinetSection>>({ client: role === 'client' ? initialSection : 'orders', manager: role === 'manager' ? initialSection : 'orders' })
  const [visited, setVisited] = useState(() => new Set([role + ':' + initialSection]))
  const [editorOpen, setEditorOpen] = useState(false)
  const [version, setVersion] = useState(0)
  const [clientFilter, setClientFilter] = useState<OrderStatusFilterId>('all')
  const [managerFilter, setManagerFilter] = useState<OrderStatusFilterId>('all')
  const [processingStates, setProcessingStates] = useState<Record<string, 'pending' | 'success' | 'error'>>({})
  const nextOrder = useRef(100)
  const controller: OrderDemoController = {
    drafts,
    onEditorStateChange: setEditorOpen,
    createDraft(ownerRole = 'client') {
      const id = 'DEMO-NEW-' + nextOrder.current++
      setDrafts(current => [...current, { id, company: ownerRole === 'client' ? CLIENT_DEMO_COMPANY : '', items: [], requestedDate: '', comment: '', stage: 'draft', ownerRole }])
      return id
    },
    saveDraft(draft) {
      setDrafts(current => current.map(saved => saved.id === draft.id && saved.stage === 'draft' && saved.ownerRole === draft.ownerRole
        ? { ...draft, stage: 'draft', items: draft.items.map(item => ({ ...item })) } : saved))
    },
    sendDraft(draft) {
      if (draft.ownerRole !== 'client' || !canSendDemo(draft)) return
      setDrafts(current => current.map(saved => saved.id === draft.id && saved.stage === 'draft'
        ? { ...draft, stage: 'sent', items: draft.items.map(item => ({ ...item })) } : saved))
    },
    duplicateOrder(sourceId) {
      if (sourceId !== COMPLETED_DEMO_ORDER.id || COMPLETED_DEMO_ORDER.filterId !== 'done') return
      const id = 'DEMO-NEW-' + nextOrder.current++
      const items = COMPLETED_DEMO_ITEMS.map((item, index) => ({ ...item, id: id + '-ITEM-' + (index + 1), fileName: '' }))
      setDrafts(current => [...current, { id, company: CLIENT_DEMO_COMPANY, items, requestedDate: '', comment: COMPLETED_DEMO_ORDER.detail?.comment || '', stage: 'draft', ownerRole: 'client', sourceOrderId: sourceId }])
      return id
    },
  }
  const sent = drafts.filter(draft => draft.stage === 'sent')
  function visit(nextRole: 'client' | 'manager', section: CabinetSection) {
    setVisited(current => new Set(current).add(nextRole + ':' + section))
    setSections(current => ({ ...current, [nextRole]: section }))
    setCurrentRole(nextRole)
    window.scrollTo(0, 0)
  }
  const activeSection = sections[currentRole]
  function slot(slotRole: 'client' | 'manager', section: CabinetSection, children: ReactNode) {
    if (!visited.has(slotRole + ':' + section)) return null
    return <Activity key={slotRole + ':' + section + ':' + version} mode={currentRole === slotRole && activeSection === section ? 'visible' : 'hidden'}>{children}</Activity>
  }
  const demoTools = new URLSearchParams(window.location.search).get('demoTools') === '1'
  return <div className="fos-demo-workspace">
    {presentationMode && <aside className="fos-demo-workspace__controls fos-demo-workspace__presentation" aria-label="Демонстрация кабинета" data-testid="demo-presentation-controls">
      <div className="fos-demo-workspace__intro"><strong>Демонстрация кабинета</strong><span>Учебные данные · сохраняются только до перезагрузки страницы</span></div>
      <div className="fos-demo-workspace__role" role="group" aria-label="Роль кабинета">
        <FOSAction disabled={editorOpen} aria-pressed={currentRole === 'client'} onClick={() => visit('client', sections.client)}>Демо: клиент</FOSAction>
        <FOSAction disabled={editorOpen} aria-pressed={currentRole === 'manager'} onClick={() => visit('manager', sections.manager)}>Демо: менеджер</FOSAction>
      </div>
      {editorOpen && <p className="fos-demo-workspace__lock" role="status">Сохраните черновик и закройте редактор, чтобы переключить роль или сбросить демо.</p>}
      {diagnosticMessage && <p className="fos-demo-workspace__diagnostic" role="status" data-testid="demo-route-diagnostic">{diagnosticMessage}</p>}
    </aside>}
    {demoTools && <aside className="fos-demo-workspace__controls fos-demo-workspace__technical" aria-label="Техническая лаборатория" data-testid="demo-technical-controls">
      <div className="fos-demo-workspace__intro"><strong>Технические инструменты QA</strong><span>Только для проверки демонстрационного состояния</span></div>
      <div><FOSAction disabled={editorOpen} onClick={() => { setDrafts([]); nextOrder.current = 100; setClientFilter('all'); setManagerFilter('all'); setVersion(current => current + 1) }}>Сбросить демо</FOSAction></div>
      {editorOpen && <p className="fos-demo-workspace__lock" role="status">Закройте редактор, чтобы сбросить демо.</p>}
    </aside>}
    <CabinetNavigation.Provider value={{ ready: currentRole === 'client' ? ['orders', 'artworks', 'support'] : ['orders', 'clients', 'support'], navigate: section => visit(currentRole, section) }}>
      {currentRole === 'client' && slot('client', 'orders', <ClientOrdersScreen orders={[...(empty ? [] : [...CLIENT_ORDERS_DEMO, COMPLETED_DEMO_ORDER]), ...drafts.filter(draft => draft.ownerRole === 'client').map(draftView)]} companyName={CLIENT_DEMO_COMPANY} demo={controller} processingStates={processingStates} initialFilterId={clientFilter} onFilterChange={setClientFilter} />)}
      {currentRole === 'manager' && slot('manager', 'orders', <ManagerOrdersScreen orders={[...(empty ? [] : MANAGER_ORDERS_DEMO), ...(new URLSearchParams(window.location.search).get('fixture') === 'imported-1c' && !empty ? [DEMO_IMPORTED_1C_ORDER] : []), ...sent.map(draft => ({ ...draftView(draft), demoProcessingState: processingStates[draft.id] ?? 'pending' })), ...drafts.filter(draft => draft.ownerRole === 'manager').map(draftView)]} demoOrderIds={sent.map(draft => draft.id)} newOrderIds={sent.map(draft => draft.id)} managerDrafts={drafts.filter(draft => draft.ownerRole === 'manager')} managerCompanies={DEMO_COMPANIES} onCreateOrder={() => controller.createDraft('manager')} onSaveManagerDraft={controller.saveDraft} onEditorStateChange={controller.onEditorStateChange} processingStates={processingStates} onProcessingStateChange={(id, state) => setProcessingStates(current => ({ ...current, [id]: state }))} demoTools={demoTools} initialFilterId={managerFilter} onFilterChange={setManagerFilter} />)}
      {slot('manager', 'clients', <ManagerCompaniesScreen empty={empty} />)}
      {slot('client', 'artworks', <ClientLayoutsScreen empty={empty} errorFixture={errorFixture === 'layout-error'} />)}
      {slot('client', 'support', <SupportScreen role="client" empty={empty} errorFixture={errorFixture === 'support-error'} />)}
      {slot('manager', 'support', <SupportScreen role="manager" empty={empty} errorFixture={errorFixture === 'support-error'} />)}
    </CabinetNavigation.Provider>
  </div>
}
