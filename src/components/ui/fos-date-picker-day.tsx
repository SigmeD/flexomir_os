import { createContext, useContext } from 'react'
import { Day, type DayProps } from 'react-day-picker'
import { FosGlassMaterial } from './fos-glass-material'
import { dateToISO } from './date-only'

export const DateLensContext = createContext<{
  selected: string
  preview?: string
  setPreview: (date: string | undefined) => void
}>({ selected: '', setPreview: () => {} })

/** Calendar cell adapter; DayPicker still owns the button and all grid/focus semantics. */
export function FosDatePickerDay({ day, modifiers, children, ...props }: DayProps) {
  const { selected, preview, setPreview } = useContext(DateLensContext)
  const available = !modifiers.disabled && !modifiers.hidden && !modifiers.outside
  const active = available && (preview ?? selected) === dateToISO(day.date)
  return <Day {...props} day={day} modifiers={modifiers} data-date-lens-active={active || undefined}
    onPointerMove={event => {
      props.onPointerMove?.(event)
      if ((event.pointerType === 'mouse' || event.pointerType === 'pen') && event.buttons === 0) setPreview(available ? dateToISO(day.date) : undefined)
    }}
    onPointerLeave={event => { props.onPointerLeave?.(event); setPreview(undefined) }}>
    {active && <FosGlassMaterial aria-hidden="true" data-date-lens="" className="fos-date-picker__day-lens"
      radius={14} blur={1.5} strength={.1} shadow="reference" lighting="sidebar"
      tone="neutral" centerOpacity={.12} centerColor="var(--fos-neutral-glass-rgb, 248 248 248)"
      rimWidth={12} />}
    {children}
  </Day>
}
