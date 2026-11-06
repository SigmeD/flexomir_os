import { useLayoutEffect, useRef, useState } from 'react'
import type { OrderListItem } from './order-model'

/** Local list/detail navigation, with no URL, history, storage, backend or role mutations. */
export function useOrderPreview(orders: readonly OrderListItem[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const returnPoint = useRef<{ id: string; scrollY: number } | null>(null)
  const selectedOrder = orders.find(order => order.id === selectedId && order.detail)
  const visibleId = selectedOrder?.id

  useLayoutEffect(() => {
    if (visibleId) {
      window.scrollTo(0, 0)
      return
    }
    const previous = returnPoint.current
    if (!previous) return
    const buttons = surfaceRef.current?.querySelectorAll<HTMLButtonElement>('button[data-order-open]') ?? []
    Array.from(buttons).find(button => button.dataset.orderOpen === previous.id)?.focus({ preventScroll: true })
    window.scrollTo(0, previous.scrollY)
    returnPoint.current = null
  }, [visibleId])

  return {
    surfaceRef,
    selectedOrder,
    openOrder(id: string) {
      if (!orders.some(order => order.id === id && order.detail)) return
      returnPoint.current = { id, scrollY: window.scrollY }
      setSelectedId(id)
    },
    backToList() { setSelectedId(null) },
  }
}
