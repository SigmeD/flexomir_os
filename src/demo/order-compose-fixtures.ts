import type { OrderListItem } from '@/components/orders/order-model'
import { itemSummary, type DemoDraft, type DemoItem } from './order-compose-model'

/** Complete synthetic records for Review and pre-API transfer-lock acceptance. */
export function itemActionsFixtures(fixture: string): readonly DemoDraft[] {
  if (!['item-actions-review', 'item-actions-transfer'].includes(fixture)) return []
  return [{ id: 'DEMO-REVIEW-001', company: 'Компания 01', stage: 'sent', ownerRole: 'client',
    requestedDate: '2026-12-03', comment: 'Общий комментарий REVIEW', transferStarted: fixture === 'item-actions-transfer', communication: { canReply: true },
    items: [1, 2].map(index => ({ id: 'DEMO-REVIEW-001-ITEM-' + index, name: 'Позиция REVIEW ' + index,
      quantity: '500', shape: 'Прямоугольная', width: '100', height: '150', material: 'Бумага', printMethod: 'flex',
      artworkMode: 'HELP', fileName: '', comment: 'Комментарий REVIEW ' + index })),
  }]
}

/** Company 01 synthetic completed order. Never borrow another company's fixtures to repeat. */
export const COMPLETED_DEMO_ITEMS: readonly DemoItem[] = [
  { id: 'DEMO-007-1', name: 'Этикетка DEMO завершённая', quantity: '500', shape: 'Прямоугольная', width: '100', height: '150', material: 'Бумага', printMethod: 'flex', artworkMode: 'UPLOAD', fileName: '', unavailableArtwork: 'исторический demo-artwork.pdf, реального файла нет' },
  { id: 'DEMO-007-2', name: 'Вторая завершённая DEMO', quantity: '200', shape: 'Круглая', width: '50', height: '50', material: 'Плёнка', printMethod: 'digit', artworkMode: 'HELP', fileName: '' },
]
export const COMPLETED_DEMO_ORDER: OrderListItem = {
  id: 'DEMO-007', title: 'Завершённый демонстрационный заказ', company: 'Компания 01', statusLabel: 'Завершён', filterId: 'done',
  detail: { items: COMPLETED_DEMO_ITEMS.map(itemSummary), requestedDate: '12.05.2026', agreedDate: '15.05.2026', comment: 'Синтетический источник для стандартного дублирования.' },
}
