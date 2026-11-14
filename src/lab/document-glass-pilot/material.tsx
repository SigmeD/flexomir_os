import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { GlassLens, refractionSupported, useHydrated } from './glass'
import { Track, spring } from '@/components/ui/glass-motion'
import { cn } from '@/lib/utils'
import '@/components/ui/fos-glass-material.css'

export interface FosGlassMaterialProps extends Omit<ComponentProps<'div'>, 'children' | 'ref'> {
  children?: ReactNode
  contentClassName?: string
  strength?: number
  radius?: number
  blur?: number
  brightness?: number
  dome?: number
  lighting?: 'native' | 'sidebar'
  /** Color treatment only; same GlassLens, geometry, refraction and spring.
   *  reference = original cool lab coat; neutral = transparent achromatic surface coat.
   *  Other components keep the historic reference tone until explicitly opted in.
   */
  tone?: 'reference' | 'neutral'
  shadow?: 'native' | 'reference' | 'menu' | 'none'
  /** A numeric alpha or a theme expression, e.g. var(--menu-opacity). */
  centerOpacity?: number | string
  /** Space-separated RGB channels, or a CSS variable containing them. */
  centerColor?: string
  /** Pixels, or a CSS length from the common theme. */
  rimWidth?: number | string
  motion?: 'none' | 'travel'
  travelY?: number
  /** Optional observer for the existing spring's travel position. Consumers may use it for
   * label/micro-interactions without starting another animation driver. */
  onTravelFrame?: (y: number) => void
}

const reducedQuery = '(prefers-reduced-motion: reduce)'
const forcedQuery = '(forced-colors: active)'
function subscribeMedia(notify: () => void) {
  const lists = [matchMedia(reducedQuery), matchMedia(forcedQuery)]
  for (const list of lists) list.addEventListener('change', notify)
  return () => { for (const list of lists) list.removeEventListener('change', notify) }
}
const mediaSnapshot = () => `${matchMedia(reducedQuery).matches}:${matchMedia(forcedQuery).matches}`

/** One adapter of Website Glass; all displacement maps and SVG filters stay in the library. */
export function FosGlassMaterial({
  children, className, contentClassName, strength = 0.1, radius = 18, blur = 1.5, brightness = 1.05, dome = 0,
  lighting = 'sidebar', tone = 'reference', shadow = 'reference', centerOpacity = 0.16, centerColor = '220 240 247', rimWidth = 12,
  motion = 'none', travelY = 0, onTravelFrame,
  style, ...props
}: FosGlassMaterialProps) {
  const root = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })
  const hydrated = useHydrated()
  const preference = useSyncExternalStore(subscribeMedia, mediaSnapshot, () => 'false:false')
  const reduced = preference.startsWith('true:')
  const forced = preference.endsWith(':true')
  const tracks = useMemo(() => ({ y: new Track(0), tilt: new Track(0) }), [])
  const targetRef = useRef(0)
  const travelFrameRef = useRef(onTravelFrame)

  useLayoutEffect(() => {
    travelFrameRef.current = onTravelFrame
  }, [onTravelFrame])
  const retargetRef = useRef<(() => void) | null>(null)
  const s = Number.isFinite(strength) ? Math.min(1, Math.max(0, strength)) : 0.1
  const canRefract = hydrated && refractionSupported()
  const mode = forced ? 'high-contrast' : s === 0 ? 'neutral' : canRefract ? 'refraction' : 'frosted'

  useLayoutEffect(() => {
    targetRef.current = Number.isFinite(travelY) ? travelY : 0
    retargetRef.current?.()
  }, [travelY])

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => {
      const width = el.clientWidth, height = el.clientHeight
      setBox(previous => previous.width === width && previous.height === height ? previous : { width, height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const clamp = (value: number, a: number, b: number) => Math.min(b, Math.max(a, value))
    const draw = () => {
      const angle = reduced || forced ? 0 : tracks.tilt.get()
      const speed = reduced || forced ? 0 : tracks.y.velocity()
      el.style.setProperty('--fos-travel', `${tracks.y.get().toFixed(3)}px`)
      travelFrameRef.current?.(tracks.y.get())
      el.style.setProperty('--fos-tilt', `${angle.toFixed(3)}deg`)
      el.style.setProperty('--fos-scale', (1 + Math.min(.009, Math.abs(speed) * .000031)).toFixed(5))
      el.style.setProperty('--fos-light-y', `${clamp(28 + angle * 5, 12, 58).toFixed(1)}%`)
      el.style.setProperty('--fos-sweep-y', `${clamp(22 + angle * 7, 6, 75).toFixed(1)}%`)
      el.style.setProperty('--fos-shadow-y', `${clamp(4 + Math.abs(angle) * .25, 4, 5).toFixed(2)}px`)
    }
    const unwatchY = tracks.y.watch(draw), unwatchTilt = tracks.tilt.watch(draw)
    let stopY = () => {}, stopTilt = () => {}
    let travelRunning = false, tiltRunning = false
    const settled = () => { if (!travelRunning && !tiltRunning) el.dataset.motionState = 'settled' }
    const retarget = () => {
      const target = motion === 'travel' ? targetRef.current : 0
      if (reduced || forced || motion === 'none') {
        stopY(); stopTilt(); travelRunning = false; tiltRunning = false
        tracks.y.snap(target); tracks.tilt.snap(0)
        el.dataset.motionState = reduced || forced ? 'off' : 'settled'
        return
      }
      // Keep the running native driver: its live target preserves momentum.
      if (travelRunning) return
      if (tracks.y.get() === target) { settled(); return }
      el.dataset.motionState = 'moving'
      travelRunning = true
      stopY = spring(tracks.y, () => targetRef.current, {
        tension: 265, friction: 2 * Math.sqrt(265) * .93,
        onRest: () => { travelRunning = false; tracks.y.snap(targetRef.current); settled() },
      })
      if (!tiltRunning) {
        tiltRunning = true
        stopTilt = spring(tracks.tilt, () => clamp(-tracks.y.velocity() * .033, -3.6, 3.6), {
          tension: 190, friction: 27, canRest: () => !travelRunning,
          onRest: () => { tiltRunning = false; tracks.tilt.snap(0); settled() },
        })
      }
    }
    retargetRef.current = retarget
    retarget()
    travelFrameRef.current?.(tracks.y.get())
    return () => { retargetRef.current = null; stopY(); stopTilt(); unwatchY(); unwatchTilt() }
  }, [tracks, motion, reduced, forced])

  // Native strength0 still has scale8. The supported style prop provides a true neutral control.
  const neutral = canRefract ? `blur(${blur}px) saturate(1.5)${brightness === 1 ? '' : ` brightness(${brightness})`}`
    : `blur(${Math.max(blur, 6)}px) saturate(1.5)`
  const opticStyle: CSSProperties = {
    position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
    ...(s === 0 ? { backdropFilter: neutral, WebkitBackdropFilter: neutral } : {}),
    ...(shadow === 'none' ? { boxShadow: 'none' } : shadow === 'native' ? {} : { boxShadow: `var(--fos-${shadow}-shadow)` }),
  }
  const materialStyle = {
    '--fos-center-opacity': typeof centerOpacity === 'number' ? Math.min(1, Math.max(0, centerOpacity)) : centerOpacity,
    '--fos-center-rgb': centerColor,
    '--fos-rim-width': typeof rimWidth === 'number' ? `${Math.max(0, rimWidth)}px` : rimWidth,
    ...style, borderRadius: radius,
  } as CSSProperties

  return <div {...props} ref={root} className={cn('fos-glass-material', className)}
    style={materialStyle} data-fos-glass-material="" data-optics-mode={mode} data-strength={s}
    data-material-ready={hydrated && box.width > 0 && box.height > 0}
    data-travel-target={motion === 'travel' && Number.isFinite(travelY) ? travelY : 0}
    data-lighting={lighting} data-tone={tone} data-motion={motion} data-motion-state={reduced || forced ? 'off' : 'settled'}>
    {!forced && box.width > 0 && box.height > 0 && <GlassLens
      width={box.width} height={box.height} radius={radius} strength={s} blur={blur} brightness={brightness} dome={dome}
      className="fos-glass-optics" style={opticStyle} aria-hidden="true"
    />}
    {children !== undefined && <div className={cn('fos-glass-content', contentClassName)}>{children}</div>}
  </div>
}
