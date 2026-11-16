import { useLayoutEffect, useRef, useState } from 'react'
import type { OrderListItem } from './order-model'

/** Local list/detail navigation, with no URL, history, storage, backend or role mutations. */
export function useOrderPreview(orders: readonly OrderListItem[], exitGuard?: { dirty: boolean; requestExit: (action: () => void) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const session = useRef(crypto.randomUUID())
  const selectedRef = useRef(selectedId)
  const guardRef = useRef(exitGuard)
  const ordersRef = useRef(orders)
  selectedRef.current = selectedId
  guardRef.current = exitGuard
  ordersRef.current = orders
  const surfaceRef = useRef<HTMLDivElement>(null)
  const returnPoint = useRef<{ id: string; scrollY: number } | null>(null)
  const selectedOrder = orders.find(order => order.id === selectedId && order.detail)
  const visibleId = selectedOrder?.id

  useLayoutEffect(() => {
    if (history.state?.orderPreview?.session !== session.current) {
      history.replaceState({ ...history.state, orderPreview: { session: session.current, id: null } }, '')
    }
    const pop = (event: PopStateEvent) => {
      if (!surfaceRef.current?.getClientRects().length) return
      const state = event.state?.orderPreview
      const nextId = state?.session === session.current && ordersRef.current.some(order => order.id === state.id) ? state.id as string : null
      const currentId = selectedRef.current
      if (currentId === nextId) return
      const apply = () => {
        history.replaceState({ ...history.state, orderPreview: { session: session.current, id: nextId } }, '')
        setSelectedId(nextId)
      }
      if (currentId && guardRef.current?.dirty) {
        history.pushState({ ...history.state, orderPreview: { session: session.current, id: currentId } }, '')
        guardRef.current.requestExit(apply)
      } else apply()
    }
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [])

  useLayoutEffect(() => {
    if (visibleId) {
      window.scrollTo(0, 0)
      return
    }
    const previous = returnPoint.current
    if (!previous) return
    const buttons = surfaceRef.current?.querySelectorAll<HTMLButtonElement>('button[data-order-open]') ?? []
    const opener = Array.from(buttons).find(button => button.dataset.orderOpen === previous.id)
      ?? surfaceRef.current?.querySelector<HTMLButtonElement>('button[data-create-order]')
    opener?.focus({ preventScroll: true })
    window.scrollTo(0, previous.scrollY)
    returnPoint.current = null
  }, [visibleId])

  return {
    surfaceRef,
    selectedOrder,
    // Only called with an ID returned by the local demo controller in this same event.
    openCreatedOrder(id: string) {
      returnPoint.current = { id, scrollY: window.scrollY }
      history.pushState({ ...history.state, orderPreview: { session: session.current, id } }, '')
      setSelectedId(id)
    },
    openOrder(id: string) {
      if (!orders.some(order => order.id === id && order.detail)) return
      returnPoint.current = { id, scrollY: window.scrollY }
      history.pushState({ ...history.state, orderPreview: { session: session.current, id } }, '')
      setSelectedId(id)
    },
    backToList() {
      history.replaceState({ ...history.state, orderPreview: { session: session.current, id: null } }, '')
      setSelectedId(null)
    },
  }
}
