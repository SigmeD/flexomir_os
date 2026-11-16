import type { OrderListItem } from '@/components/orders/order-model'
import { itemSummary, type DemoDraft, type DemoItem } from './order-compose-model'
import { ORDER_STATUS_LABELS } from '@/components/orders/order-model'

/** Complete synthetic records for Review and pre-API transfer-lock acceptance. */
export function itemActionsFixtures(fixture: string): readonly DemoDraft[] {
  if (!['item-actions-review', 'item-actions-transfer'].includes(fixture)) return []
  return [{ id: 'DEMO-REVIEW-001', company: 'Компания 01', stage: 'sent', ownerRole: 'client',
    requestedDate: '2026-12-03', agreedDate: '2026-12-05', comment: 'Общий комментарий REVIEW', transferStarted: fixture === 'item-actions-transfer', communication: { canReply: true },
    items: [1, 2].map(index => ({ id: 'DEMO-REVIEW-001-ITEM-' + index, name: 'Позиция REVIEW ' + index,
      quantity: '500', shape: 'Прямоугольная', width: '100', height: '150', material: 'Бумага', printMethod: 'flex',
      artworkMode: 'HELP', fileName: '', comment: 'Комментарий REVIEW ' + index })),
  }]
}

/** Full local editor data for the existing synthetic Work/Done records. No server record is inferred from display-only data. */
export const MANAGER_LIFECYCLE_FIXTURES: readonly DemoDraft[] = [
  { id: 'DEMO-001', title: 'Демонстрационный заказ 01', company: 'Компания 01', ownerRole: 'manager', stage: 'draft',
    requestedDate: '', comment: '', items: [], communication: { canReply: true, phase: 'open' } },
  { id: 'DEMO-002', title: 'Демонстрационный заказ 02', company: 'Компания 02', ownerRole: 'client', stage: 'sent',
    requestedDate: '2026-11-16', comment: '',
    items: [{ id: 'DEMO-002-1', name: 'Визитки', quantity: '500', shape: 'Прямоугольная', width: '90', height: '50', material: 'Бумага', printMethod: 'digit', artworkMode: 'HELP', fileName: '' }],
    communication: { canReply: true, phase: 'open' } },
  { id: 'DEMO-003', title: 'Демонстрационный заказ 03', company: 'Компания 01', ownerRole: 'manager', stage: 'sent', transferStarted: true,
    requestedDate: '2026-11-16', agreedDate: '2026-11-20', comment: 'Синтетический пример для проверки состава заказа.\nДанные и даты показаны только в демонстрации.',
    items: [
      { id: 'DEMO-003-1', name: 'Этикетка самоклеящаяся для транспортной упаковки — демонстрационная позиция с длинным названием', quantity: '10000', shape: 'Прямоугольная', width: '100', height: '150', material: 'Бумага', printMethod: 'flex', artworkMode: 'HELP', fileName: '' },
      { id: 'DEMO-003-2', name: 'Визитки', quantity: '500', shape: 'Прямоугольная', width: '90', height: '50', material: 'Бумага', printMethod: 'digit', artworkMode: 'HELP', fileName: '' },
    ], communication: { canReply: true, phase: 'work' } },
  { id: 'DEMO-004', title: 'Демонстрационный заказ 04', company: 'Компания 03', ownerRole: 'manager', stage: 'done',
    requestedDate: '2026-05-12', comment: 'Демонстрационный завершённый заказ.',
    items: [{ id: 'DEMO-004-1', name: 'Этикетка самоклеящаяся', quantity: '10000', shape: 'Прямоугольная', width: '100', height: '150', material: 'Бумага', printMethod: 'flex', artworkMode: 'HELP', fileName: '' }],
    communication: { canReply: false, phase: 'readonly' } },
  { id: 'DEMO-006', title: 'Демонстрационный заказ 06', company: 'Компания 03', ownerRole: 'manager', stage: 'sent', transferStarted: true,
    requestedDate: '2026-11-23', comment: '',
    items: [{ id: 'DEMO-006-1', name: 'Упаковка', quantity: '1000', shape: 'Прямоугольная', width: '200', height: '300', material: 'Бумага', printMethod: 'flex', artworkMode: 'HELP', fileName: '' }],
    communication: { canReply: true, phase: 'work' } },
]

/** Company 01 synthetic completed order. Never borrow another company's fixtures to repeat. */
export const COMPLETED_DEMO_ITEMS: readonly DemoItem[] = [
  { id: 'DEMO-007-1', name: 'Этикетка DEMO завершённая', quantity: '500', shape: 'Прямоугольная', width: '100', height: '150', material: 'Бумага', printMethod: 'flex', artworkMode: 'UPLOAD', fileName: '', unavailableArtwork: 'исторический demo-artwork.pdf, реального файла нет' },
  { id: 'DEMO-007-2', name: 'Вторая завершённая DEMO', quantity: '200', shape: 'Круглая', width: '50', height: '50', material: 'Плёнка', printMethod: 'digit', artworkMode: 'HELP', fileName: '' },
]
export const COMPLETED_DEMO_ORDER: OrderListItem = {
  id: 'DEMO-007', title: 'Завершённый демонстрационный заказ', company: 'Компания 01', statusLabel: ORDER_STATUS_LABELS.done, filterId: 'done',
  detail: { items: COMPLETED_DEMO_ITEMS.map(itemSummary), requestedDate: '12.05.2026', agreedDate: '15.05.2026', comment: 'Синтетический источник для стандартного дублирования.' },
}
