import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { FosGlassMaterial } from './fos-glass-material'
import { SidebarNavIcon, type SidebarNavIconName } from './sidebar-nav-icons'
import './sidebar-nav.css'

export interface SidebarNavItem {
  /** Stable route key supplied by the consuming screen, never inferred from text. */
  id: string
  label: string
  /** Optional reference-aligned icon. Omit to keep exact text-only Figma master. */
  icon?: SidebarNavIconName
  disabled?: boolean
}

export interface SidebarNavProps {
  /** Client and Manager supply distinct labels while sharing the same visual component. */
  items: readonly SidebarNavItem[]
  /** Active route is controlled by parent: hovering never moves the selected lens. */
  activeId: string
  /** Previous route when the containing screen shell changed; lets the one lens travel across shells. */
  motionFromId?: string | null
  /** Routing is the caller's responsibility; this component doesn't invent destinations. */
  onSelect: (id: string) => void
  ariaLabel: string
  /** Neutral is for FOS V2 grey surfaces. 'reference' is the historical
   * cool-tinted lab coat, retained for A/B review and future palettes. */
  glassTone?: 'neutral' | 'reference'
  /** Drawer-only preview: the existing single lens follows hover/focus, then returns to selection. */
  hoverLens?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Shared FOS V2 navigation body, not a responsive AppShell or mobile drawer.
 * CURRENT Figma: 240px desktop pane; 208x44px items, 4px gap.
 * One moving GlassLens below crisp DOM labels, reused from FosGlassMaterial.
 * The existing travel spring matches the approved Sidebar 2.2.5 C response.
 */
export function SidebarNav({
  items, activeId, motionFromId, onSelect, ariaLabel, glassTone = 'neutral', hoverLens = false, className = '', style,
}: SidebarNavProps) {
  const activeIndex = items.findIndex(item => item.id === activeId)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hoveredIndex = hoverLens && hoveredId ? items.findIndex(item => item.id === hoveredId) : -1
  const lensIndex = hoveredIndex >= 0 ? hoveredIndex : activeIndex
  // A deep-linked initial route should not animate from the top on first render.
  const initialIndexRef = useRef(Math.max(0, activeIndex))
  const motionFromIndex = items.findIndex(item => item.id === motionFromId)
  const anchor = motionFromIndex >= 0 ? motionFromIndex : initialIndexRef.current
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const iconRefs = useRef<Array<HTMLSpanElement | null>>([])
  const currentTravel = useRef(0)
  const lensIndexRef = useRef(lensIndex)
  lensIndexRef.current = lensIndex

  // Approved 2.2.5 C: only the selected label receives the +4.3% lens
  // magnification as the existing spring reaches it. One source of truth:
  // FosGlassMaterial reports its current travel instead of a second RAF.
  const syncLabelMagnification = useCallback((travelY: number) => {
    currentTravel.current = travelY
    for (let index = 0; index < labelRefs.current.length; index++) {
      const label = labelRefs.current[index]
      if (!label) continue
      const difference = Math.abs((index - anchor) * 48 - travelY)
      const proximity = index === lensIndexRef.current
        ? Math.max(0, Math.min(1, 1 - difference / 44))
        : 0
      label.style.setProperty('--fos-sidebar-label-scale', (1 + 0.043 * proximity).toFixed(5))
      // Icon follows the same selected lens: reference 2.2.5 C max +2.2%.
      iconRefs.current[index]?.style.setProperty(
        '--fos-sidebar-icon-scale', (1 + 0.022 * proximity).toFixed(5),
      )
    }
  }, [anchor])

  useLayoutEffect(() => {
    syncLabelMagnification(currentTravel.current)
  }, [activeIndex, lensIndex, items, syncLabelMagnification])

  return (
    <nav
      aria-label={ariaLabel}
      data-testid="shared-sidebar-nav"
      data-glass-tone={glassTone}
      className={['fos-sidebar-nav', className].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="fos-sidebar-nav__list">
        {activeIndex >= 0 && (
          <FosGlassMaterial
            key={anchor + ':' + activeId}
            aria-hidden="true"
            data-testid="sidebar-selected-lens"
            className="fos-sidebar-nav__lens"
            style={{ top: anchor * 48 }}
            radius={14}
            blur={1.5}
            strength={0.1}
            shadow="reference"
            lighting="sidebar"
            tone={glassTone}
            centerOpacity={glassTone === 'neutral' ? 0.12 : 0.16}
            centerColor={glassTone === 'neutral'
              ? 'var(--fos-neutral-glass-rgb, 248 248 248)'
              : '220 240 247'}
            rimWidth={12}
            motion="travel"
            travelY={(lensIndex - anchor) * 48}
            onTravelFrame={syncLabelMagnification}
          />
        )}
        {items.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className="fos-sidebar-nav__item"
            data-testid={'sidebar-nav-' + item.id}
            aria-current={item.id === activeId ? 'page' : undefined}
            disabled={item.disabled}
            onPointerEnter={() => {
              if (hoverLens && !item.disabled) setHoveredId(item.id)
            }}
            onPointerLeave={event => {
              if (hoverLens && !event.currentTarget.contains(document.activeElement)) setHoveredId(null)
            }}
            onFocus={() => {
              if (hoverLens && !item.disabled) setHoveredId(item.id)
            }}
            onBlur={event => {
              const nextItem = event.relatedTarget instanceof Element
                ? event.relatedTarget.closest('.fos-sidebar-nav__item')
                : null
              if (hoverLens && !nextItem) setHoveredId(null)
            }}
            onClick={() => {
              if (!item.disabled && item.id !== activeId) {
                setHoveredId(null)
                onSelect(item.id)
              }
            }}
          >
            {item.icon && (
              <span
                className="fos-sidebar-nav__icon"
                ref={node => { iconRefs.current[index] = node }}
              ><SidebarNavIcon name={item.icon} /></span>
            )}
            <span
              className="fos-sidebar-nav__label"
              ref={node => { labelRefs.current[index] = node }}
            >{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
