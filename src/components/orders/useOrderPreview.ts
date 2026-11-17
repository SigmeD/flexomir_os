import { useLayoutEffect, useRef, useState } from 'react'
import type { OrderListItem } from './order-model'
import { commitContentNavigation } from '@/components/layout/navigation-content-motion'

/** Local list/detail navigation, with no URL, history, storage, backend or role mutations. */
export function useOrderPreview(orders: readonly OrderListItem[], exitGuard?: { dirty: boolean; requestExit: (action: () => void) => void }, enableMotion = false) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const session = useRef(crypto.randomUUID())
  const selectedRef = useRef(selectedId)
  const navigationEpoch = useRef(0)
  const guardRef = useRef(exitGuard)
  const ordersRef = useRef(orders)
  guardRef.current = exitGuard
  ordersRef.current = orders
  const surfaceRef = useRef<HTMLDivElement>(null)
  const returnPoint = useRef<{ id: string; scrollY: number } | null>(null)
  const restoreOpenerFocus = useRef(true)
  const selectedOrder = orders.find(order => order.id === selectedId && order.detail)
  const visibleId = selectedOrder?.id
  const select = (id: string | null) => {
    selectedRef.current = id
    const epoch = ++navigationEpoch.current
    const commit = () => { if (navigationEpoch.current === epoch) setSelectedId(id) }
    if (enableMotion) commitContentNavigation(id ? 'forward' : 'back', commit)
    else commit()
  }

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
        select(nextId)
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
    if (restoreOpenerFocus.current) opener?.focus({ preventScroll: true })
    window.scrollTo(0, previous.scrollY)
    returnPoint.current = null
    restoreOpenerFocus.current = true
  }, [visibleId])

  return {
    surfaceRef,
    selectedOrder,
    // Only called with an ID returned by the local demo controller in this same event.
    openCreatedOrder(id: string) {
      returnPoint.current = { id, scrollY: window.scrollY }
      history.pushState({ ...history.state, orderPreview: { session: session.current, id } }, '')
      select(id)
    },
    openOrder(id: string) {
      if (!orders.some(order => order.id === id && order.detail)) return
      returnPoint.current = { id, scrollY: window.scrollY }
      history.pushState({ ...history.state, orderPreview: { session: session.current, id } }, '')
      select(id)
    },
    backToList({ restoreFocus = true }: { restoreFocus?: boolean } = {}) {
      restoreOpenerFocus.current = restoreFocus
      history.replaceState({ ...history.state, orderPreview: { session: session.current, id: null } }, '')
      select(null)
    },
  }
}
