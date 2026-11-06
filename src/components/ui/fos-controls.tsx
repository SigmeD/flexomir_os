import { useId, type ComponentProps, type ReactNode } from 'react'
import chevron from '@/assets/orders/chevron.svg'
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
/** Action 835:259; secondary is outline, not a Glass primary. */
export function FOSAction({ hierarchy = 'secondary', className = '', type = 'button', ...props }: ComponentProps<'button'> & { hierarchy?: 'primary' | 'secondary' | 'tertiary' }) {
  return <button {...props} type={type} className={'fos-action fos-action--' + hierarchy + ' ' + className} />
}
