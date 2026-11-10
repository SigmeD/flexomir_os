import { useEffect, useState, type ReactNode } from 'react'
import { NavigationDrawer } from '@/components/ui/navigation-drawer'
import { SidebarNav, type SidebarNavItem } from '@/components/ui/sidebar-nav'
import { AccountMenu } from './AccountMenu'
import { DEMO_PROFILE_IDENTITIES, type DemoProfileIdentity } from '@/demo/profile-model'
import { useCabinetNavigation } from './CabinetNavigation'
import type { CabinetSection } from './CabinetPage'
import { ProfileSettingsScreen } from '@/screens/profile/ProfileSettingsScreen'
import './app-shell.css'

interface AppShellProps {
  children: ReactNode
  items: readonly SidebarNavItem[]
  activeId: string
  /** Selected UI only. Real route commits require a separate navigation contract. */
  onSelect: (id: string) => void
  /** Reset the section's nested view after leaving Profile through its active nav item. */
  onProfileReturnToRoot?: () => void
  roleLabel: string
  variant?: 'client' | 'manager'
  identityLabel?: string
  navigationLabel: string
  menuLabel: string
  triggerLabel: string
  footerText: string
  accountIdentity?: DemoProfileIdentity
  accountPhotoPreview?: string | null
  onOpenProfile?: () => void
  drawerSelectionResetKey?: number
}

/** Responsive composition only. Material, motion and modal lifecycle belong to shared primitives. */
export function AppShell({
  children, items, activeId, onSelect, onProfileReturnToRoot,
  roleLabel, variant = 'client', identityLabel = roleLabel, navigationLabel, menuLabel, triggerLabel, footerText,
  accountIdentity: suppliedIdentity, accountPhotoPreview: suppliedPhotoPreview, onOpenProfile: suppliedOpenProfile,
  drawerSelectionResetKey,
}: AppShellProps) {
  const navigation = useCabinetNavigation()
  const contextMatchesRole = navigation?.role === variant
  const accountIdentity = suppliedIdentity ?? (contextMatchesRole ? navigation?.identity : undefined) ?? DEMO_PROFILE_IDENTITIES[variant]
  const accountPhotoPreview = suppliedPhotoPreview ?? (contextMatchesRole ? navigation?.photoPreview : undefined) ?? null
  const onOpenProfile = suppliedOpenProfile ?? (contextMatchesRole ? navigation?.openProfile : undefined) ?? (() => undefined)
  const showProfile = Boolean(navigation?.profileOpen && navigation.profileRole === variant && navigation.profileSection === activeId && navigation.profile)
  const selectSection = (id: string) => {
    if (showProfile && navigation) navigation.navigate(id as CabinetSection, id === activeId ? onProfileReturnToRoot : undefined)
    else onSelect(id)
  }
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 1023px)').matches)
  const [drawerSelection, setDrawerSelection] = useState(activeId)
  useEffect(() => { setDrawerSelection(activeId) }, [activeId, drawerSelectionResetKey])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')
    const syncViewport = () => setCompact(media.matches)
    media.addEventListener('change', syncViewport)
    syncViewport()
    return () => media.removeEventListener('change', syncViewport)
  }, [])

  return (
    <div className="fos-app-shell" data-variant={variant}>
      <aside className="fos-app-shell__aside" aria-label="Навигация">
        <div className="fos-app-shell__brand">FLEXOMIR OS</div>
        <SidebarNav items={items} activeId={activeId} motionFromId={navigation?.motionFromSection} onSelect={selectSection} ariaLabel={navigationLabel} />
        {!compact && <AccountMenu identity={accountIdentity} photoPreview={accountPhotoPreview} placement="sidebar" onOpenProfile={onOpenProfile} />}
      </aside>
      <div className="fos-app-shell__content">
        <header className="fos-app-shell__mobile-header" data-testid="app-shell-mobile-header">
          <div className="fos-app-shell__identity">
            <strong>FLEXOMIR OS</strong>
          </div>
          {compact && (
            <NavigationDrawer
              items={items}
              activeId={drawerSelection}
              onSelect={setDrawerSelection}
              onSelectionSettled={selectSection}
              ariaLabel={menuLabel}
              triggerLabel={triggerLabel}
              footerText={footerText}
            />
          )}
          {compact && <AccountMenu identity={accountIdentity} photoPreview={accountPhotoPreview} placement="header" onOpenProfile={onOpenProfile} />}
        </header>
        {showProfile && navigation?.profile
          ? <main className="fos-orders-page__main fos-cabinet__main fos-profile-main" data-layout="standard" data-role={variant} data-section={activeId}>
              <ProfileSettingsScreen {...navigation.profile} />
            </main>
          : children}
      </div>
    </div>
  )
}
