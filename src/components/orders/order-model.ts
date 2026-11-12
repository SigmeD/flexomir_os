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
  /** Optional read-only presentation. No opener is rendered when this is absent. */
  detail?: OrderDetailContent
  /** Ephemeral UI-only processing fixture; never an API or 1C status. */
  demoProcessingState?: 'pending' | 'success' | 'error'
  /** Explicit local communication fixture; never derive server ACL from a translated label. */
  communication?: {canReply:boolean; phase:'open'|'work'|'readonly'}
}

export interface OrderItemSummaryView {
  id: string
  name: string
  specifications: string
  artworkLabel: string
}

/** Display fields from Figma; not a required-field, status or backend data contract. */
export interface OrderDetailContent {
  items: readonly OrderItemSummaryView[]
  requestedDate?: string
  agreedDate?: string
  comment?: string
}

export const ORDER_STATUS_FILTERS: readonly GlassPillFilter[] = [
  { id: 'all', label: 'Все заказы' },
  { id: 'draft', label: 'Черновики' },
  { id: 'review', label: 'На рассмотрении' },
  { id: 'work', label: 'В работе' },
  { id: 'done', label: 'Завершённые' },
]
