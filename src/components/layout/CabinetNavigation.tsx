import { createContext, useContext } from 'react'
import type { CabinetSection } from './CabinetPage'
import type { DemoProfileIdentity, ProfileRole } from '@/demo/profile-model'
import type { DemoProfileDraft } from '@/demo/profile-model'
import type { CabinetRole } from './CabinetPage'

/** Local demo destinations supplied by the workspace; no production routing/authorization. */
export const CabinetNavigation = createContext<{
  ready: readonly CabinetSection[]
  navigate: (section: CabinetSection) => void
  identity?: DemoProfileIdentity
  photoPreview?: string | null
  openProfile?: () => void
  role?: ProfileRole
  profileOpen?: boolean
  profileRole?: CabinetRole
  profileSection?: CabinetSection
  profile?: {
    identity: DemoProfileIdentity
    draft: DemoProfileDraft
    dirty: boolean
    saving: boolean
    saveError: string
    saveStatus: string
    onDraftChange: (next: DemoProfileDraft) => void
    onSave: () => Promise<boolean>
  }
} | null>(null)
export const useCabinetNavigation = () => useContext(CabinetNavigation)
