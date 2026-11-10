import { useEffect, useRef, type RefObject } from 'react'
import { Track, spring, clamp } from './glass-motion'

/** Input/material adapter only. The existing shared Track/spring owns integration. */
export function useActionSurface(button: RefObject<HTMLButtonElement | null>, enabled: boolean, disabled: boolean) {
  const channels = useRef<Track[]>([])
  if (enabled && !channels.current.length) channels.current = [new Track(0), new Track(0)]
  const state = useRef({ down: false, start: 0, contactUntil: 0, hover: false, sideX: 0, sideY: 0, running: [false, false] })
  const unavailable = () => disabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(forced-colors: active)').matches

  function draw() {
    const root = button.current
    const material = root?.querySelector<HTMLElement>('.fos-action__glass')
    if (!root || !material) return
    const [pressure, hover] = channels.current
    if (!pressure || !hover) return
    const h = clamp(hover.get(), 0, 1)
    const p = clamp(pressure.get(), -.06, 1.08)
    const s = state.current
    const hoverScale = h
    const deforming = Math.abs(p) > .0001 || hoverScale > .0001
    root.dataset.surfaceDeforming = String(deforming)
    material.style.transform = deforming ? `perspective(180px) rotateX(${(-s.sideY * p * .6).toFixed(3)}deg) rotateY(${(s.sideX * p * .6).toFixed(3)}deg) scale(${(1 + .012 * hoverScale - .025 * p).toFixed(5)}, ${(1 + .012 * hoverScale - .055 * p).toFixed(5)})` : 'none'
    material.style.setProperty('--action-shadow-y', `${(2 + .8 * h - .9 * p).toFixed(3)}px`)
    material.style.setProperty('--action-shadow-blur', `${(4 + .8 * h - .8 * p).toFixed(3)}px`)
    material.style.setProperty('--action-shadow-alpha', (.075 + .01 * h - .02 * p).toFixed(4))
    const content = root.querySelector<HTMLElement>('.fos-action__motion')
    content?.style.setProperty('--fos-action-scale', (1 + .02 * hoverScale - .015 * p).toFixed(5))
    content?.style.setProperty('--fos-action-shift-x', `${(s.sideX * p * .7).toFixed(3)}px`)
    content?.style.setProperty('--fos-action-shift-y', `${(s.sideY * p * .7).toFixed(3)}px`)
    root.dataset.surfaceActive = String(s.running.some(Boolean))
  }
  function goal(index: number) {
    const s = state.current
    const time = performance.now()
    const contact = s.down || time < s.contactUntil
    if (index === 0) return s.down ? .18 + .82 * (1 - Math.exp(-Math.min(850, time - s.start) / 370)) : contact ? .65 : 0
    return s.hover ? 1 : 0
  }
  function drive() {
    if (!enabled || unavailable()) return
    const s = state.current
    channels.current.forEach((track, index) => {
      if (s.running[index]) return
      s.running[index] = true
      spring(track, () => goal(index), {
        tension: 155, friction: 21,
        canRest: () => !state.current.down ? performance.now() >= state.current.contactUntil : performance.now() - state.current.start >= 850,
        onRest: () => { s.running[index] = false; draw() },
      })
    })
    draw()
  }
  function reset() {
    const s = state.current
    s.down = false; s.hover = false; s.contactUntil = 0; s.running.fill(false)
    channels.current.forEach(track => track.snap(0))
    if (enabled) draw()
  }
  useEffect(() => {
    if (!enabled) return
    const unsubscribe = channels.current.map(track => track.watch(draw))
    if (disabled) reset()
    return () => { reset(); unsubscribe.forEach(stop => stop()) }
  }, [enabled, disabled])

  return {
    reset,
    press(x: number, y: number) {
      if (!enabled || unavailable()) return
      const s = state.current
      s.down = true; s.start = performance.now(); s.contactUntil = s.start + 100
      s.sideX = x; s.sideY = y
      drive()
    },
    release(cancel = false) {
      if (!enabled) return
      state.current.down = false
      if (cancel) { reset(); return }
      drive()
    },
    hover(_clientX: number, _clientY: number, inside: boolean, pointerType: string) {
      if (!enabled || unavailable()) return
      const s = state.current
      if (pointerType === 'touch' && !s.down) return
      s.hover = inside && pointerType !== 'touch'
      drive()
    },
  }
}
