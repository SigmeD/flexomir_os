import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { FosGlassMaterial } from './fos-glass-material'
import { Track, spring, type Stop } from './glass-motion'
import './fos-popup-surface.css'

export interface FosPopupSurfaceProps extends ComponentProps<'div'> {
  'data-state'?: 'open' | 'closed'
  /** Layout wrapper stays separate from Radix/menu semantics and surface positioning. */
  contentClassName?: string
  /** Drawer navigation already owns its selected-row lens through SidebarNav. */
  hoverLens?: boolean
  /** Opt-in pilot; legacy consumers (including excluded Order More) are untouched. */
  sidebarMaterial?: boolean
}

type LensTarget = { x: number; y: number; width: number; height: number }
type LensAxis = keyof LensTarget

/** Shared FOS V2 surface and one travelling hover/focus lens for popup actions. */
export const FosPopupSurface = forwardRef<HTMLDivElement, FosPopupSurfaceProps>(function FosPopupSurface({
  children, className, contentClassName, hoverLens = true, sidebarMaterial = false,
  onPointerMove, onPointerLeave, onFocusCapture, onBlurCapture, ...props
}, ref) {
  const surfaceRef = useRef<HTMLDivElement | null>(null)
  const lensRef = useRef<HTMLDivElement | null>(null)
  const activeItemRef = useRef<HTMLElement | null>(null)
  const initializedRef = useRef(false)
  const movingRef = useRef<Record<LensAxis, boolean>>({ x: false, y: false, width: false, height: false })
  const targetRef = useRef<LensTarget>({ x: 0, y: 0, width: 1, height: 1 })
  const tracks = useMemo(() => ({
    x: new Track(0), y: new Track(0), width: new Track(1), height: new Track(1),
  }), [])
  const stopsRef = useRef<Record<LensAxis, Stop>>({ x: () => {}, y: () => {}, width: () => {}, height: () => {} })
  useImperativeHandle(ref, () => surfaceRef.current!, [])

  useEffect(() => {
    const draw = () => {
      const lens = lensRef.current
      if (!lens) return
      lens.style.transform = `translate3d(${tracks.x.get().toFixed(2)}px,${tracks.y.get().toFixed(2)}px,0)`
      lens.style.width = `${Math.max(1, tracks.width.get()).toFixed(2)}px`
      lens.style.height = `${Math.max(1, tracks.height.get()).toFixed(2)}px`
    }
    const unwatch = (Object.keys(tracks) as LensAxis[]).map(axis => tracks[axis].watch(draw))
    draw()
    return () => {
      unwatch.forEach(stop => stop())
      Object.values(stopsRef.current).forEach(stop => stop())
    }
  }, [tracks])

  const itemFrom = (target: EventTarget | null) => {
    const surface = surfaceRef.current
    if (!hoverLens || !surface || !(target instanceof Element)) return null
    const item = target.closest<HTMLElement>(
      '[role="menuitem"]:not([data-disabled]):not([disabled]), [role="option"]:not([data-disabled]):not([disabled])',
    )
    return item && surface.contains(item) ? item : null
  }

  const moveLensTo = (item: HTMLElement | null) => {
    const surface = surfaceRef.current
    const lens = lensRef.current
    if (!surface || !lens) return
    if (!item) {
      activeItemRef.current?.removeAttribute('data-lens-active')
      activeItemRef.current = null
      lens.style.opacity = '0'
      return
    }
    if (item === activeItemRef.current) return
    activeItemRef.current?.removeAttribute('data-lens-active')
    activeItemRef.current = item
    item.setAttribute('data-lens-active', 'true')
    const surfaceBox = surface.getBoundingClientRect()
    const itemBox = item.getBoundingClientRect()
    targetRef.current = {
      x: itemBox.left - surfaceBox.left,
      y: itemBox.top - surfaceBox.top,
      width: itemBox.width,
      height: itemBox.height,
    }
    lens.style.opacity = '1'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || window.matchMedia('(forced-colors: active)').matches
    const axes = Object.keys(tracks) as LensAxis[]
    if (!initializedRef.current || reduced) {
      initializedRef.current = true
      axes.forEach(axis => {
        stopsRef.current[axis]()
        movingRef.current[axis] = false
        tracks[axis].snap(targetRef.current[axis])
      })
      return
    }
    axes.forEach(axis => {
      if (movingRef.current[axis]) return
      if (Math.abs(tracks[axis].get() - targetRef.current[axis]) < .025) {
        tracks[axis].snap(targetRef.current[axis])
        return
      }
      movingRef.current[axis] = true
      stopsRef.current[axis] = spring(tracks[axis], () => targetRef.current[axis], {
        tension: 265,
        friction: 2 * Math.sqrt(265) * .93,
        epsilon: .025,
        onRest: () => {
          movingRef.current[axis] = false
          tracks[axis].snap(targetRef.current[axis])
        },
      })
    })
  }

  return (
    <div
      {...props}
      inert={props['data-state'] === 'closed' ? true : props.inert}
      ref={node => {
        surfaceRef.current = node
      }}
      className={cn('fos-popup-surface', className)}
      data-fos-popup-surface=""
      data-hover-lens={hoverLens}
      data-sidebar-material={sidebarMaterial || undefined}
      onPointerMove={event => {
        onPointerMove?.(event)
        const item = itemFrom(event.target)
        if (item) moveLensTo(item)
      }}
      onPointerLeave={event => {
        onPointerLeave?.(event)
        moveLensTo(itemFrom(document.activeElement))
      }}
      onFocusCapture={event => {
        onFocusCapture?.(event)
        moveLensTo(itemFrom(event.target))
      }}
      onBlurCapture={event => {
        onBlurCapture?.(event)
        const nextItem = itemFrom(event.relatedTarget)
        if (nextItem) moveLensTo(nextItem)
        else {
          const nextNode = event.relatedTarget instanceof Node ? event.relatedTarget : null
          if (!surfaceRef.current?.contains(nextNode)) moveLensTo(null)
        }
      }}
    >
      {sidebarMaterial && <FosGlassMaterial aria-hidden="true" className="fos-popup-surface__shell"
        radius={20} strength={.1} blur={20} tone="neutral" lighting="sidebar" shadow="reference"
        centerOpacity={0} centerColor="255 255 255" rimWidth={12} />}
      {hoverLens && <div ref={lensRef} className="fos-popup-surface__lens" data-testid="popup-hover-lens" aria-hidden="true">
        <FosGlassMaterial
          className="fos-popup-surface__lens-material"
          radius={12}
          strength={0.1}
          blur={1.5}
          tone="neutral"
          lighting="sidebar"
          shadow="reference"
          centerOpacity={0.12}
          centerColor="248 248 248"
          rimWidth={12}
        />
      </div>}
      <div className={cn('fos-popup-surface__content', contentClassName)}>{children}</div>
    </div>
  )
})
