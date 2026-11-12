import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { demoItemErrors, emptyDemoItem, validDemoItem, type DemoItem, type DemoItemErrors } from '@/demo/order-compose-model'
import { FOSInput, FOSQuantity, FOSSelect, FOSTextarea } from '@/components/ui/fos-controls'
import { HeaderAction } from '@/components/ui/header-action'
import { PageHeader } from '@/components/ui/page-header'
import { OverflowMenu } from '@/components/ui/overflow-menu'
import { ArtworkSource } from './ArtworkSource'
import { PrintingMethodControl } from './PrintingMethodControl'
import { LayoutBrowser } from '@/components/layouts/LayoutBrowser'
import type { CabinetSection } from '@/components/layout/CabinetPage'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import './order-item-form.css'

export interface OrderItemExitActions {
  dirty: boolean
  commit: () => boolean
  discard: () => void
}

/** New/Edit Item: CURRENT CORE D1791:6130 / T1837:6385 / M1791:6185. */
export function OrderItemForm({ item, initialValue, onSave, onClose, onBackToList, onNavigationSectionChange, onExitActionsChange, onCommit, onDuplicate, onDelete, deleteDisabledReason, orderLabel = 'Новый заказ', role = 'client' }: {
  item?: DemoItem; onSave: (item: DemoItem) => void; onClose: () => void; onBackToList?: () => void
  initialValue?: DemoItem
  onCommit?: (item: DemoItem) => void
  onDuplicate?: () => void
  onDelete?: () => void
  deleteDisabledReason?: string
  orderLabel?: string
  role?: 'client' | 'manager'
  onNavigationSectionChange?: (section: CabinetSection) => void
  onExitActionsChange?: (actions: OrderItemExitActions | null) => void
}) {
  const [initial, setInitial] = useState(() => ({ ...emptyDemoItem(), ...(item ?? initialValue) }))
  const [value, setValue] = useState(initial)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerScroll = useRef(0)
  const form = useRef<HTMLFormElement>(null)
  // A prefilled copy is an unsaved new item even when its fields are unchanged.
  const dirty = Boolean(initialValue) || JSON.stringify(value) !== JSON.stringify(initial)
  const [pendingAction, setPendingAction] = useState<'duplicate' | 'delete' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const restoreMore = () => requestAnimationFrame(() => form.current?.querySelector<HTMLButtonElement>('button.fos-more')?.focus({ preventScroll: true }))
  function runAction(action: 'duplicate' | 'delete') {
    if (action === 'duplicate') onDuplicate?.()
    else setConfirmDelete(true)
  }
  function requestAction(action: 'duplicate' | 'delete') {
    if (dirty) setPendingAction(action)
    else runAction(action)
  }
  function finishAction(save: boolean) {
    if (!pendingAction) return
    if (save) {
      if (!validDemoItem(value) || !onCommit) { form.current?.reportValidity(); return }
      onCommit(value)
      setInitial({ ...value })
    } else { setValue({ ...initial }); setTouched({}) }
    const action = pendingAction
    setPendingAction(null)
    runAction(action)
  }
  const update = (patch: Partial<DemoItem>) => setValue(current => ({ ...current, ...patch }))
  const title = item ? item.name : 'Новая позиция'
  useLayoutEffect(() => { window.scrollTo(0, 0) }, [])
  function exitPicker() {
    setPickerOpen(false)
    requestAnimationFrame(() => { document.querySelector<HTMLElement>('[data-artwork-library]')?.focus({ preventScroll: true }); window.scrollTo(0, pickerScroll.current) })
  }
  const errors = demoItemErrors(value)
  const error = (key: keyof DemoItemErrors) => item || dirty || touched[key] ? errors[key] : undefined
  const blur = (key: string) => () => setTouched(current => ({ ...current, [key]: true }))
  useEffect(() => {
    // The library is nested in this editor; leaving it must still protect the item.
    onExitActionsChange?.({
      dirty,
      commit() {
        if (!dirty) return true
        if (!validDemoItem(value)) {
          form.current?.reportValidity()
          return false
        }
        onSave(value)
        return true
      },
      discard: onClose,
    })
    return () => onExitActionsChange?.(null)
  }, [dirty, item, onClose, onExitActionsChange, onSave, value])
  if (pickerOpen) return <LayoutBrowser mode={item ? 'replace' : 'select'} parentContext={{
    breadcrumb: { label: title },
    navigation: onNavigationSectionChange ? { activeSection: 'artworks', returnSection: 'orders', onSectionChange: onNavigationSectionChange } : undefined,
  }} onChoose={layout => update({ artworkMode: 'LIBRARY', layoutId: layout.id, layoutName: layout.title, fileName: '', unavailableArtwork: undefined })} onExit={exitPicker} />
  return <form ref={form} className="fos-item-form" data-testid="order-item-form" onSubmit={event => {
    event.preventDefault()
    if (dirty && validDemoItem(value)) onSave(value)
  }} onKeyDown={event => {
    // Portal events bubble through React parents; menu Escape must not also leave the form.
    if (event.key === 'Escape' && !event.defaultPrevented && event.currentTarget.contains(event.target as Node) && !dirty) { event.stopPropagation(); onClose() }
  }}>
    <PageHeader title={title} floatingWorkActions autoFocus breadcrumbs={[
      { label: role === 'manager' ? 'Заказы' : 'Мои заказы', onSelect: onBackToList, disabled: dirty },
      { label: orderLabel, onSelect: onClose, disabled: dirty }, { label: title },
    ]} actions={<>
      <HeaderAction action={item ? 'save' : 'add'} accessibleName={item ? 'Сохранить позицию' : 'Добавить позицию'} disabled={!dirty || !validDemoItem(value)} onAction={() => form.current?.requestSubmit()} />
      <OverflowMenu items={item ? [
        { id: 'duplicate', label: 'Дублировать позицию', disabled: !onDuplicate, reason: !onDuplicate ? 'Заказ недоступен для редактирования' : undefined, onSelect: () => requestAction('duplicate'), focusAfter: 'consumer' },
        { id: 'cancel', label: 'Отменить изменения', onSelect: onClose, focusAfter: 'consumer' },
        { id: 'delete', label: 'Удалить позицию', disabled: !onDelete || Boolean(deleteDisabledReason), reason: deleteDisabledReason, onSelect: () => requestAction('delete'), focusAfter: 'consumer' },
      ] : [{ id: 'cancel', label: 'Отменить ввод', onSelect: onClose, focusAfter: 'consumer' }]} />
    </>} />
    <div className="fos-item-form__body">
      <div className="fos-item-form__fields">
        <FOSInput wrapperClassName="fos-item-form__name" label="Наименование продукции" placeholder="Введите наименование" value={value.name} error={error('name')} onBlur={blur('name')} onChange={event => update({ name: event.target.value })} required />
        <FOSQuantity wrapperClassName="fos-item-form__quantity" label="Количество" min="1" value={value.quantity} error={error('quantity')} onBlur={blur('quantity')} onChange={event => update({ quantity: event.target.value })} required />
        <div className="fos-item-form__printing"><PrintingMethodControl value={value.printMethod} error={error('printMethod')} onChange={printMethod => update({ printMethod })} /></div>
        <div className="fos-item-form__dimensions"><FOSSelect wrapperClassName="fos-item-form__shape" label="Форма" value={value.shape} error={error('shape')} onBlur={blur('shape')} onChange={event => update({ shape: event.target.value })} required>
          <option value="">Выберите форму</option><option>Прямоугольная</option><option>Круглая</option>
        </FOSSelect>
        <FOSInput wrapperClassName="fos-item-form__width" label="Ширина, мм" placeholder="Введите ширину" type="number" min="0" step="any" value={value.width} error={error('width')} onBlur={blur('width')} onChange={event => update({ width: event.target.value })} required />
        <FOSInput wrapperClassName="fos-item-form__height" label="Высота, мм" placeholder="Введите высоту" type="number" min="0" step="any" value={value.height} error={error('height')} onBlur={blur('height')} onChange={event => update({ height: event.target.value })} required /></div>
        <FOSSelect wrapperClassName="fos-item-form__material" label="Материал" value={value.material} error={error('material')} onBlur={blur('material')} onChange={event => update({ material: event.target.value })} required>
          <option value="">Выберите материал</option><option>Бумага</option><option>Плёнка</option>
        </FOSSelect>
      </div>
      <div className="fos-item-form__artwork"><ArtworkSource value={value} error={error('artwork')} onChange={update} onOpenLibrary={() => { pickerScroll.current = window.scrollY; setPickerOpen(true) }} /></div>
      <FOSTextarea wrapperClassName="fos-item-form__note" label="Комментарии" placeholder="Необязательно" value={value.comment || ''} onChange={event => update({ comment: event.target.value })} />
    </div>
    <p className="fos-sr-only" role="status">{dirty ? 'Есть несохранённые изменения позиции' : 'Изменений позиции нет'}</p>
    <ConfirmDialog open={pendingAction !== null} title="Сохранить изменения?" confirmLabel="Да" cancelLabel="Нет"
      onConfirm={() => finishAction(true)} onCancel={() => finishAction(false)} onDismiss={() => { setPendingAction(null); restoreMore() }} />
    <ConfirmDialog open={confirmDelete} title="Удалить позицию?" confirmLabel="Удалить" cancelLabel="Отмена"
      onConfirm={() => { setConfirmDelete(false); onDelete?.() }} onCancel={() => { setConfirmDelete(false); restoreMore() }} onDismiss={() => { setConfirmDelete(false); restoreMore() }} />
  </form>
}
