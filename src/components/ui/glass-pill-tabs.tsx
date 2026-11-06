import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type KeyboardEvent, type PointerEvent,
} from 'react'
import { FosGlassMaterial } from './fos-glass-material'
import { Track, spring, type Stop } from './glass-motion'
import './glass-pill-tabs.css'

export interface GlassPillFilter {
  /** Stable UI filter key; not a 1C status code. */
  id: string
  label: string
  disabled?: boolean
}

export interface GlassPillTabsProps {
  items: readonly GlassPillFilter[]
  value: string
  onValueChange: (id: string) => void
  ariaLabel: string
  className?: string
  style?: CSSProperties
  glassTone?: 'neutral' | 'reference'
}

/**
 * GL-03: one accepted FosGlassMaterial, horizontally animated using
 * the SAME shared glass-motion Track/spring engine. Filter-button semantics
 * (not a tablist with nonexistent panels). No API/status mapping.
 */
export function GlassPillTabs({
  items, value, onValueChange, ariaLabel, className = '', style, glassTone = 'neutral',
}: GlassPillTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lensFrameRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const activeRef = useRef(value)
  const initializedRef = useRef(false)
  const reducedRef = useRef(false)
  const targetRef = useRef({ x: 0, width: 1 })
  const movingRef = useRef({ x: false, width: false })
  const stopRef = useRef<{ x: Stop; width: Stop }>({ x: () => {}, width: () => {} })
  const tracks = useMemo(() => ({ x: new Track(0), width: new Track(1) }), [])
  const [focusId, setFocusId] = useState(value)
  const pointerRef = useRef<{ x: number; y: number; moved: boolean } | null>(null)

  const draw = useCallback(() => {
    const lens = lensFrameRef.current
    if (!lens) return
    const x = tracks.x.get()
    const width = Math.max(1, tracks.width.get())
    lens.style.transform = 'translate3d(' + x.toFixed(3) + 'px,0,0)'
    lens.style.width = width.toFixed(3) + 'px'
    lens.dataset.motionState = reducedRef.current
      ? 'off'
      : movingRef.current.x || movingRef.current.width ? 'moving' : 'settled'
    const center = x + width / 2
    for (const [id, button] of buttonsRef.current) {
      const label = button.querySelector<HTMLElement>('.fos-glass-pill-tabs__label')
      if (!label) continue
      const delta = Math.abs(center - (button.offsetLeft + button.offsetWidth / 2))
      const closeness = id === activeRef.current
        ? Math.max(0, Math.min(1, 1 - delta / Math.max(44, button.offsetWidth)))
        : 0
      label.style.setProperty('--fos-pill-label-scale',
        reducedRef.current ? '1' : (1 + 0.043 * closeness).toFixed(5))
    }
  }, [tracks])

  const retarget = useCallback(() => {
    const current = buttonsRef.current.get(activeRef.current)
    if (!current) {
      if (lensFrameRef.current) lensFrameRef.current.hidden = true
      return
    }
    if (lensFrameRef.current) lensFrameRef.current.hidden = false
    targetRef.current = { x: current.offsetLeft, width: current.offsetWidth }
    const prefersReduced = typeof window !== 'undefined' && (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(forced-colors: active)').matches
    )
    reducedRef.current = prefersReduced
    if (!initializedRef.current || prefersReduced) {
      initializedRef.current = true
      stopRef.current.x()
      stopRef.current.width()
      movingRef.current = { x: false, width: false }
      tracks.x.snap(targetRef.current.x)
      tracks.width.snap(targetRef.current.width)
      draw()
      return
    }
    const animate = (key: 'x' | 'width') => {
      if (movingRef.current[key]) return // a running spring chases the live target
      if (Math.abs(tracks[key].get() - targetRef.current[key]) < .025) {
        tracks[key].snap(targetRef.current[key])
        return
      }
      movingRef.current[key] = true
      stopRef.current[key] = spring(tracks[key], () => targetRef.current[key], {
        tension: 265, friction: 2 * Math.sqrt(265) * .93, epsilon: .025,
        onRest: () => {
          movingRef.current[key] = false
          tracks[key].snap(targetRef.current[key])
          draw()
        },
      })
    }
    animate('x')
    animate('width')
    draw()
  }, [draw, tracks])

  useLayoutEffect(() => {
    activeRef.current = value
    const offX = tracks.x.watch(draw)
    const offWidth = tracks.width.watch(draw)
    return () => { offX(); offWidth() }
  }, [draw, tracks, value])

  useLayoutEffect(() => {
    activeRef.current = value
    retarget()
    const observer = new ResizeObserver(retarget)
    if (trackRef.current) observer.observe(trackRef.current)
    for (const button of buttonsRef.current.values()) observer.observe(button)
    return () => observer.disconnect()
  }, [items, value, retarget])

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqForced = window.matchMedia('(forced-colors: active)')
    const handle = () => retarget()
    mqReduced.addEventListener('change', handle)
    mqForced.addEventListener('change', handle)
    return () => {
      mqReduced.removeEventListener('change', handle)
      mqForced.removeEventListener('change', handle)
    }
  }, [retarget])

  useEffect(() => () => { stopRef.current.x(); stopRef.current.width() }, [])

  useEffect(() => {
    if (!items.some(item => item.id === focusId && !item.disabled)) setFocusId(value)
  }, [items, focusId, value])

  const reveal = useCallback((id: string) => {
    const container = scrollRef.current
    const button = buttonsRef.current.get(id)
    if (!container || !button) return
    const pad = 14
    const left = button.offsetLeft, right = left + button.offsetWidth
    let next = container.scrollLeft
    if (left < next + pad) next = Math.max(0, left - pad)
    else if (right > next + container.clientWidth - pad) {
      next = right - container.clientWidth + pad
    } else return
    container.scrollTo({ left: next, behavior: reducedRef.current ? 'instant' : 'smooth' })
  }, [])

  useEffect(() => {
    reveal(value)
    setFocusId(value)
  }, [value, reveal])

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    const enabled = items.filter(item => !item.disabled)
    if (!enabled.length) return
    event.preventDefault()
    const index = enabled.findIndex(item => item.id === id)
    let next = index
    if (event.key === 'ArrowRight') next = Math.min(enabled.length - 1, index + 1)
    if (event.key === 'ArrowLeft') next = Math.max(0, index - 1)
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = enabled.length - 1
    const nextId = enabled[Math.max(0, next)].id
    setFocusId(nextId)
    buttonsRef.current.get(nextId)?.focus({ preventScroll: true })
    reveal(nextId)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') pointerRef.current = {
      x: event.clientX, y: event.clientY, moved: false,
    }
    else pointerRef.current = null
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current && Math.abs(event.clientX - pointerRef.current.x) > 9 &&
      Math.abs(event.clientX - pointerRef.current.x) > Math.abs(event.clientY - pointerRef.current.y)) {
      pointerRef.current.moved = true
    }
  }

  return (
    <div
      className={['fos-glass-pill-tabs', className].filter(Boolean).join(' ')}
      style={style}
      data-testid="glass-pill-tabs"
    >
      <div
        ref={scrollRef}
        className="fos-glass-pill-tabs__scroll"
        data-testid="glass-pill-scroll"
        onPointerDownCapture={onPointerDown}
        onPointerMoveCapture={onPointerMove}
        onClickCapture={event => {
          if (pointerRef.current?.moved) {
            event.preventDefault()
            event.stopPropagation()
            pointerRef.current = null
          }
        }}
      >
        <div ref={trackRef} role="group" aria-label={ariaLabel}
          className="fos-glass-pill-tabs__track">
          <div className="fos-glass-pill-tabs__lens-frame"
            ref={lensFrameRef}
            data-testid="glass-pill-lens-frame"
            data-motion-state="settled"
            data-target-id={value}
            aria-hidden="true"
            hidden={!items.some(item => item.id === value)}>
            <FosGlassMaterial
              className="fos-glass-pill-tabs__lens"
              data-testid="glass-pill-lens"
              aria-hidden="true"
              radius={19}
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
            />
          </div>
          {items.map(item => (
            <button
              type="button"
              key={item.id}
              ref={node => {
                if (node) buttonsRef.current.set(item.id, node)
                else buttonsRef.current.delete(item.id)
              }}
              data-testid={'glass-pill-' + item.id}
              className="fos-glass-pill-tabs__button"
              aria-pressed={item.id === value}
              tabIndex={item.id === focusId ? 0 : -1}
              disabled={item.disabled}
              onKeyDown={event => handleKey(event, item.id)}
              onClick={() => {
                if (!item.disabled && item.id !== value) onValueChange(item.id)
              }}
            ><span className="fos-glass-pill-tabs__label">{item.label}</span></button>
          ))}
        </div>
      </div>
    </div>
  )
}
