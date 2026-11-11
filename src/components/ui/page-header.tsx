import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import './page-header.css'

export interface Breadcrumb { label: string; onSelect?: () => void; disabled?: boolean }
/** Desktop breadcrumbs 2330:2346. Compact navigation is supplied by the approved shell. */
export function Breadcrumbs({ items }: { items: readonly Breadcrumb[] }) {
  return <nav className="fos-breadcrumbs" aria-label="Хлебные крошки"><ol>{items.map((item, index) => <li key={index}>{item.onSelect ? <FosButtonRoot family="navigation" type="button" disabled={item.disabled} onClick={item.onSelect}>{item.label}</FosButtonRoot> : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}</li>)}</ol></nav>
}
/** V3 2302:2138: 48px first-title line aligns with icons, desktop caption extends below. */
export function PageHeader({ title, subtitle, context, actions, breadcrumbs, autoFocus = false, floatingWorkActions = false, subtitlePlacement, subtitleRole = 'secondary' }: { title: string; subtitle?: ReactNode; context?: ReactNode; actions?: ReactNode; breadcrumbs?: readonly Breadcrumb[]; autoFocus?: boolean; floatingWorkActions?: boolean; subtitlePlacement?: 'below-row' | 'below-title'; subtitleRole?: 'secondary' | 'status' }) {
  const placement = subtitlePlacement ?? (subtitleRole === 'status' ? 'below-title' : 'below-row')
  const heading = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => { if (autoFocus) heading.current?.focus({ preventScroll: true }) }, [autoFocus, title])
  const headingNode = <h1 ref={heading} tabIndex={-1}>{title}</h1>
  const supportingText = <>{subtitle && <p className={['fos-page-header__subtitle', subtitleRole === 'status' && 'fos-page-header__subtitle--status'].filter(Boolean).join(' ')}>{subtitle}</p>}{context && <p className="fos-page-header__context">{context}</p>}</>
  return <header className="fos-page-header">
    {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
    <div className="fos-page-header__row">{placement === 'below-title' ? <div className="fos-page-header__text">{headingNode}{supportingText}</div> : headingNode}{actions && <div className={['fos-page-header__actions', floatingWorkActions && 'fos-page-header__actions--floating'].filter(Boolean).join(' ')} data-testid={floatingWorkActions ? 'floating-work-actions' : undefined}>{actions}</div>}</div>
    {placement === 'below-row' && supportingText}
  </header>
}
