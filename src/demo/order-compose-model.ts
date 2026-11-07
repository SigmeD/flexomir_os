import type { OrderListItem, OrderItemSummaryView } from '@/components/orders/order-model'

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
}

export interface DemoDraft {
  id: string
  company: string
  items: readonly DemoItem[]
  requestedDate: string
  comment: string
  stage: 'draft' | 'sent'
  ownerRole: 'client' | 'manager'
  sourceOrderId?: string
}

export const emptyDemoItem = (): DemoItem => ({
  id: '', name: '', quantity: '', shape: '', width: '', height: '', material: '',
  printMethod: '', artworkMode: 'UPLOAD', fileName: '',
})

const positive = (value: string) => value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) > 0

/** Deliberately local demo rules; backend requiredness and date policy remain OPEN. */
export function validDemoItem(item: DemoItem): boolean {
  return Boolean(item.name.trim() && item.shape && item.material && item.printMethod
    && positive(item.quantity) && Number.isSafeInteger(Number(item.quantity))
    && positive(item.width) && positive(item.height)
    && (item.artworkMode === 'HELP' || (item.artworkMode === 'UPLOAD' && item.fileName) || (item.artworkMode === 'LIBRARY' && item.layoutId && item.layoutName)))
}

export function validDemoDate(value: string): boolean {
  if (!value) return true // Requiredness OPEN, optional in this demo.
  const date = new Date(value + 'T00:00:00Z')
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export const canSendDemo = (draft: DemoDraft) => draft.stage === 'draft' && draft.items.length > 0
  && draft.items.every(validDemoItem) && validDemoDate(draft.requestedDate)

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
    id: draft.id, company: draft.company, title: draft.items[0]?.name || (draft.ownerRole === 'manager' ? 'Новый заказ менеджера' : 'Новый демонстрационный заказ'),
    statusLabel: draft.ownerRole === 'manager' ? 'Черновик менеджера' : draft.stage === 'draft' ? 'Черновик' : 'Передан менеджеру',
    filterId: draft.ownerRole === 'manager' || draft.stage === 'draft' ? 'draft' : null,
    detail: { items: draft.items.map(itemSummary), requestedDate: draft.requestedDate, comment: draft.comment },
  }
}
