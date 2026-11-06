import type { OrderListItem } from '@/components/orders/order-model'

/** Synthetic display records shared by previews. Not an API or an ACL implementation. */
export const DEMO_ORDERS: readonly OrderListItem[] = [
  { id: 'DEMO-001', title: 'Демонстрационный заказ 01', company: 'Компания 01', statusLabel: 'Черновик', filterId: 'draft', detail: { items: [] } },
  { id: 'DEMO-002', title: 'Демонстрационный заказ 02', company: 'Компания 02', statusLabel: 'На рассмотрении', filterId: 'review', detail: {
    items: [{ id: 'DEMO-002-1', name: 'Визитки', specifications: '90 × 50 мм · 500 шт.', artworkLabel: 'Макет: демо-пример без файла' }],
    requestedDate: '16.11.2026',
  } },
  { id: 'DEMO-003', title: 'Демонстрационный заказ 03', company: 'Компания 01', statusLabel: 'В работе', filterId: 'work', detail: {
    items: [
      { id: 'DEMO-003-1', name: 'Этикетка самоклеящаяся для транспортной упаковки — демонстрационная позиция с длинным названием', specifications: '100 × 150 мм · 10 000 шт.', artworkLabel: 'Макет: демо-пример без файла' },
      { id: 'DEMO-003-2', name: 'Визитки', specifications: '90 × 50 мм · 500 шт.', artworkLabel: 'Макет: сведения не подключены' },
    ],
    requestedDate: '16.11.2026', agreedDate: '20.11.2026',
    comment: 'Синтетический пример для проверки состава заказа.\nДанные и даты показаны только в демонстрации.',
  } },
  { id: 'DEMO-004', title: 'Демонстрационный заказ 04', company: 'Компания 03', statusLabel: 'Завершён', filterId: 'done', detail: {
    items: [{ id: 'DEMO-004-1', name: 'Этикетка самоклеящаяся', specifications: '100 × 150 мм · 10 000 шт.', artworkLabel: 'Макет: демо-пример без файла' }],
    requestedDate: '12.05.2026', comment: 'Демонстрационный завершённый заказ.',
  } },
  { id: 'DEMO-005', title: 'Демонстрационный заказ 05', company: 'Компания 02', statusLabel: 'Отменён', filterId: null, detail: { items: [] } },
  { id: 'DEMO-006', title: 'Демонстрационный заказ 06', company: 'Компания 03', statusLabel: 'В работе', filterId: 'work', detail: {
    items: [{ id: 'DEMO-006-1', name: 'Упаковка', specifications: '200 × 300 мм · 1 000 шт.', artworkLabel: 'Макет: сведения не подключены' }],
    requestedDate: '23.11.2026',
  } },
]
