import { useEffect, useRef, useState } from 'react'
import { commitOrderFilterNavigation, type ContentNavigationDirection } from '@/components/layout/navigation-content-motion'
import { OrdersList } from './OrdersList'
import type { OrderListItem } from './order-model'

interface OutgoingList {
  orders: readonly OrderListItem[]
  total: number
  epoch: number
}

/** Keep the departing list visible for the accepted two-sided filter motion. */
export function useOrderFilterMotion(orders: readonly OrderListItem[], total: number) {
  const epoch = useRef(0)
  const [outgoing, setOutgoing] = useState<OutgoingList | null>(null)
  useEffect(() => {
    if (!outgoing) return
    const timer = window.setTimeout(() => setOutgoing(current => current?.epoch === outgoing.epoch ? null : current), 330)
    return () => window.clearTimeout(timer)
  }, [outgoing])
  const navigate = (direction: ContentNavigationDirection, commit: () => void) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    commitOrderFilterNavigation(direction, () => {
      setOutgoing(reduced ? null : { orders, total, epoch: ++epoch.current })
      commit()
    })
  }
  return { outgoing, navigate }
}

export function OrderFilterResults({ orders, total, idPrefix, motionKey, outgoing, onOpen }: {
  orders: readonly OrderListItem[]
  total: number
  idPrefix: string
  motionKey: string
  outgoing: OutgoingList | null
  onOpen: (id: string) => void
}) {
  return <div className="fos-order-filter-results">
    {outgoing && <div className="fos-order-filter-results__old" aria-hidden="true" inert>
      <OrdersList orders={outgoing.orders} total={outgoing.total} idPrefix={'snapshot-' + idPrefix} snapshot />
    </div>}
    <OrdersList key={motionKey} orders={orders} total={total} idPrefix={idPrefix} onOpen={onOpen} />
  </div>
}
