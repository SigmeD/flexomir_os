import { createContext, useContext, useRef, useState, type ReactNode } from 'react'

export interface DemoLayout { id: string; title: string; meta: string; description: string; sourceName?: string; previewName?: string }
export interface LayoutUploadValue { title: string; description: string; sourceName: string; previewName: string }
const fixtures: readonly DemoLayout[] = [
  { id: 'demo-layout-01', title: 'Этикетка 100×150', meta: 'Последний заказ №142', description: '' },
  { id: 'demo-layout-02', title: 'Визитка двусторонняя', meta: 'Последний заказ №118', description: '' },
  { id: 'demo-layout-03', title: 'Стикер для упаковки', meta: 'Последний заказ №103', description: '' },
]
interface LayoutDemo { layouts: readonly DemoLayout[]; add: (value: LayoutUploadValue) => DemoLayout }
const Context = createContext<LayoutDemo | null>(null)
/** Explicit synthetic client-only library; names/metadata only, no file bytes or persistence. */
export function LayoutDemoProvider({ children }: { children: ReactNode }) {
  const [layouts, setLayouts] = useState(fixtures)
  const sequence = useRef(100)
  return <Context.Provider value={{ layouts, add(value) {
    const layout = { ...value, id: 'demo-layout-' + sequence.current++, title: value.title.trim(), meta: 'Выбран локально · только демосессия' }
    setLayouts(current => [...current, layout]); return layout
  } }}>{children}</Context.Provider>
}
export function useLayoutDemo() {
  const value = useContext(Context)
  if (!value) throw new Error('LayoutDemoProvider is required')
  return value
}
