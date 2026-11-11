import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import { FOSInput } from './fos-controls'
import { FosButtonRoot } from './fos-button-root'
import { FosPopup } from './fos-popup'
import { DateLensContext, FosDatePickerDay } from './fos-date-picker-day'
import { dateFromISO, dateToISO, displayDate, inputDate, russianDate } from './date-only'
import './fos-date-picker.css'

export interface FOSDatePickerProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  min?: string
  max?: string
  name?: string
  id?: string
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  error?: string
  helper?: string
  /** Optional UI draft owner for forms whose editors unmount while editing an item. */
  inputDraft?: string
  onInputDraftChange?: (text: string) => void
  onValidityChange?: (valid: boolean) => void
}
/** Owner-approved shared calendar; ISO data and an optional uncommitted UI draft stay separate. */
export function FOSDatePicker({ label, value, onValueChange, min, max, name, id: suppliedId, readOnly, disabled, required, error, helper, inputDraft, onInputDraftChange, onValidityChange }: FOSDatePickerProps) {
  const generated = useId(), id = suppliedId || generated
  const input = useRef<HTMLInputElement>(null), proxy = useRef<HTMLInputElement>(null)
  const trigger = useRef<HTMLButtonElement>(null), dialog = useRef<HTMLDialogElement>(null)
  const initialValue = useRef(value)
  const openingDate = useRef<Date | undefined>(undefined)
  const [localDraft, setLocalDraft] = useState(displayDate(value))
  const draft = inputDraft ?? localDraft
  const setDraft = (text: string) => { setLocalDraft(text); onInputDraftChange?.(text) }
  const [touched, setTouched] = useState(false)
  const [resetVersion, setResetVersion] = useState(0)
  const [open, setOpen] = useState(false)
  const [previewDay, setPreviewDay] = useState<string>()
  const [month, setMonth] = useState<Date>(() => dateFromISO(value) || new Date())
  const lower = dateFromISO(min || ''), upper = dateFromISO(max || '')
  const boundsConflict = !!lower && !!upper && min! > max!
  const withinBounds = (iso: string) => !boundsConflict && (!lower || iso >= min!) && (!upper || iso <= max!)
  const typed = draft === '' ? '' : inputDate(draft)
  const invalid = !readOnly && !disabled && (typed === undefined || (typed !== '' && !withinBounds(typed)) || (required && typed === ''))
  const invalidMessage = invalid ? 'Проверьте дату' : ''
  const onChangeRef = useRef(onValueChange)
  onChangeRef.current = onValueChange
  const synchronized = useRef({ value, resetVersion })
  useLayoutEffect(() => {
    // A remounted field must retain its form-owned invalid text. Only a real
    // controlled value change or reset replaces that draft with formatted ISO.
    if (synchronized.current.value !== value || synchronized.current.resetVersion !== resetVersion) {
      setDraft(displayDate(value)); setTouched(false)
      synchronized.current = { value, resetVersion }
    }
  }, [value, resetVersion])
  useLayoutEffect(() => {
    input.current?.setCustomValidity(invalidMessage)
    proxy.current?.setCustomValidity(invalidMessage)
  }, [invalidMessage])
  useLayoutEffect(() => { onValidityChange?.(!invalid) }, [invalid, onValidityChange])
  useEffect(() => {
    const form = proxy.current?.form
    const reset = (event: Event) => { queueMicrotask(() => {
      if (event.defaultPrevented || readOnly || disabled) return
      // Reconcile against the accepted controlled prop after the callback,
      // including a parent's rejection of this reset request.
      setResetVersion(version => version + 1); setOpen(false)
      onChangeRef.current(initialValue.current)
    }) }
    form?.addEventListener('reset', reset)
    return () => form?.removeEventListener('reset', reset)
  }, [readOnly, disabled])
  const dismiss = () => {
    dialog.current?.close()
    setOpen(false)
    trigger.current?.focus()
  }
  useLayoutEffect(() => {
    if (!open) return
    const panel = dialog.current
    panel?.showModal()
    const place = () => {
      if (!panel) return
      // CSS zoom is useful in QA and accessibility settings. Rects are measured
      // after zoom; CSS lengths need the inverse factor. Browser zoom already
      // reports a smaller CSS viewport and needs no special conversion.
      let zoom = 1
      for (let node: HTMLElement | null = panel; node; node = node.parentElement) zoom *= parseFloat(getComputedStyle(node).zoom) || 1
      const viewport = window.visualViewport
      const width = viewport?.width || innerWidth, height = viewport?.height || innerHeight
      const leftEdge = viewport?.offsetLeft || 0, topEdge = viewport?.offsetTop || 0
      panel.style.setProperty('--fos-date-width', Math.min(360, (width - 24) / zoom) + 'px')
      panel.style.setProperty('--fos-date-max-height', (height - 24) / zoom + 'px')
      const anchor = input.current?.getBoundingClientRect(), box = panel.getBoundingClientRect()
      const left = Math.max(leftEdge + 12, Math.min(anchor?.left || leftEdge + 12, leftEdge + width - box.width - 12))
      const below = (anchor?.bottom || topEdge) + 8
      const above = (anchor?.top || topEdge) - box.height - 8
      const top = below + box.height <= topEdge + height - 12 ? below : above >= topEdge + 12 ? above : topEdge + 12
      panel.style.left = left / zoom + 'px'
      panel.style.top = top / zoom + 'px'
    }
    place()
    const observer = new ResizeObserver(place)
    if (input.current) observer.observe(input.current)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    window.visualViewport?.addEventListener('resize', place)
    window.visualViewport?.addEventListener('scroll', place)
    const focus = requestAnimationFrame(() => {
      const target = openingDate.current && Array.from(panel?.querySelectorAll<HTMLButtonElement>('.rdp-day_button:not(:disabled)') || [])
        .find(button => button.getAttribute('aria-label') === russianDate(openingDate.current!))
      ;(target || panel?.querySelector<HTMLElement>('.rdp-day_button[tabindex="0"]'))?.focus()
    })
    return () => {
      cancelAnimationFrame(focus); observer.disconnect(); panel?.close()
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      window.visualViewport?.removeEventListener('resize', place)
      window.visualViewport?.removeEventListener('scroll', place)
    }
  }, [open])
  useEffect(() => { if ((readOnly || disabled || boundsConflict) && open) dismiss() }, [readOnly, disabled, boundsConflict, open])
  const reveal = () => {
    if (readOnly || disabled || boundsConflict) return
    let anchor = dateFromISO(value) || new Date()
    if (lower && anchor < lower) anchor = lower
    if (upper && anchor > upper) anchor = upper
    openingDate.current = anchor
    setPreviewDay(undefined)
    setMonth(anchor)
    setOpen(true)
  }
  return <div className="fos-date-picker">
    <FOSInput ref={input} id={id} label={label} type="text" inputMode="numeric" autoComplete="off"
      value={draft} placeholder="ДД.ММ.ГГГГ" readOnly={readOnly} disabled={disabled} required={required}
      error={error || (touched && invalid ? 'Проверьте дату' : undefined)} helper={helper}
      aria-describedby={id + '-format'}
      onChange={event => {
        const next = event.target.value
        setDraft(next)
        if (next === '') onValueChange('')
        else { const iso = inputDate(next); if (iso && withinBounds(iso)) onValueChange(iso) }
      }}
      onBlur={() => {
        setTouched(true)
        // A controlled parent may reject a syntactically valid proposed value.
        if (typed !== undefined && (typed === '' || withinBounds(typed))) setDraft(displayDate(value))
      }}
      onInvalid={event => { event.preventDefault(); setTouched(true); input.current?.focus() }}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' && !readOnly && !disabled) { event.preventDefault(); reveal() }
      }} />
    <span id={id + '-format'} className="fos-sr-only">Формат даты: ДД.ММ.ГГГГ</span>
    {!readOnly && <FosButtonRoot ref={trigger} family="field" className="fos-date-picker__trigger"
      disabled={disabled || boundsConflict} aria-label={'Открыть календарь: ' + label} aria-haspopup="dialog"
      aria-expanded={open} aria-controls={open ? id + '-calendar' : undefined} onClick={reveal}>
      <span className="fos-date-picker__icon" aria-hidden="true"><i /><i /><i /></span>
    </FosButtonRoot>}
    <input ref={proxy} type="date" name={name} value={dateFromISO(value) ? value : ''} min={min} max={max}
      readOnly={readOnly} disabled={disabled} required={required} tabIndex={-1} aria-hidden="true"
      className="fos-field__native-proxy" onChange={() => {}}
      onInvalid={event => { event.preventDefault(); setTouched(true); input.current?.focus() }} />
    {open && createPortal(<dialog ref={dialog} id={id + '-calendar'} aria-label={label}
      onKeyDownCapture={() => setPreviewDay(undefined)}
      className="fos-date-picker-dialog" onCancel={event => { event.preventDefault(); dismiss() }}
      onClick={event => {
        if (event.target !== event.currentTarget) return
        const box = event.currentTarget.getBoundingClientRect()
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dismiss()
      }}
      onKeyDown={event => {
        if (event.key !== 'Tab') return
        const stops = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled):not([tabindex="-1"])'))
        const first = stops[0], last = stops.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }}>
      <FosPopup mode="listbox" role="presentation" data-state="open" className="fos-date-picker-popup"
        semanticRows={<>
          <FosButtonRoot family="utility" className="fos-date-picker-popup__close" aria-label="Закрыть календарь" onClick={dismiss}>×</FosButtonRoot>
          <DateLensContext.Provider value={{ selected: value, preview: previewDay, setPreview: setPreviewDay }}>
          <DayPicker mode="single" required locale={ru} weekStartsOn={1} autoFocus fixedWeeks components={{ Day: FosDatePickerDay }}
            month={month} onMonthChange={next => { setPreviewDay(undefined); setMonth(next) }} selected={dateFromISO(value)}
            startMonth={lower || dateFromISO('0001-01-01')} endMonth={upper || dateFromISO('9999-12-31')}
            disabled={[...(lower ? [{ before: lower }] : []), ...(upper ? [{ after: upper }] : [])]}
            labels={{ labelDayButton: day => russianDate(day) }}
            onSelect={day => {
              // Date selection is a single commit; navigation never calls this.
              if (day && withinBounds(dateToISO(day))) {
                // Also discard an invalid manual draft when selecting the same
                // accepted date, or when the parent rejects the proposed date.
                setDraft(displayDate(value)); setTouched(false)
                onValueChange(dateToISO(day)); dismiss()
              }
            }} />
          </DateLensContext.Provider>
        </>} />
    </dialog>, document.body)}
  </div>
}
