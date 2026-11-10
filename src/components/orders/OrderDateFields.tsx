import type { ReactNode } from 'react'
import './order-date-fields.css'

/** Date masters 1169:383/433; shared responsive placement for edit and readonly views. */
export function OrderDateFields({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={['fos-order-date-fields', className].filter(Boolean).join(' ')}>{children}</div>
}
