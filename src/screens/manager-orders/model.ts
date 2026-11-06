import type { GlassPillFilter } from '@/components/ui/glass-pill-tabs'

/** Frontend-only presentation keys. These are not API/1C enums or state transitions. */
export type OrderStatusFilterId = 'all' | 'draft' | 'review' | 'work' | 'done'

/**
 * A view model supplied to the React screen by its caller.
 * Any real API mapping is owned separately by the agreed backend contract.
 */
export interface OrderListItem {
  id: string
  title: string
  company: string
  statusLabel: string
  /** Optional UI-only grouping; null means visible only under "Все заказы". */
  filterId: Exclude<OrderStatusFilterId, 'all'> | null
}

export const ORDER_STATUS_FILTERS: readonly GlassPillFilter[] = [
  { id: 'all', label: 'Все заказы' },
  { id: 'draft', label: 'Черновики' },
  { id: 'review', label: 'На рассмотрении' },
  { id: 'work', label: 'В работе' },
  { id: 'done', label: 'Завершённые' },
]
