import type { GlassPillFilter } from '@/components/ui/glass-pill-tabs'

/**
 * FE-08 PUBLIC PREVIEW FIXTURES ONLY.
 * These records, filter assignments and client labels do not originate from 1C.
 * In production the screen receives a typed list and a separately approved
 * data adapter; never treat filterId as a backend status or enum.
 */
export type DemoOrderStatus = 'draft' | 'review' | 'production' | 'done' | 'cancelled'
export type DemoFilterId = 'all' | 'draft' | 'review' | 'work' | 'done'

export interface ManagerOrderPreview {
  id: string
  title: string
  company: string
  status: DemoOrderStatus
  /** Demo-only UI filter membership, not the 1C lifecycle. */
  filterId: Exclude<DemoFilterId, 'all'> | null
}

export const MANAGER_ORDER_FILTERS: readonly GlassPillFilter[] = [
  { id: 'all', label: 'Все заказы' },
  { id: 'draft', label: 'Черновики' },
  { id: 'review', label: 'На рассмотрении' },
  { id: 'work', label: 'В работе' },
  { id: 'done', label: 'Завершённые' },
]

/** Presentation labels, not source-system values or approved 1C mapping. */
export const MANAGER_ORDER_STATUS_LABELS: Record<DemoOrderStatus, string> = {
  draft: 'Черновик',
  review: 'На рассмотрении',
  production: 'В работе',
  done: 'Завершён',
  cancelled: 'Отменён',
}

export const MANAGER_ORDERS_DEMO: readonly ManagerOrderPreview[] = [
  { id: 'DEMO-001', title: 'Демонстрационный заказ 01', company: 'Компания 01', status: 'draft', filterId: 'draft' },
  { id: 'DEMO-002', title: 'Демонстрационный заказ 02', company: 'Компания 02', status: 'review', filterId: 'review' },
  { id: 'DEMO-003', title: 'Демонстрационный заказ 03', company: 'Компания 01', status: 'production', filterId: 'work' },
  { id: 'DEMO-004', title: 'Демонстрационный заказ 04', company: 'Компания 03', status: 'done', filterId: 'done' },
  { id: 'DEMO-005', title: 'Демонстрационный заказ 05', company: 'Компания 02', status: 'cancelled', filterId: null },
  { id: 'DEMO-006', title: 'Демонстрационный заказ 06', company: 'Компания 03', status: 'production', filterId: 'work' },
]
