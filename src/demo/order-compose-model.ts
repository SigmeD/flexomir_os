import { ORDER_STATUS_LABELS, type OrderListItem, type OrderItemSummaryView } from '@/components/orders/order-model'

/** Ephemeral UI model. Never use these keys/validation as an API/1C contract. */
export interface DemoItem {
  id: string
  name: string
  quantity: string
  shape: string
  width: string
  height: string
  material: string
  printMethod: '' | 'flex' | 'digit'
  artworkMode: 'UPLOAD' | 'LIBRARY' | 'HELP'
  fileName: string
  layoutId?: string
  layoutName?: string
  unavailableArtwork?: string
  comment?: string
  /** Optional demo-only fields until D01 supplies applicability and a production catalogue. */
  winding?: string
  labelsPerRoll?: string
  inkCount?: string
}

export interface DemoDraft {
  id: string
  title?: string
  company: string
  items: readonly DemoItem[]
  requestedDate: string
  agreedDate?: string
  comment: string
  stage: 'draft' | 'sent' | 'done' | 'cancelled'
  ownerRole: 'client' | 'manager'
  sourceOrderId?: string
  /** Fixture/UI lock only. Real integration state must come from the agreed API. */
  transferStarted?: boolean
  /** Independent local capability fixture; not production ACL/status mapping. */
  communication?: { canReply: boolean; phase?:'open'|'work'|'readonly' }
}

export const canEditDemoItems = (order: DemoDraft, actor: DemoDraft['ownerRole']) => actor === 'manager'
  ? order.stage === 'sent' || order.stage === 'done' || (order.stage === 'draft' && order.ownerRole === actor)
  : !order.transferStarted && order.ownerRole === actor && (order.stage === 'sent' || order.stage === 'draft')

export const validDemoReview = (order: DemoDraft) => (order.stage === 'sent' || order.stage === 'done') && order.items.length > 0
  && order.items.every(validDemoItem) && validDemoDate(order.requestedDate) && validDemoDate(order.agreedDate ?? '')

export const emptyDemoItem = (): DemoItem => ({
  id: '', name: '', quantity: '', shape: '', width: '', height: '', material: '',
  printMethod: '', artworkMode: 'UPLOAD', fileName: '', winding: '', labelsPerRoll: '', inkCount: '',
})

const positive = (value: string) => value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) > 0

export type DemoItemErrors = Partial<Record<'name' | 'quantity' | 'shape' | 'width' | 'height' | 'material' | 'printMethod' | 'artwork' | 'labelsPerRoll' | 'inkCount', string>>

/** Explain the existing local demo rules; this is not an API/1C contract. */
export function demoItemErrors(item: DemoItem): DemoItemErrors {
  const errors: DemoItemErrors = {}
  if (!item.name.trim()) errors.name = 'Введите наименование продукции'
  if (!positive(item.quantity) || !Number.isSafeInteger(Number(item.quantity))) errors.quantity = 'Введите положительное целое число'
  if (!item.shape) errors.shape = 'Выберите форму'
  if (!positive(item.width)) errors.width = 'Введите положительное число'
  if (!positive(item.height)) errors.height = 'Введите положительное число'
  if (!item.material) errors.material = 'Выберите материал'
  if (!item.printMethod) errors.printMethod = 'Выберите способ печати'
  for (const field of ['labelsPerRoll', 'inkCount'] as const) {
    const number = item[field]
    if (number && (!/^[0-9]+$/.test(number) || !positive(number) || !Number.isSafeInteger(Number(number)))) errors[field] = 'Введите положительное целое число'
  }
  if (!(item.artworkMode === 'HELP' || (item.artworkMode === 'UPLOAD' && item.fileName) || (item.artworkMode === 'LIBRARY' && item.layoutId && item.layoutName))) {
    errors.artwork = (item.unavailableArtwork ? 'Исходный макет недоступен. ' : '') + 'Выберите файл заново, макет из библиотеки или запросите помощь.'
  }
  return errors
}

/** Deliberately local demo rules; backend requiredness and date policy remain OPEN. */
export function validDemoItem(item: DemoItem): boolean {
  return Object.keys(demoItemErrors(item)).length === 0
}

export function validDemoDate(value: string): boolean {
  if (!value) return true // Requiredness OPEN, optional in this demo.
  const date = new Date(value + 'T00:00:00Z')
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export const canSendDemo = (draft: DemoDraft) => draft.stage === 'draft' && draft.items.length > 0
  && draft.items.every(validDemoItem) && validDemoDate(draft.requestedDate) && validDemoDate(draft.agreedDate ?? '')

export function itemSummary(item: DemoItem): OrderItemSummaryView {
  const artworkLabel = item.artworkMode === 'HELP' ? 'Макет: нужна помощь'
    : item.artworkMode === 'LIBRARY' && item.layoutName ? 'Макет: ' + item.layoutName + ' (демосессия)'
    : item.fileName ? 'Макет: выбран локально ' + item.fileName + ' (не загружен)'
    : 'Макет: файл недоступен, выберите заново или запросите помощь'
  return { id: item.id, name: item.name,
    specifications: `${item.width} × ${item.height} мм · ${item.quantity} шт.`,
    artworkLabel }
}

export function draftView(draft: DemoDraft): OrderListItem {
  return {
    id: draft.id, company: draft.company, title: draft.title || draft.items[0]?.name || (draft.ownerRole === 'manager' ? 'Новый заказ менеджера' : 'Новый демонстрационный заказ'),
    statusLabel: draft.stage === 'cancelled' ? ORDER_STATUS_LABELS.cancelled : draft.stage === 'done' ? ORDER_STATUS_LABELS.done : draft.stage === 'draft' ? ORDER_STATUS_LABELS.draft : draft.transferStarted ? ORDER_STATUS_LABELS.work : ORDER_STATUS_LABELS.review,
    filterId: draft.stage === 'cancelled' ? null : draft.stage === 'done' ? 'done' : draft.stage === 'draft' ? 'draft' : draft.transferStarted ? 'work' : 'review',
    communication: {canReply:draft.communication?.canReply??false,phase:draft.communication?.phase??'open'},
    detail: { items: draft.items.map(itemSummary), requestedDate: draft.requestedDate, agreedDate: draft.agreedDate, comment: draft.comment },
  }
}
