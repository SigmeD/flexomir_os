import { useCallback, useLayoutEffect, useRef, useState, type ComponentProps } from 'react'
import { FosGlassMaterial } from './fos-glass-material'
import './fos-popup-rows.css'

/** FE11-v0.2 OWNER APPROVED / FROZEN; reference commit f527bcb.
 * Adapter shell around the approved coverage controller. Never change its
 * physics, material or scale formula without separate Owner approval.
 * Adapters supply selectedId and semantic rows/slots, and own commit/dismissal.
 */
export function FosPopupRows({ selectedId: activeId, lensTestId = 'popup-selected-lens', children, className = '', ...props }:
  ComponentProps<'div'> & { selectedId?: string; lensTestId?: string }) {
  const list = useRef<HTMLDivElement>(null)
  const anchor = useRef<number | null>(null)
  const lastTravel = useRef(0)
  const slots = useRef<Array<{ element: HTMLElement; top: number; height: number; max: number; variable: string }>>([])
  const [geometry, setGeometry] = useState<{ top: number; height: number; anchor: number } | null>(null)
  const geometryRef = useRef(geometry)
  const frame = useCallback((travel: number) => {
    lastTravel.current = travel
    const current = geometryRef.current
    if (!current) return
    const top = current.anchor + travel, bottom = top + current.height
    for (const slot of slots.current) {
      const coverage = Math.max(0, Math.min(bottom, slot.top + slot.height) - Math.max(top, slot.top)) / slot.height
      slot.element.style.setProperty(slot.variable, (1 + slot.max * coverage).toFixed(5))
    }
  }, [])
  useLayoutEffect(() => {
    const measure = () => {
      const rows = Array.from(list.current?.querySelectorAll<HTMLElement>('[data-popup-item]') ?? [])
      const selected = rows.find(row => row.dataset.popupItem === activeId && !row.matches(':disabled, [data-disabled], [aria-disabled="true"]'))
      slots.current = rows.flatMap(row => Array.from(row.querySelectorAll<HTMLElement>('[data-popup-label], [data-popup-icon]')).map(element => ({
        element, top: row.offsetTop + element.offsetTop, height: Math.max(1, element.offsetHeight),
        max: element.hasAttribute('data-popup-label') ? .043 : .022,
        variable: element.hasAttribute('data-popup-label') ? '--fos-sidebar-label-scale' : '--fos-sidebar-icon-scale',
      })))
      if (!selected) { setGeometry(null); geometryRef.current = null; return }
      anchor.current ??= selected.offsetTop
      const next = { top: selected.offsetTop, height: selected.offsetHeight, anchor: anchor.current }
      geometryRef.current = next
      frame(lastTravel.current)
      setGeometry(previous => previous?.top === next.top && previous.height === next.height ? previous : next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (list.current) observer.observe(list.current)
    list.current?.querySelectorAll('[data-popup-item], [data-popup-label]').forEach(row => observer.observe(row))
    return () => observer.disconnect()
  }, [activeId, children, frame])
  return <div {...props} ref={list} className={`fos-popup-rows ${className}`} data-motion-reference="FE11-v0.2">
    {geometry && <FosGlassMaterial aria-hidden="true" data-testid={lensTestId}
      className="fos-popup-rows__lens" style={{ top: geometry.anchor, height: geometry.height }}
      radius={14} blur={1.5} strength={.1} shadow="reference" lighting="sidebar"
      tone="neutral" centerOpacity={.12} centerColor="var(--fos-neutral-glass-rgb, 248 248 248)"
      rimWidth={12} motion="travel" travelY={geometry.top - geometry.anchor} onTravelFrame={frame} />}
    {children}
  </div>
}
