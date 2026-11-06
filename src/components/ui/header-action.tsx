import { useEffect, useRef, type ComponentProps, type KeyboardEvent, type PointerEvent } from 'react'
import './header-action.css'
import saveIcon from '@/assets/orders/save.svg'
import sendIcon from '@/assets/orders/send.svg'
import editIcon from '@/assets/orders/edit.svg'
import chooseIcon from '@/assets/layouts/choose.svg'

export type HeaderActionPresentation = 'auto' | 'icon-label' | 'compact'

export interface HeaderActionProps extends Omit<ComponentProps<'button'>, 'children' | 'onClick' | 'type'> {
  /** FOS V2 1953:4168 / 2173:1425: one accepted material/motion across action glyphs. */
  action: 'add' | 'create' | 'save' | 'send' | 'edit' | 'choose'
  accessibleName: string
  presentation?: HeaderActionPresentation
  onAction?: () => void
}

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

/** Shared Client/Manager icon action. Only the 48px circle animates; the hit area and caption stay fixed. */
export function HeaderAction({
  action, accessibleName, presentation = 'auto', onAction, disabled = false,
  className = '', ...buttonProps
}: HeaderActionProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<HTMLSpanElement>(null)
  const motion = useRef<PressState>(freshState())

  function reset() {
    const s = motion.current
    if (s.raf) cancelAnimationFrame(s.raf)
    if (s.resetTimer) window.clearTimeout(s.resetTimer)
    Object.assign(s, freshState())
    const circle = circleRef.current
    circle?.style.removeProperty('--ha-shift-x')
    circle?.style.removeProperty('--ha-shift-y')
    circle?.style.removeProperty('--ha-scale')
    circle?.style.removeProperty('--ha-light-x')
    circle?.style.removeProperty('--ha-light-y')
    if (buttonRef.current) buttonRef.current.dataset.pressed = 'false'
  }

  // Also cleans up active spring and delayed light reset on unmount, prop change and StrictMode replay.
  useEffect(() => {
    if (disabled) reset()
    return () => reset()
  }, [disabled])

  function schedule() {
    const s = motion.current
    if (!s.raf) s.raf = requestAnimationFrame(frame)
  }

  function frame(now: number) {
    const s = motion.current
    s.raf = 0
    const circle = circleRef.current
    if (!circle || disabled) return
    if (motionUnavailable()) {
      reset()
      return
    }

    const dt = Math.min(0.032, Math.max(0.004, (now - (s.last || now)) / 1000))
    s.last = now
    s.power = s.down ? 0.18 + 0.82 * (1 - Math.exp(-Math.min(850, now - s.holdStart) / 370)) : 0
    const tx = s.sideX * 4 * s.power
    const ty = s.sideY * 3 * s.power
    const stiffness = 155, drag = 21
    s.velocityX = (s.velocityX + (tx - s.shiftX) * stiffness * dt) * Math.exp(-drag * dt)
    s.velocityY = (s.velocityY + (ty - s.shiftY) * stiffness * dt) * Math.exp(-drag * dt)
    s.shiftX += s.velocityX * dt
    s.shiftY += s.velocityY * dt

    circle.style.setProperty('--ha-shift-x', s.shiftX.toFixed(3) + 'px')
    circle.style.setProperty('--ha-shift-y', s.shiftY.toFixed(3) + 'px')
    circle.style.setProperty('--ha-scale', (1 - s.power * 0.025).toFixed(4))
    if (s.down || Math.abs(s.shiftX) + Math.abs(s.shiftY) +
      Math.abs(s.velocityX) + Math.abs(s.velocityY) > 0.04) {
      schedule()
    } else {
      s.last = 0
      circle.style.setProperty('--ha-shift-x', '0px')
      circle.style.setProperty('--ha-shift-y', '0px')
      circle.style.setProperty('--ha-scale', '1')
    }
  }

  function begin(x: number, y: number, via: 'pointer' | 'keyboard') {
    const s = motion.current
    if (disabled || s.down) return
    window.clearTimeout(s.resetTimer)
    s.resetTimer = 0
    s.down = true
    s.via = via
    s.sideX = clamp(x, -1, 1)
    s.sideY = clamp(y, -1, 1)
    s.holdStart = performance.now()
    s.last = 0
    const circle = circleRef.current
    circle?.style.setProperty('--ha-light-x', ((s.sideX + 1) * 50).toFixed(1) + '%')
    circle?.style.setProperty('--ha-light-y', ((s.sideY + 1) * 50).toFixed(1) + '%')
    if (buttonRef.current) buttonRef.current.dataset.pressed = 'true'
    if (!motionUnavailable()) schedule()
  }

  function end() {
    const s = motion.current
    if (!s.down) return
    s.down = false
    s.pointerId = null
    s.via = null
    if (buttonRef.current) buttonRef.current.dataset.pressed = 'false'
    if (!motionUnavailable()) schedule()
    window.clearTimeout(s.resetTimer)
    s.resetTimer = window.setTimeout(() => {
      if (!s.down) {
        circleRef.current?.style.removeProperty('--ha-light-x')
        circleRef.current?.style.removeProperty('--ha-light-y')
      }
      s.resetTimer = 0
    }, 230)
  }

  function pointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return
    const rect = circleRef.current?.getBoundingClientRect()
    if (!rect) return
    begin(((event.clientX - rect.left) / rect.width - 0.5) * 2,
      ((event.clientY - rect.top) / rect.height - 0.5) * 2, 'pointer')
    motion.current.pointerId = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
    buttonProps.onPointerDown?.(event)
  }

  function pointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (motion.current.pointerId === event.pointerId) end()
    buttonProps.onPointerUp?.(event)
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!disabled && !event.repeat && (event.key === ' ' || event.key === 'Enter')) begin(0, 0, 'keyboard')
    buttonProps.onKeyDown?.(event)
  }

  function keyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if ((event.key === ' ' || event.key === 'Enter') && motion.current.via === 'keyboard') end()
    buttonProps.onKeyUp?.(event)
  }

  const caption = { add: 'Добавить', create: 'Создать', save: 'Сохранить', send: 'Отправить', edit: 'Изменить', choose: 'Выбрать' }[action]
  const glyph = { save: saveIcon, send: sendIcon, edit: editIcon, choose: chooseIcon }[action as 'save' | 'send' | 'edit' | 'choose']

  return (
    <button
      {...buttonProps}
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-label={accessibleName}
      data-pressed="false"
      data-presentation={presentation}
      data-action={action}
      className={['fos-ha', 'fos-ha--' + presentation, className].filter(Boolean).join(' ')}
      onClick={() => onAction?.()}
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
      onPointerCancel={(event) => { if (motion.current.pointerId === event.pointerId) end(); buttonProps.onPointerCancel?.(event) }}
      onLostPointerCapture={(event) => { if (motion.current.via === 'pointer') end(); buttonProps.onLostPointerCapture?.(event) }}
      onKeyDown={keyDown}
      onKeyUp={keyUp}
      onBlur={(event) => { end(); buttonProps.onBlur?.(event) }}
    >
      <span className="fos-ha__circle" ref={circleRef} aria-hidden="true">
        <span className="fos-ha__contact" />
        {glyph ? <span className="fos-ha__glyph"><img src={glyph} alt="" /></span> : <span className="fos-ha__plus" />}
      </span>
      <span className="fos-ha__caption" aria-hidden="true">{caption}</span>
      <span className="fos-ha__tooltip" aria-hidden="true">{accessibleName}</span>
    </button>
  )
}
