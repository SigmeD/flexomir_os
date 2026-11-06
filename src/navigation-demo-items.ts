import type { SidebarNavItem } from '@/components/ui/sidebar-nav'

/**
 * Isolated component-lab navigation fixtures.
 * One set of labels AND exact same FOS icons for Desktop SidebarNav and
 * Tablet/Mobile NavigationDrawer; role business routes remain an app concern.
 *
 * OWNER GL-02B refinement (04 Nov 2026): reuse the approved desktop icon
 * variants in mobile, superseding the icon-less current Drawer Figma instance.
 */
export const managerNavigationDemoItems: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы', icon: 'orders' },
  { id: 'clients', label: 'Клиенты', icon: 'clients' },
  { id: 'support', label: 'Поддержка', icon: 'support' },
]

export const clientNavigationDemoItems: readonly SidebarNavItem[] = [
  { id: 'orders', label: 'Заказы', icon: 'orders' },
  { id: 'artworks', label: 'Макеты', icon: 'artworks' },
  { id: 'support', label: 'Поддержка', icon: 'support' },
]
