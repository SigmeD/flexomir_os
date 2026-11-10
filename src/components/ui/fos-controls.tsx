import { useId, useRef, type ComponentProps, type ReactNode } from 'react'
import chevron from '@/assets/orders/chevron.svg'
import { FosGlassMaterial } from './fos-glass-material'
import { useDirectionalPress } from './use-directional-press'
import { FOSSelectPopup, type FOSSelectPopupProps } from './fos-select-popup'
import './fos-controls.css'

interface FieldOptions { label: string; error?: string; helper?: string; wrapperClassName?: string }
function Field({ label, error, helper, id, className = '', children }: FieldOptions & { id: string; className?: string; children: ReactNode }) {
  return <div className={['fos-field', className].join(' ')} data-state={error ? 'error' : undefined}>
    <label className="fos-field__label" htmlFor={id}>{label}</label>{children}
    {(error || helper) && <p id={id + '-message'} className={error ? 'fos-field__error' : 'fos-field__helper'}>{error || helper}</p>}
  </div>
}
/** Input 634:402; all consumers share error/focus/readonly geometry. */
export function FOSInput({ label, error, helper, wrapperClassName, id: suppliedId, className = '', ...props }: ComponentProps<'input'> & FieldOptions) {
  const generatedId = useId(), id = suppliedId || generatedId
  return <Field {...{ label, error, helper, id }} className={wrapperClassName}>
    <input {...props} id={id} className={'fos-field__control ' + className} aria-invalid={error ? true : undefined} aria-describedby={[props['aria-describedby'], (error || helper) && id + '-message'].filter(Boolean).join(' ') || undefined} />
  </Field>
}
/** Quantity 680:177 has no production unit until the contract is agreed. */
export function FOSQuantity(props: ComponentProps<'input'> & FieldOptions) { return <FOSInput type="number" inputMode="numeric" step="1" placeholder="Введите количество" {...props} /> }
/** Date 1169:437; native picker, shared field states; no business date policy here. */
export function FOSDateField(props: ComponentProps<'input'> & FieldOptions) { return <FOSInput type="date" {...props} /> }
/** Textarea 634:418 / Order Note 681:203. */
export function FOSTextarea({ label, error, helper, wrapperClassName, id: suppliedId, className = '', ...props }: ComponentProps<'textarea'> & FieldOptions) {
  const generatedId = useId(), id = suppliedId || generatedId
  return <Field {...{ label, error, helper, id }} className={wrapperClassName}>
    <textarea {...props} id={id} className={'fos-field__control fos-field__control--note ' + className} aria-invalid={error ? true : undefined} aria-describedby={[props['aria-describedby'], (error || helper) && id + '-message'].filter(Boolean).join(' ') || undefined} />
  </Field>
}
/** Select Field 1148:311, intentionally separate from optical GlassSelect. */
export function FOSSelect({ label, error, helper, wrapperClassName, id: suppliedId, className = '', children, ...props }: ComponentProps<'select'> & FieldOptions) {
  const generatedId = useId(), id = suppliedId || generatedId
  return <Field {...{ label, error, helper, id }} className={wrapperClassName}>
    <div className="fos-field__select"><select {...props} id={id} data-empty={props.value === '' || undefined} className={'fos-field__control ' + className} aria-invalid={error ? true : undefined} aria-describedby={(error || helper) ? id + '-message' : props['aria-describedby']}>{children}</select><span className="fos-field__select-arrow" aria-hidden="true"><img src={chevron} alt="" /></span></div>
  </Field>
}
/** Narrow single-select pilot contract; focus/key events belong to the visible trigger. */
export function FOSGlassSelect({ label, error, helper, wrapperClassName, id: suppliedId, className = '', children, ...props }: Omit<FOSSelectPopupProps, 'id' | 'label'> & FieldOptions & { id?: string }) {
  const generatedId = useId(), id = suppliedId || generatedId
  return <Field {...{ label, error, helper, id }} className={wrapperClassName}>
    <div className="fos-field__select"><FOSSelectPopup {...props} {...{ id, label }} className={className} aria-invalid={error ? true : undefined}
      aria-describedby={[props['aria-describedby'], (error || helper) && id + '-message'].filter(Boolean).join(' ') || undefined}>{children}</FOSSelectPopup>
      <span className="fos-field__select-arrow" aria-hidden="true"><img src={chevron} alt="" /></span></div>
  </Field>
}
/** One FOS V2 Action family: hierarchy changes treatment, while the shared Glass material and press response stay common. */
export function FOSAction({ hierarchy = 'secondary', size = 'standard', className = '', type = 'button', disabled = false, children, ...props }: ComponentProps<'button'> & { hierarchy?: 'primary' | 'secondary' | 'tertiary'; size?: 'standard' | 'compact' }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const motionRef = useRef<HTMLSpanElement>(null)
  const press = useDirectionalPress(buttonRef, motionRef, disabled, 'fos-action')
  const {
    onPointerDown, onPointerUp, onPointerCancel, onLostPointerCapture,
    onKeyDown, onKeyUp, onBlur, ...buttonProps
  } = props

  return <button {...buttonProps} ref={buttonRef} type={type} disabled={disabled}
    data-pressed="false" data-hierarchy={hierarchy}
    className={['fos-action', 'fos-action--' + hierarchy, size === 'compact' && 'fos-action--compact', className].filter(Boolean).join(' ')}
    onPointerDown={event => { press.onPointerDown(event); onPointerDown?.(event) }}
    onPointerUp={event => { press.onPointerUp(event); onPointerUp?.(event) }}
    onPointerCancel={event => { press.onPointerCancel(event); onPointerCancel?.(event) }}
    onLostPointerCapture={event => { press.onLostPointerCapture(); onLostPointerCapture?.(event) }}
    onKeyDown={event => { press.onKeyDown(event); onKeyDown?.(event) }}
    onKeyUp={event => { press.onKeyUp(event); onKeyUp?.(event) }}
    onBlur={event => { press.onBlur(); onBlur?.(event) }}>
    {hierarchy === 'secondary' && <FosGlassMaterial aria-hidden="true" className="fos-action__glass"
      strength={0.1} radius={22} blur={1.5} lighting="sidebar" tone="neutral"
      shadow="none" centerOpacity="var(--fos-action-tint, .24)" centerColor="240 248 255" rimWidth={1} />}
    <span ref={motionRef} className="fos-action__motion"><span className="fos-action__content">{children}</span></span>
  </button>
}
