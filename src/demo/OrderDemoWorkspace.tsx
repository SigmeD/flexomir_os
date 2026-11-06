import { useRef, useState } from 'react'
import { ClientOrdersScreen } from '@/screens/client-orders/ClientOrdersScreen'
import { ManagerOrdersScreen } from '@/screens/manager-orders/ManagerOrdersScreen'
import { CLIENT_DEMO_COMPANY, CLIENT_ORDERS_DEMO } from '@/screens/client-orders/fixtures'
import { MANAGER_ORDERS_DEMO } from '@/screens/manager-orders/fixtures'
import { canSendDemo, draftView, type DemoDraft } from './order-compose-model'

export interface OrderDemoController {
  drafts: readonly DemoDraft[]
  createDraft: () => string
  saveDraft: (draft: DemoDraft) => void
  sendDraft: (draft: DemoDraft) => void
}

/** All state dies on reload. No browser persistence, auth, upload or network requests. */
export function OrderDemoWorkspace({ role, empty = false }: { role: 'client' | 'manager'; empty?: boolean }) {
  const [drafts, setDrafts] = useState<readonly DemoDraft[]>([])
  const nextOrder = useRef(100)
  const controller: OrderDemoController = {
    drafts,
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
  }
  return role === 'client'
    ? <ClientOrdersScreen orders={[...(empty ? [] : CLIENT_ORDERS_DEMO), ...drafts.map(draftView)]} companyName={CLIENT_DEMO_COMPANY} demo={controller} />
    : <ManagerOrdersScreen orders={empty ? [] : MANAGER_ORDERS_DEMO} />
}
