import { useEffect, useState, type ReactNode } from 'react'
import { NavigationDrawer } from '@/components/ui/navigation-drawer'
import { SidebarNav, type SidebarNavItem } from '@/components/ui/sidebar-nav'
import './app-shell.css'

interface AppShellProps {
  children: ReactNode
  items: readonly SidebarNavItem[]
  activeId: string
  /** Selected UI only. Real route commits require a separate navigation contract. */
  onSelect: (id: string) => void
  roleLabel: string
  navigationLabel: string
  menuLabel: string
  triggerLabel: string
  footerText: string
}

/** Responsive composition only. Material, motion and modal lifecycle belong to shared primitives. */
export function AppShell({
  children, items, activeId, onSelect,
  roleLabel, navigationLabel, menuLabel, triggerLabel, footerText,
}: AppShellProps) {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 1023px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')
    const syncViewport = () => setCompact(media.matches)
    media.addEventListener('change', syncViewport)
    syncViewport()
    return () => media.removeEventListener('change', syncViewport)
  }, [])

  return (
    <div className="fos-app-shell">
      <aside className="fos-app-shell__aside" aria-label="Навигация">
        <div className="fos-app-shell__brand">FLEXOMIR OS</div>
        <p className="fos-app-shell__role">{roleLabel}</p>
        <SidebarNav items={items} activeId={activeId} onSelect={onSelect} ariaLabel={navigationLabel} />
      </aside>
      <div className="fos-app-shell__content">
        <header className="fos-app-shell__mobile-header" data-testid="app-shell-mobile-header">
          <div className="fos-app-shell__identity">
            <strong>FLEXOMIR OS</strong>
            <span>{roleLabel}</span>
          </div>
          {compact && (
            <NavigationDrawer
              items={items}
              activeId={activeId}
              onSelect={onSelect}
              ariaLabel={menuLabel}
              triggerLabel={triggerLabel}
              footerText={footerText}
            />
          )}
        </header>
        {children}
      </div>
    </div>
  )
}
