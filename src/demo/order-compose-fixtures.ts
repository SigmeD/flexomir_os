import type { OrderListItem } from '@/components/orders/order-model'
import { itemSummary, type DemoItem } from './order-compose-model'

/** Company 01 synthetic completed order. Never borrow another company's fixtures to repeat. */
export const COMPLETED_DEMO_ITEMS: readonly DemoItem[] = [
  { id: 'DEMO-007-1', name: 'Этикетка DEMO завершённая', quantity: '500', shape: 'Прямоугольная', width: '100', height: '150', material: 'Бумага', printMethod: 'flex', artworkMode: 'UPLOAD', fileName: '', unavailableArtwork: 'исторический demo-artwork.pdf, реального файла нет' },
  { id: 'DEMO-007-2', name: 'Вторая завершённая DEMO', quantity: '200', shape: 'Круглая', width: '50', height: '50', material: 'Плёнка', printMethod: 'digit', artworkMode: 'HELP', fileName: '' },
]
export const COMPLETED_DEMO_ORDER: OrderListItem = {
  id: 'DEMO-007', title: 'Завершённый демонстрационный заказ', company: 'Компания 01', statusLabel: 'Завершён', filterId: 'done',
  detail: { items: COMPLETED_DEMO_ITEMS.map(itemSummary), requestedDate: '12.05.2026', agreedDate: '15.05.2026', comment: 'Синтетический источник для стандартного дублирования.' },
}
