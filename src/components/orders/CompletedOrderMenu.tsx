import { HeaderAction } from '@/components/ui/header-action'
import { OverflowMenu } from '@/components/ui/overflow-menu'

/** Completed 1846:2942: composition of the same header/action/menu masters. */
export function CompletedOrderMenu({ onDuplicate }: { onDuplicate: () => void }) {
  return <>
    <HeaderAction action="send" accessibleName="Отправить завершённый заказ" disabled title="Завершённый заказ доступен только для просмотра" />
    <OverflowMenu items={[{ id: 'duplicate', label: 'Дублировать заказ', onSelect: onDuplicate, focusAfter: 'consumer' }]} />
  </>
}
