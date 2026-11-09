import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'

interface PressState {
  down: boolean
  pointerId: number | null
  via: 'pointer' | 'keyboard' | null
  sideX: number
  sideY: number
  holdStart: number
  power: number
  shiftX: number
  shiftY: number
  velocityX: number
  velocityY: number
  last: number
  raf: number
  resetTimer: number
}

const freshState = (): PressState => ({
  down: false, pointerId: null, via: null, sideX: 0, sideY: 0, holdStart: 0,
  power: 0, shiftX: 0, shiftY: 0, velocityX: 0, velocityY: 0,
  last: 0, raf: 0, resetTimer: 0,
})

const clamp = (value: number, a: number, b: number) => Math.max(a, Math.min(b, value))
const motionUnavailable = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  window.matchMedia('(forced-colors: active)').matches

/** One directional press response shared by icon and text actions. */
export function useDirectionalPress<T extends HTMLButtonElement>(
  buttonRef: RefObject<T | null>,
  surfaceRef: RefObject<HTMLElement | null>,
  disabled: boolean,
  prefix: 'ha' | 'fos-action',
) {
  const motion = useRef<PressState>(freshState())

  function reset() {
    const state = motion.current
    if (state.raf) cancelAnimationFrame(state.raf)
    if (state.resetTimer) window.clearTimeout(state.resetTimer)
    Object.assign(state, freshState())
    const surface = surfaceRef.current
    surface?.style.removeProperty(`--${prefix}-shift-x`)
    surface?.style.removeProperty(`--${prefix}-shift-y`)
    surface?.style.removeProperty(`--${prefix}-scale`)
    surface?.style.removeProperty(`--${prefix}-light-x`)
    surface?.style.removeProperty(`--${prefix}-light-y`)
    buttonRef.current?.setAttribute('data-pressed', 'false')
  }

  useEffect(() => {
    if (disabled) reset()
    return () => reset()
  }, [disabled])

  function schedule() {
    const state = motion.current
    if (!state.raf) state.raf = requestAnimationFrame(frame)
  }

  function frame(now: number) {
    const state = motion.current
    state.raf = 0
    const surface = surfaceRef.current
    if (!surface || disabled) return
    if (motionUnavailable()) { reset(); return }

    const dt = Math.min(0.032, Math.max(0.004, (now - (state.last || now)) / 1000))
    state.last = now
    state.power = state.down ? 0.18 + 0.82 * (1 - Math.exp(-Math.min(850, now - state.holdStart) / 370)) : 0
    const targetX = state.sideX * 4 * state.power
    const targetY = state.sideY * 3 * state.power
    const stiffness = 155, drag = 21
    state.velocityX = (state.velocityX + (targetX - state.shiftX) * stiffness * dt) * Math.exp(-drag * dt)
    state.velocityY = (state.velocityY + (targetY - state.shiftY) * stiffness * dt) * Math.exp(-drag * dt)
    state.shiftX += state.velocityX * dt
    state.shiftY += state.velocityY * dt

    surface.style.setProperty(`--${prefix}-shift-x`, `${state.shiftX.toFixed(3)}px`)
    surface.style.setProperty(`--${prefix}-shift-y`, `${state.shiftY.toFixed(3)}px`)
    surface.style.setProperty(`--${prefix}-scale`, (1 - state.power * 0.025).toFixed(4))
    if (state.down || Math.abs(state.shiftX) + Math.abs(state.shiftY) + Math.abs(state.velocityX) + Math.abs(state.velocityY) > 0.04) {
      schedule()
    } else {
      state.last = 0
      surface.style.setProperty(`--${prefix}-shift-x`, '0px')
      surface.style.setProperty(`--${prefix}-shift-y`, '0px')
      surface.style.setProperty(`--${prefix}-scale`, '1')
    }
  }

  function begin(x: number, y: number, via: 'pointer' | 'keyboard') {
    const state = motion.current
    if (disabled || state.down) return
    window.clearTimeout(state.resetTimer)
    state.resetTimer = 0
    state.down = true
    state.via = via
    state.sideX = clamp(x, -1, 1)
    state.sideY = clamp(y, -1, 1)
    state.holdStart = performance.now()
    state.last = 0
    const surface = surfaceRef.current
    surface?.style.setProperty(`--${prefix}-light-x`, `${((state.sideX + 1) * 50).toFixed(1)}%`)
    surface?.style.setProperty(`--${prefix}-light-y`, `${((state.sideY + 1) * 50).toFixed(1)}%`)
    buttonRef.current?.setAttribute('data-pressed', 'true')
    if (!motionUnavailable()) schedule()
  }

  function end() {
    const state = motion.current
    if (!state.down) return
    state.down = false
    state.pointerId = null
    state.via = null
    buttonRef.current?.setAttribute('data-pressed', 'false')
    if (!motionUnavailable()) schedule()
    window.clearTimeout(state.resetTimer)
    state.resetTimer = window.setTimeout(() => {
      if (!state.down) {
        surfaceRef.current?.style.removeProperty(`--${prefix}-light-x`)
        surfaceRef.current?.style.removeProperty(`--${prefix}-light-y`)
      }
      state.resetTimer = 0
    }, 230)
  }

  function onPointerDown(event: PointerEvent<T>) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    const rect = surfaceRef.current?.getBoundingClientRect()
    if (!rect) return
    begin(((event.clientX - rect.left) / rect.width - 0.5) * 2, ((event.clientY - rect.top) / rect.height - 0.5) * 2, 'pointer')
    motion.current.pointerId = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  function onPointerUp(event: PointerEvent<T>) { if (motion.current.pointerId === event.pointerId) end() }
  function onPointerCancel(event: PointerEvent<T>) { if (motion.current.pointerId === event.pointerId) end() }
  function onLostPointerCapture() { if (motion.current.via === 'pointer') end() }
  function onKeyDown(event: KeyboardEvent<T>) {
    if (!disabled && !event.repeat && (event.key === ' ' || event.key === 'Enter')) begin(0, 0, 'keyboard')
  }
  function onKeyUp(event: KeyboardEvent<T>) {
    if ((event.key === ' ' || event.key === 'Enter') && motion.current.via === 'keyboard') end()
  }
  function onBlur() { end() }

  return { onPointerDown, onPointerUp, onPointerCancel, onLostPointerCapture, onKeyDown, onKeyUp, onBlur }
}
