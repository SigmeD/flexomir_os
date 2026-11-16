import { CabinetPage, type CabinetSection } from '@/components/layout/CabinetPage'
import { LayoutBrowser } from '@/components/layouts/LayoutBrowser'
import { useOrderExitGuard } from '@/components/orders/useOrderExitGuard'
import { useCabinetNavigation } from '@/components/layout/CabinetNavigation'

export function ClientLayoutsScreen({ empty = false, errorFixture = false, onNavigate }: { empty?: boolean; errorFixture?: boolean; onNavigate?: (section: CabinetSection) => void }) {
  const navigation = useCabinetNavigation()
  const exitGuard = useOrderExitGuard()
  return <>
    <CabinetPage role="client" section="artworks" drawerSelectionResetKey={exitGuard.resetKey} onNavigate={section => exitGuard.requestExit(() => (onNavigate ?? navigation?.navigate)?.(section))} onOpenProfile={() => exitGuard.requestExit(() => navigation?.openProfile?.())}>
      <LayoutBrowser empty={empty} errorFixture={errorFixture} onExitActionsChange={exitGuard.registerOrder} requestExit={exitGuard.requestExit} />
    </CabinetPage>
    {exitGuard.dialog}
  </>
}
