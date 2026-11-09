import { useLayoutEffect, useRef, type ReactNode } from 'react'
import './page-header.css'

export interface Breadcrumb { label: string; onSelect?: () => void; disabled?: boolean }
/** Desktop breadcrumbs 2330:2346. Compact navigation is supplied by the approved shell. */
export function Breadcrumbs({ items }: { items: readonly Breadcrumb[] }) {
  return <nav className="fos-breadcrumbs" aria-label="Хлебные крошки"><ol>{items.map((item, index) => <li key={index}>{item.onSelect ? <button type="button" disabled={item.disabled} onClick={item.onSelect}>{item.label}</button> : <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>}</li>)}</ol></nav>
}
/** V3 2302:2138: 48px first-title line aligns with icons, desktop caption extends below. */
export function PageHeader({ title, subtitle, context, actions, breadcrumbs, autoFocus = false, floatingWorkActions = false }: { title: string; subtitle?: ReactNode; context?: ReactNode; actions?: ReactNode; breadcrumbs?: readonly Breadcrumb[]; autoFocus?: boolean; floatingWorkActions?: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => { if (autoFocus) heading.current?.focus({ preventScroll: true }) }, [autoFocus, title])
  return <header className="fos-page-header">
    {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
    <div className="fos-page-header__row"><h1 ref={heading} tabIndex={-1}>{title}</h1>{actions && <div className={['fos-page-header__actions', floatingWorkActions && 'fos-page-header__actions--floating'].filter(Boolean).join(' ')} data-testid={floatingWorkActions ? 'floating-work-actions' : undefined}>{actions}</div>}</div>
    {subtitle && <p className="fos-page-header__subtitle">{subtitle}</p>}{context && <p className="fos-page-header__context">{context}</p>}
  </header>
}
