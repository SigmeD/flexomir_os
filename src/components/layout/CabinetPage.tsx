import type { ReactNode } from 'react'
import { AppShell } from './AppShell'
import type { SidebarNavItem } from '@/components/ui/sidebar-nav'
import '@/components/orders/orders-page.css'
import './cabinet-page.css'

export type CabinetRole = 'client' | 'manager'
export type CabinetSection = 'orders' | 'clients' | 'artworks' | 'support'
export function cabinetItems(role: CabinetRole, ready: readonly CabinetSection[]): readonly SidebarNavItem[] {
  const items: SidebarNavItem[] = [{ id: 'orders', label: 'Заказы', icon: 'orders' },
    role === 'client' ? { id: 'artworks', label: 'Макеты', icon: 'artworks' } : { id: 'clients', label: 'Клиенты', icon: 'clients' },
    { id: 'support', label: 'Поддержка', icon: 'support' }]
  return items.map(item => ({ ...item, disabled: !ready.includes(item.id as CabinetSection) }))
}
export function CabinetPage({ role, section, children, onNavigate, ready = [section] }: {
  role: CabinetRole; section: CabinetSection; children: ReactNode; ready?: readonly CabinetSection[]; onNavigate?: (section: CabinetSection) => void
}) {
  const name = role === 'client' ? 'Клиент' : 'Менеджер'
  const owner = role === 'client' ? 'клиента' : 'менеджера'
  return <div className="fos-orders-page fos-cabinet" data-testid={role + '-' + section + '-screen'}>
    <AppShell variant={role} items={cabinetItems(role, ready)} activeId={section} onSelect={id => onNavigate?.(id as CabinetSection)}
      roleLabel={name} identityLabel={role === 'client' ? 'Компания 01' : name} navigationLabel={'Навигация ' + owner}
      menuLabel={'Меню ' + owner} triggerLabel={'Открыть меню ' + owner} footerText={role === 'client' ? 'Компания 01' : name}>
      <main className="fos-orders-page__main fos-cabinet__main" data-role={role}>{children}</main>
    </AppShell>
  </div>
}
