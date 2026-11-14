import type { ComponentProps } from 'react'
import './fos-section-heading.css'

/** Shared order-section heading; layout and actions remain with each section. */
export function FosSectionHeading({ className = '', ...props }: ComponentProps<'h2'>) {
  return <h2 {...props} className={['fos-section-heading', className].filter(Boolean).join(' ')} />
}
