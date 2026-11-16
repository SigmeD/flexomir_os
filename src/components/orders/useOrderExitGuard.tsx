import { useCallback, useEffect, useRef, useState } from 'react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import type { OrderItemExitActions } from './OrderItemForm'

/** One exit contract for order and item editors. A failed commit keeps the route and values. */
export function useOrderExitGuard() {
  const item = useRef<OrderItemExitActions | null>(null)
  const order = useRef<OrderItemExitActions | null>(null)
  const [itemDirty, setItemDirty] = useState(false)
  const [orderDirty, setOrderDirty] = useState(false)
  const [pending, setPending] = useState<(() => void) | null>(null)
  const [busy, setBusy] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const dirty = itemDirty || orderDirty
  const registerItem = useCallback((actions: OrderItemExitActions | null) => {
    item.current = actions
    setItemDirty(Boolean(actions?.dirty))
  }, [])
  const registerOrder = useCallback((actions: OrderItemExitActions | null) => {
    order.current = actions
    setOrderDirty(Boolean(actions?.dirty))
  }, [])
  const requestExit = useCallback((action: () => void) => {
    if (item.current?.dirty || order.current?.dirty) setPending(() => action)
    else action()
  }, [])
  const dismiss = useCallback(() => { setPending(null); setResetKey(value => value + 1) }, [])
  async function finish(save: boolean) {
    if (!pending || busy) return
    const itemWasDirty = Boolean(item.current?.dirty)
    if (save) {
      setBusy(true)
      try {
        if (itemWasDirty && !await item.current?.commit()) { setResetKey(value => value + 1); return }
        if ((itemWasDirty || order.current?.dirty) && order.current && !await order.current.commit()) { setResetKey(value => value + 1); return }
      } finally { setBusy(false) }
    } else {
      if (itemWasDirty) item.current?.discard()
      if (order.current?.dirty) order.current.discard()
    }
    const action = pending
    setPending(null)
    action()
  }
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  return {
    dirty, resetKey, registerItem, registerOrder, requestExit,
    dialog: <ConfirmDialog open={pending !== null} title="Сохранить изменения?" confirmLabel="Да" cancelLabel="Нет" busy={busy} onConfirm={() => void finish(true)} onCancel={() => void finish(false)} onDismiss={dismiss} />,
  }
}
