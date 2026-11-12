import { useId } from 'react'
import './printing-method.css'

/** Segmented 943:263; Printing 2315:9747. One layout for all six Figma variants. */
export function PrintingMethodControl({ value, onChange, disabled = false, error }: { value: '' | 'flex' | 'digit'; onChange: (value: 'flex' | 'digit') => void; disabled?: boolean; error?: string }) {
  const group = useId()
  return <fieldset className="fos-printing" disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={error ? group + '-error' : undefined}><legend>Способ печати *</legend><div className="fos-segmented">{(['flex', 'digit'] as const).map(method => <label key={method} className="fos-segmented__option"><input type="radio" name={group} value={method} checked={value === method} onChange={() => onChange(method)} /><span>{method === 'flex' ? 'Флексопечать' : 'Цифровая печать'}</span></label>)}</div>{error && <p id={group + '-error'} className="fos-field__error">{error}</p>}</fieldset>
}
