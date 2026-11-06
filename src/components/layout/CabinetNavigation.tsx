import { createContext, useContext } from 'react'
import type { CabinetSection } from './CabinetPage'

/** Local demo destinations supplied by the workspace; no production routing/authorization. */
export const CabinetNavigation = createContext<{ ready: readonly CabinetSection[]; navigate: (section: CabinetSection) => void } | null>(null)
export const useCabinetNavigation = () => useContext(CabinetNavigation)
