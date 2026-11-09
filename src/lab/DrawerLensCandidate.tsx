import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { FosGlassMaterial } from '@/components/ui/fos-glass-material'
import { SidebarNavIcon } from '@/components/ui/sidebar-nav-icons'
import type { NavigationDrawerProps } from '@/components/ui/navigation-drawer'
import '@/components/ui/fos-popup-rows.css'

/** FE-11 candidate v0.2, LAB ONLY / OWNER OPEN.
 * No spring/Track implementation here: the existing material owns travel.
 * Only actual vertical coverage of untransformed label/icon slots drives scale.
 */
export function DrawerLensCandidate({ items, activeId, onSelect }:
  Pick<NavigationDrawerProps, 'items' | 'activeId' | 'onSelect'>) {
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
      const rows = Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[data-popup-item]') ?? [])
      const selected = rows.find(row => row.dataset.popupItem === activeId && !row.disabled)
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
  }, [activeId, items, frame])
  return <div ref={list} className="fos-popup-rows fos-sidebar-nav__list" data-motion-candidate="fe11-v0.2-owner-open">
    {geometry && <FosGlassMaterial aria-hidden="true" data-testid="sidebar-selected-lens"
      className="fos-popup-rows__lens" style={{ top: geometry.anchor, height: geometry.height }}
      radius={14} blur={1.5} strength={.1} shadow="reference" lighting="sidebar"
      tone="neutral" centerOpacity={.12} centerColor="var(--fos-neutral-glass-rgb, 248 248 248)"
      rimWidth={12} motion="travel" travelY={geometry.top - geometry.anchor} onTravelFrame={frame} />}
    {items.map(item => <button key={item.id} type="button" className="fos-sidebar-nav__item"
      data-popup-item={item.id} data-testid={'sidebar-nav-' + item.id}
      aria-current={activeId === item.id ? 'page' : undefined} disabled={item.disabled}
      onClick={() => onSelect(item.id)}>
      {item.icon && <span className="fos-sidebar-nav__icon" data-popup-icon=""><SidebarNavIcon name={item.icon} /></span>}
      <span className="fos-sidebar-nav__label" data-popup-label="">{item.label}</span>
    </button>)}
  </div>
}
