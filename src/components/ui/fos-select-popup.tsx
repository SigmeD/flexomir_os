import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { FosPopup, type FosPopupItem } from './fos-popup'
import { usePopupSelectionRest } from './use-popup-selection-rest'

export type FOSSelectPopupProps = Pick<ComponentProps<'select'>, 'onChange' | 'onInvalid' | 'disabled' | 'required' | 'name' | 'form' | 'children' | 'className' | 'title' | 'aria-invalid' | 'aria-describedby'> & {
  value?: string; defaultValue?: string
  id: string; label: string; readOnly?: boolean; autoFocus?: boolean; emptyIsPlaceholder?: boolean
  onFocus?: ComponentProps<'button'>['onFocus']
  onBlur?: ComponentProps<'button'>['onBlur']
  onKeyDown?: ComponentProps<'button'>['onKeyDown']
}

/** Single-select pilot: the real select owns form values/events/validity; the popup owns presentation. */
export function FOSSelectPopup({ id, label, readOnly, children, onChange, onInvalid, onFocus, onBlur, onKeyDown, autoFocus, emptyIsPlaceholder = true, ...props }: FOSSelectPopupProps) {
  const native = useRef<HTMLSelectElement>(null), trigger = useRef<HTMLButtonElement>(null), popup = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<FosPopupItem[]>([])
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [settling, setSettling] = useState<string | null>(null)
  const activation = useRef(0)
  const [invalid, setInvalid] = useState(false)
  const [position, setPosition] = useState<CSSProperties>({ top: 0, left: 0, width: 0, maxHeight: 256 })
  const search = useRef({ text: '', time: 0 })
  const controlled = useRef(props.value)
  controlled.current = props.value
  const listId = id + '-options'
  const refresh = () => {
    const select = native.current
    if (!select) return
    // React may restore a rejected controlled candidate after native dispatch returns.
    // Reconcile the visible value/error from the owner's value, never that temporary candidate.
    const committed = controlled.current ?? select.value
    setValue(committed)
    const invalidNow = select.willValidate && ((select.required && committed === '') || select.validity.customError)
    setInvalid(previous => previous && invalidNow)
    setItems(Array.from(select.options).map(option => ({ id: option.value, label: option.text,
      disabled: option.disabled || option.parentElement?.matches('optgroup:disabled') || Boolean(props.required && emptyIsPlaceholder && option.value === ''),
    })))
  }
  useLayoutEffect(refresh, [children, props.value, props.defaultValue, props.required, emptyIsPlaceholder])
  useEffect(() => {
    const form = native.current?.form
    let resetFrame = 0
    // The reset event precedes the browser's default action. Read after it has completed.
    const reset = () => {
      activation.current += 1; setSettling(null); setOpen(false); setInvalid(false); cancelAnimationFrame(resetFrame)
      resetFrame = requestAnimationFrame(() => {
        if (native.current && controlled.current !== undefined) native.current.value = String(controlled.current)
        refresh()
      })
    }
    form?.addEventListener('reset', reset)
    return () => { form?.removeEventListener('reset', reset); cancelAnimationFrame(resetFrame) }
  }, [])
  useEffect(() => { if (props.disabled || readOnly) { activation.current += 1; setSettling(null); setOpen(false) } }, [props.disabled, readOnly])

  const focus = (option: HTMLElement | undefined | null) => {
    option?.focus({ preventScroll: true })
    option?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
  const options = () => Array.from(popup.current?.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)') ?? [])
  const close = (restore: boolean) => { activation.current += 1; setSettling(null); setOpen(false); if (restore) trigger.current?.focus({ preventScroll: true }) }
  usePopupSelectionRest({ open, target: settling, value: controlled.current ?? value, generation: activation, surfaceRef: popup, onComplete: close })
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const box = trigger.current?.getBoundingClientRect()
      if (!box) return
      const desired = Math.min(256, (popup.current?.querySelector('.fos-popup-surface__content') as HTMLElement | null)?.scrollHeight ?? 256)
      const below = window.innerHeight - box.bottom - 22, above = box.top - 22
      const flip = below < desired && above > below
      const maxHeight = Math.max(40, Math.min(256, flip ? above : below))
      const width = Math.min(box.width, window.innerWidth - 32)
      setPosition({ top: flip ? box.top - Math.min(desired, maxHeight) - 6 : box.bottom + 6, left: Math.max(16, Math.min(box.left, window.innerWidth - width - 16)), width, maxHeight })
    }
    place()
    focus(options().find(option => option.getAttribute('aria-selected') === 'true') ?? options()[0])
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !popup.current?.contains(event.target) && !trigger.current?.contains(event.target)) close(false)
    }
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close(true) } }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  const choose = (next: string) => {
    const select = native.current
    if (!select || props.disabled || readOnly || items.find(item => item.id === next)?.disabled) return
    const previous = controlled.current ?? select.value
    if (previous !== next) {
      select.value = next
      // Dispatch a real native change, so existing React handlers receive the actual select target.
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }
    refresh()
    if (previous === next) close(true)
    else { activation.current += 1; setSettling(next) }
  }
  const onKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = options(), current = enabled.indexOf(document.activeElement as HTMLButtonElement)
    const next = event.key === 'ArrowDown' ? enabled[(current + 1) % enabled.length]
      : event.key === 'ArrowUp' ? enabled[(current - 1 + enabled.length) % enabled.length]
      : event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled.at(-1) : undefined
    if (next) { event.preventDefault(); focus(next) }
    else if (event.key === 'Tab') {
      // Resume normal document tab order at the real field, not at the body portal.
      close(true)
    } else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const now = performance.now()
      search.current = { text: (now - search.current.time < 700 ? search.current.text : '') + event.key.toLocaleLowerCase(), time: now }
      const match = enabled.find(option => option.textContent?.trim().toLocaleLowerCase().startsWith(search.current.text))
      if (match) { event.preventDefault(); focus(match) }
    }
  }
  return <>
    <select {...props} required={props.required && !readOnly} ref={native} id={id + '-native'} tabIndex={-1} aria-hidden="true" className="fos-field__native-proxy"
      onChange={event => { onChange?.(event); if (controlled.current === undefined) refresh() }} onInvalid={event => { onInvalid?.(event); event.preventDefault(); setInvalid(true); close(true) }}>
      {children}
    </select>
    <FosButtonRoot family="field" ref={trigger} id={id} type="button" role="combobox" aria-label={label} aria-haspopup="listbox"
      aria-controls={listId} aria-expanded={open} aria-required={(props.required && !readOnly) || undefined} aria-readonly={readOnly || undefined}
      aria-invalid={invalid || props['aria-invalid']} aria-describedby={props['aria-describedby']} disabled={props.disabled}
      title={props.title} data-empty={(emptyIsPlaceholder && value === '') || undefined} className={'fos-field__control fos-field__select-button ' + (props.className ?? '')}
      autoFocus={autoFocus} onFocus={onFocus} onBlur={onBlur} value={value}
      onClick={() => { if (!readOnly) { if (open) close(true); else setOpen(true) } }}
      onKeyDown={event => { onKeyDown?.(event); if (!event.defaultPrevented && !readOnly && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); setOpen(true) } }}>
      <span className="fos-field__select-label">{items.find(item => item.id === value)?.label ?? ''}</span>
    </FosButtonRoot>
    {open && createPortal(<FosPopup ref={popup} mode="listbox" id={listId} aria-label={label} selectedId={value}
      items={items} onSelect={choose} className="fos-popup--select" style={position} onKeyDown={onKeys} />, document.body)}
  </>
}
