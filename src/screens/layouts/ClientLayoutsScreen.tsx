import { CabinetPage, type CabinetSection } from '@/components/layout/CabinetPage'
import { LayoutBrowser } from '@/components/layouts/LayoutBrowser'

export function ClientLayoutsScreen({ empty = false, errorFixture = false, onNavigate }: { empty?: boolean; errorFixture?: boolean; onNavigate?: (section: CabinetSection) => void }) {
  return <CabinetPage role="client" section="artworks" onNavigate={onNavigate}><LayoutBrowser empty={empty} errorFixture={errorFixture} /></CabinetPage>
}
