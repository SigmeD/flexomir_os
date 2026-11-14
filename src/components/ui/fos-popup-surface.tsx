import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { FosMaterialSurface } from './fos-material-surface'
import './fos-popup-surface.css'

/** Internal skin only; consumers use FosPopup so Surface cannot omit the shared Rows. */
export interface FosPopupSurfaceProps extends ComponentProps<'div'> {
  'data-state'?: 'open' | 'closed'
  contentClassName?: string
}
export const FosPopupSurface = forwardRef<HTMLDivElement, FosPopupSurfaceProps>(function FosPopupSurface({
  children, className, contentClassName, ...props
}, ref) {
  return <div {...props} ref={ref} inert={props['data-state'] === 'closed' ? true : props.inert}
    className={cn('fos-popup-surface', className)} data-fos-popup-surface="" data-hover-lens={false} data-sidebar-material="true">
    <FosMaterialSurface aria-hidden="true" className="fos-popup-surface__shell" variant="popup" />
    <div className={cn('fos-popup-surface__content', contentClassName)}>{children}</div>
  </div>
})
