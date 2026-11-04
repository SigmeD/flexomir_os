import { useRef, type CSSProperties } from 'react'
import { FosGlassMaterial } from './fos-glass-material'
import './sidebar-nav.css'

export interface SidebarNavItem {
  /** Stable route key supplied by the consuming screen, never inferred from text. */
  id: string
  label: string
  disabled?: boolean
}

export interface SidebarNavProps {
  /** Client and Manager supply distinct labels while sharing the same visual component. */
  items: readonly SidebarNavItem[]
  /** Active route is controlled by parent: hovering never moves the selected lens. */
  activeId: string
  /** Routing is the caller's responsibility; this component doesn't invent destinations. */
  onSelect: (id: string) => void
  ariaLabel: string
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
  items, activeId, onSelect, ariaLabel, className = '', style,
}: SidebarNavProps) {
  const activeIndex = items.findIndex(item => item.id === activeId)
  // A deep-linked initial route should not animate from the top on first render.
  const initialIndexRef = useRef(Math.max(0, activeIndex))
  const anchor = initialIndexRef.current

  return (
    <nav
      aria-label={ariaLabel}
      data-testid="shared-sidebar-nav"
      className={['fos-sidebar-nav', className].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="fos-sidebar-nav__list">
        {activeIndex >= 0 && (
          <FosGlassMaterial
            aria-hidden="true"
            data-testid="sidebar-selected-lens"
            className="fos-sidebar-nav__lens"
            style={{ top: anchor * 48 }}
            radius={14}
            blur={1.5}
            strength={0.1}
            shadow="reference"
            lighting="sidebar"
            centerOpacity={0.16}
            centerColor="220 240 247"
            rimWidth={12}
            motion="travel"
            travelY={(activeIndex - anchor) * 48}
          />
        )}
        {items.map(item => (
          <button
            type="button"
            key={item.id}
            className="fos-sidebar-nav__item"
            data-testid={'sidebar-nav-' + item.id}
            aria-current={item.id === activeId ? 'page' : undefined}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled && item.id !== activeId) onSelect(item.id)
            }}
          >
            <span className="fos-sidebar-nav__label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
