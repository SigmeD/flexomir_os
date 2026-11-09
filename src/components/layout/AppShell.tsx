import { useEffect, useState, type ReactNode } from 'react'
import { NavigationDrawer } from '@/components/ui/navigation-drawer'
import { SidebarNav, type SidebarNavItem } from '@/components/ui/sidebar-nav'
import { AccountMenu } from './AccountMenu'
import { DEMO_PROFILE_IDENTITIES, type DemoProfileIdentity } from '@/demo/profile-model'
import { useCabinetNavigation } from './CabinetNavigation'
import { ProfileSettingsScreen } from '@/screens/profile/ProfileSettingsScreen'
import './app-shell.css'

interface AppShellProps {
  children: ReactNode
  items: readonly SidebarNavItem[]
  activeId: string
  /** Selected UI only. Real route commits require a separate navigation contract. */
  onSelect: (id: string) => void
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
  children, items, activeId, onSelect,
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
    <div className="fos-app-shell" data-variant={variant} onClick={event => {
      // Sidebar/Drawer intentionally skip selecting an already active section.
      // The shell host still owns its root route (e.g. detail → Orders list).
      const target = event.target
      if (!(target instanceof Element)) return
      const current = target.closest<HTMLButtonElement>('button.fos-sidebar-nav__item[aria-current="page"]:not([disabled])')
      if (current) onSelect(activeId)
    }}>
      <aside className="fos-app-shell__aside" aria-label="Навигация">
        <div className="fos-app-shell__brand">FLEXOMIR OS</div>
        <SidebarNav items={items} activeId={activeId} motionFromId={navigation?.motionFromSection} onSelect={onSelect} ariaLabel={navigationLabel} />
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
              onSelectionSettled={onSelect}
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
