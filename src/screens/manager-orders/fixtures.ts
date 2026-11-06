import type { OrderListItem } from './model'

/**
 * FE-08 PREVIEW FIXTURES ONLY — synthetic records, never backend / 1C values.
 * The presentation layer receives display labels and UI-only filter groups.
 */
export const MANAGER_ORDERS_DEMO: readonly OrderListItem[] = [
  { id: 'DEMO-001', title: 'Демонстрационный заказ 01', company: 'Компания 01', statusLabel: 'Черновик', filterId: 'draft' },
  { id: 'DEMO-002', title: 'Демонстрационный заказ 02', company: 'Компания 02', statusLabel: 'На рассмотрении', filterId: 'review' },
  { id: 'DEMO-003', title: 'Демонстрационный заказ 03', company: 'Компания 01', statusLabel: 'В работе', filterId: 'work' },
  { id: 'DEMO-004', title: 'Демонстрационный заказ 04', company: 'Компания 03', statusLabel: 'Завершён', filterId: 'done' },
  { id: 'DEMO-005', title: 'Демонстрационный заказ 05', company: 'Компания 02', statusLabel: 'Отменён', filterId: null },
  { id: 'DEMO-006', title: 'Демонстрационный заказ 06', company: 'Компания 03', statusLabel: 'В работе', filterId: 'work' },
]
