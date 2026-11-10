import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { Activity, useEffect, useRef, useState, type ReactNode } from 'react'
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
import { DEMO_PROFILE_IDENTITIES, isProfileDraftDirty, useLocalPhotoPreview, type DemoProfileDraft, type DemoProfileIdentity, type ProfileRole } from './profile-model'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { FosGlassMaterial } from '@/components/ui/fos-glass-material'

export interface OrderDemoController {
  drafts: readonly DemoDraft[]
  createDraft: (ownerRole?: 'client' | 'manager') => string
  saveDraft: (draft: DemoDraft) => void
  deleteDraft: (id: string, ownerRole: 'client' | 'manager') => void
  sendDraft: (draft: DemoDraft) => void
  duplicateOrder: (sourceId: string) => string | undefined
  onEditorStateChange: (open: boolean) => void
}

const initialProfileDrafts = (): Record<ProfileRole, DemoProfileDraft> => ({
  client: { displayName: DEMO_PROFILE_IDENTITIES.client.displayName, photoFile: null, photoPendingRemoval: false },
  manager: { displayName: DEMO_PROFILE_IDENTITIES.manager.displayName, photoFile: null, photoPendingRemoval: false },
})

/** All state dies on reload. No browser persistence, auth, upload or network requests. */
export function OrderDemoWorkspace({ role, empty = false, initialSection = 'orders', errorFixture = '', presentationMode = false, diagnosticMessage }: { role: 'client' | 'manager'; empty?: boolean; initialSection?: CabinetSection; errorFixture?: string; presentationMode?: boolean; diagnosticMessage?: string }) {
  const [drafts, setDrafts] = useState<readonly DemoDraft[]>([])
  const [currentRole, setCurrentRole] = useState(role)
  const [sections, setSections] = useState<Record<'client' | 'manager', CabinetSection>>({ client: role === 'client' ? initialSection : 'orders', manager: role === 'manager' ? initialSection : 'orders' })
  const [motionFromSection, setMotionFromSection] = useState<CabinetSection | null>(null)
  const [visited, setVisited] = useState(() => new Set([role + ':' + initialSection]))
  const [editorOpen, setEditorOpen] = useState(false)
  const [version, setVersion] = useState(0)
  const [clientFilter, setClientFilter] = useState<OrderStatusFilterId>('all')
  const [managerFilter, setManagerFilter] = useState<OrderStatusFilterId>('all')
  const [processingStates, setProcessingStates] = useState<Record<string, 'pending' | 'success' | 'error'>>({})
  const [profileIdentities, setProfileIdentities] = useState<Record<ProfileRole, DemoProfileIdentity>>(DEMO_PROFILE_IDENTITIES)
  const [profileDrafts, setProfileDrafts] = useState<Record<ProfileRole, DemoProfileDraft>>(initialProfileDrafts)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaveError, setProfileSaveError] = useState('')
  const [profileSaveStatus, setProfileSaveStatus] = useState('')
  const [saveBeforeNavigation, setSaveBeforeNavigation] = useState(false)
  const [pendingProfileAction, setPendingProfileAction] = useState<(() => void) | null>(null)
  const [presentationVisible, setPresentationVisible] = useState(false)
  const presentationTrigger = useRef<HTMLButtonElement>(null)
  const nextOrder = useRef(100)
  const savedClientPhoto = useLocalPhotoPreview(profileIdentities.client.photoFile)
  const savedManagerPhoto = useLocalPhotoPreview(profileIdentities.manager.photoFile)
  const activeIdentity = profileIdentities[currentRole]
  const activeProfileDraft = profileDrafts[currentRole]
  const profileDirty = isProfileDraftDirty(activeProfileDraft, activeIdentity)
  const profileSaveErrorFixture = new URLSearchParams(window.location.search).get('fixture') === 'profile-save-error'

  useEffect(() => {
    if (!profileOpen || !profileDirty) return
    const protectUnsavedChanges = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', protectUnsavedChanges)
    return () => window.removeEventListener('beforeunload', protectUnsavedChanges)
  }, [profileOpen, profileDirty])
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
    deleteDraft(id, ownerRole) {
      setDrafts(current => current.filter(saved => !(saved.id === id && saved.ownerRole === ownerRole && saved.stage === 'draft')))
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
    setMotionFromSection(sections[currentRole])
    setVisited(current => new Set(current).add(nextRole + ':' + section))
    setSections(current => ({ ...current, [nextRole]: section }))
    setCurrentRole(nextRole)
    window.scrollTo(0, 0)
  }
  function requestProfileTransition(action: () => void) {
    if (profileOpen && profileDirty) {
      setPendingProfileAction(() => action)
      setProfileSaveError('')
      setSaveBeforeNavigation(true)
      return
    }
    action()
  }
  function navigateSection(section: CabinetSection) {
    requestProfileTransition(() => { setProfileOpen(false); visit(currentRole, section) })
  }
  function switchRole(nextRole: ProfileRole) {
    requestProfileTransition(() => { setProfileOpen(false); visit(nextRole, sections[nextRole]) })
  }
  function resetDemo() {
    requestProfileTransition(() => {
      setProfileOpen(false)
      setDrafts([])
      nextOrder.current = 100
      setClientFilter('all')
      setManagerFilter('all')
      setProfileIdentities(DEMO_PROFILE_IDENTITIES)
      setProfileDrafts(initialProfileDrafts())
      setVersion(current => current + 1)
    })
  }
  async function saveProfile(): Promise<boolean> {
    if (profileSaving) return false
    setProfileSaving(true)
    setProfileSaveError('')
    setProfileSaveStatus('')
    await new Promise(resolve => window.setTimeout(resolve, 120))
    if (profileSaveErrorFixture) {
      setProfileSaveError('Не удалось сохранить изменения. Попробуйте ещё раз.')
      setProfileSaving(false)
      return false
    }
    const photoFile = activeProfileDraft.photoPendingRemoval ? null : activeProfileDraft.photoFile
    const nextIdentity: DemoProfileIdentity = {
      ...activeIdentity,
      displayName: activeProfileDraft.displayName,
      photoFile,
    }
    setProfileIdentities(current => ({ ...current, [currentRole]: nextIdentity }))
    setProfileDrafts(current => ({ ...current, [currentRole]: { displayName: nextIdentity.displayName, photoFile, photoPendingRemoval: false } }))
    setProfileSaveStatus('Профиль сохранён в демонстрационной сессии до перезагрузки страницы.')
    setProfileSaving(false)
    return true
  }
  async function saveAndContinue() {
    const action = pendingProfileAction
    if (!action) { setSaveBeforeNavigation(false); return }
    const saved = await saveProfile()
    if (!saved) return
    setSaveBeforeNavigation(false)
    setPendingProfileAction(null)
    action()
  }
  function discardAndContinue() {
    const action = pendingProfileAction
    if (!action) { setSaveBeforeNavigation(false); return }
    setProfileDrafts(current => ({
      ...current,
      [currentRole]: {
        displayName: activeIdentity.displayName,
        photoFile: activeIdentity.photoFile,
        photoPendingRemoval: false,
      },
    }))
    setSaveBeforeNavigation(false)
    setPendingProfileAction(null)
    setProfileSaveError('')
    setProfileSaveStatus('')
    action()
  }
  const activeSection = sections[currentRole]
  function slot(slotRole: 'client' | 'manager', section: CabinetSection, children: ReactNode) {
    if (!visited.has(slotRole + ':' + section)) return null
    return <Activity key={slotRole + ':' + section + ':' + version} mode={currentRole === slotRole && activeSection === section ? 'visible' : 'hidden'}>{children}</Activity>
  }
  const demoTools = new URLSearchParams(window.location.search).get('demoTools') === '1'
  const showPresentation = import.meta.env.DEV && presentationMode
  const showDemoTools = import.meta.env.DEV && demoTools
  return <div className="fos-demo-workspace">
    {showPresentation && (presentationVisible ? <FosGlassMaterial className="fos-demo-workspace__controls fos-demo-workspace__presentation" role="region" aria-label="Демонстрация кабинета" data-testid="demo-presentation-controls" radius={18} tone="neutral" shadow="menu" centerOpacity={0.76} centerColor="248 250 252">
      <div className="fos-demo-workspace__toolbar">
        <div className="fos-demo-workspace__intro"><strong>Демонстрация кабинета</strong><span>Учебные данные · сохраняются только до перезагрузки страницы</span></div>
        <div className="fos-demo-workspace__role" role="group" aria-label="Роль кабинета">
          <FOSAction disabled={editorOpen} aria-pressed={currentRole === 'client'} onClick={() => {
            switchRole('client')
            setPresentationVisible(false)
            requestAnimationFrame(() => presentationTrigger.current?.focus())
          }}>Демо: клиент</FOSAction>
          <FOSAction disabled={editorOpen} aria-pressed={currentRole === 'manager'} onClick={() => {
            switchRole('manager')
            setPresentationVisible(false)
            requestAnimationFrame(() => presentationTrigger.current?.focus())
          }}>Демо: менеджер</FOSAction>
        </div>
        <FosButtonRoot family="utility" type="button" className="fos-demo-workspace__hide" aria-label="Скрыть панель демонстрации" onClick={() => {
          setPresentationVisible(false)
          requestAnimationFrame(() => presentationTrigger.current?.focus())
        }}>×</FosButtonRoot>
      </div>
      {editorOpen && <p className="fos-demo-workspace__lock" role="status">Сохраните черновик и закройте редактор, чтобы переключить роль или сбросить демо.</p>}
      {diagnosticMessage && <p className="fos-demo-workspace__diagnostic" role="status" data-testid="demo-route-diagnostic">{diagnosticMessage}</p>}
      {showDemoTools && <div className="fos-demo-workspace__technical" role="group" aria-label="Технические инструменты QA" data-testid="demo-technical-controls">
        <span>Инструменты только для проверки демо</span>
        <FOSAction disabled={editorOpen} onClick={resetDemo}>Сбросить демо</FOSAction>
      </div>}
    </FosGlassMaterial> : <FosButtonRoot family="utility" ref={presentationTrigger} type="button" className="fos-demo-workspace__show" aria-label="Демо — показать панель демонстрации" onClick={() => setPresentationVisible(true)}>Демо</FosButtonRoot>)}
    <CabinetNavigation.Provider value={{
      ready: currentRole === 'client' ? ['orders', 'artworks', 'support'] : ['orders', 'clients', 'support'],
      navigate: navigateSection,
      motionFromSection,
      identity: activeIdentity,
      photoPreview: currentRole === 'client' ? savedClientPhoto : savedManagerPhoto,
      openProfile: () => requestProfileTransition(() => { setProfileSaveError(''); setProfileSaveStatus(''); setProfileOpen(true) }),
      role: currentRole,
      profileOpen,
      profileRole: currentRole,
      profileSection: activeSection,
      profile: {
        identity: activeIdentity,
        draft: activeProfileDraft,
        dirty: profileDirty,
        saving: profileSaving,
        saveError: profileSaveError,
        saveStatus: profileSaveStatus,
        onDraftChange: (next: DemoProfileDraft) => { setProfileDrafts(current => ({ ...current, [currentRole]: next })); setProfileSaveError(''); setProfileSaveStatus('') },
        onSave: saveProfile,
      },
    }}>
      {currentRole === 'client' && slot('client', 'orders', <ClientOrdersScreen orders={[...(empty ? [] : [...CLIENT_ORDERS_DEMO, COMPLETED_DEMO_ORDER]), ...drafts.filter(draft => draft.ownerRole === 'client').map(draftView)]} companyName={CLIENT_DEMO_COMPANY} demo={controller} processingStates={processingStates} initialFilterId={clientFilter} onFilterChange={setClientFilter} />)}
      {currentRole === 'manager' && slot('manager', 'orders', <ManagerOrdersScreen orders={[...(empty ? [] : MANAGER_ORDERS_DEMO), ...(new URLSearchParams(window.location.search).get('fixture') === 'imported-1c' && !empty ? [DEMO_IMPORTED_1C_ORDER] : []), ...sent.map(draft => ({ ...draftView(draft), demoProcessingState: processingStates[draft.id] ?? 'pending' })), ...drafts.filter(draft => draft.ownerRole === 'manager').map(draftView)]} demoOrderIds={sent.map(draft => draft.id)} newOrderIds={sent.map(draft => draft.id)} managerDrafts={drafts.filter(draft => draft.ownerRole === 'manager')} managerCompanies={DEMO_COMPANIES} onCreateOrder={() => controller.createDraft('manager')} onSaveManagerDraft={controller.saveDraft} onDeleteManagerDraft={id => controller.deleteDraft(id, 'manager')} onEditorStateChange={controller.onEditorStateChange} processingStates={processingStates} onProcessingStateChange={(id, state) => setProcessingStates(current => ({ ...current, [id]: state }))} demoTools={demoTools} initialFilterId={managerFilter} onFilterChange={setManagerFilter} />)}
      {slot('manager', 'clients', <ManagerCompaniesScreen empty={empty} />)}
      {slot('client', 'artworks', <ClientLayoutsScreen empty={empty} errorFixture={errorFixture === 'layout-error'} />)}
      {slot('client', 'support', <SupportScreen role="client" empty={empty} errorFixture={errorFixture === 'support-error'} />)}
      {slot('manager', 'support', <SupportScreen role="manager" empty={empty} errorFixture={errorFixture === 'support-error'} />)}
    </CabinetNavigation.Provider>
    <ConfirmDialog
      open={saveBeforeNavigation}
      title="Сохранить изменения?"
      confirmLabel="Да"
      cancelLabel="Нет"
      busy={profileSaving}
      onConfirm={saveAndContinue}
      onCancel={discardAndContinue}
    />
  </div>
}
