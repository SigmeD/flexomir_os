import { createContext, useContext } from 'react'
import { Day, type DayProps } from 'react-day-picker'
import { FosMaterialSurface } from './fos-material-surface'
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
    {active && <FosMaterialSurface aria-hidden="true" data-date-lens="" className="fos-date-picker__day-lens" variant="date-cell" />}
    {children}
  </Day>
}
