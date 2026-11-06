import type { GlassPillFilter } from '@/components/ui/glass-pill-tabs'

/** Presentation keys only. No API/1C enums, permissions or workflow transitions. */
export type OrderStatusFilterId = 'all' | 'draft' | 'review' | 'work' | 'done'

export interface OrderListItem {
  id: string
  title: string
  company: string
  statusLabel: string
  /** null is visible only in "Все заказы"; supplied by the caller. */
  filterId: Exclude<OrderStatusFilterId, 'all'> | null
}

export const ORDER_STATUS_FILTERS: readonly GlassPillFilter[] = [
  { id: 'all', label: 'Все заказы' },
  { id: 'draft', label: 'Черновики' },
  { id: 'review', label: 'На рассмотрении' },
  { id: 'work', label: 'В работе' },
  { id: 'done', label: 'Завершённые' },
]
