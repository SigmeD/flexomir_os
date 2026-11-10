import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useImperativeHandle, useLayoutEffect, useRef, type ComponentProps } from 'react'
import { useDirectionalPress } from './use-directional-press'
import { FosActionSurface } from './fos-action-surface'
import type { ActionPalette } from './action-palette'
import { DEFAULT_ACTION_PALETTE, isNeutralAction } from './action-palette'
import './header-action.css'
import './action-palette.css'
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
  palette?: ActionPalette
  onAction?: () => void
}

/** Shared Client/Manager icon action. Only the 48px circle animates; the hit area and caption stay fixed. */
export function HeaderAction({
  action, accessibleName, presentation = 'auto', palette = DEFAULT_ACTION_PALETTE, onAction, disabled = false,
  className = '', ref, ...buttonProps
}: HeaderActionProps) {
  const neutral = isNeutralAction(palette)
  const buttonRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => buttonRef.current!, [])
  const circleRef = useRef<HTMLSpanElement>(null)
  const motionRef = useRef<HTMLSpanElement>(null)
  const press = useDirectionalPress(buttonRef, circleRef, disabled, 'ha', neutral)
  function positionTooltip() {
    const button = buttonRef.current
    const tooltip = button?.querySelector<HTMLElement>('.fos-ha__tooltip')
    if (!button || !tooltip) return
    const bounds = button.getBoundingClientRect(), width = tooltip.getBoundingClientRect().width
    if (!width) return
    const ideal = bounds.left + bounds.width / 2 - width / 2
    const left = Math.max(20, Math.min(ideal, window.innerWidth - width - 20))
    button.style.setProperty('--ha-tooltip-shift', (left - ideal) + 'px')
  }
  useLayoutEffect(() => { if (!disabled) positionTooltip() }, [disabled, accessibleName])

  const caption = { add: 'Добавить', create: 'Создать', save: 'Сохранить', send: 'Отправить', edit: 'Изменить', choose: 'Выбрать' }[action]
  const glyph = { save: saveIcon, send: sendIcon, edit: editIcon, choose: chooseIcon }[action as 'save' | 'send' | 'edit' | 'choose']
  const icon = glyph ? <span className="fos-ha__glyph">{neutral ? <span className="fos-ha__glyph-mask" style={{ maskImage: `url("${glyph}")`, WebkitMaskImage: `url("${glyph}")` }} /> : <img src={glyph} alt="" />}</span> : <span className="fos-ha__plus" />

  return (
    <FosButtonRoot
      {...buttonProps}
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-label={accessibleName}
      data-pressed="false"
      data-presentation={presentation}
      data-action={action}
      data-action-palette={neutral ? 'neutral' : undefined}
      data-surface-motion={neutral ? 'pressure' : undefined}
      className={['fos-ha', 'fos-ha--' + presentation, className].filter(Boolean).join(' ')}
      onClick={event => { if (press.allowsClick(event)) onAction?.() }}
      onPointerEnter={event => { positionTooltip(); press.onPointerEnter(event); buttonProps.onPointerEnter?.(event) }}
      onPointerMove={event => { press.onPointerMove(event); buttonProps.onPointerMove?.(event) }}
      onPointerLeave={event => { press.onPointerLeave(event); buttonProps.onPointerLeave?.(event) }}
      onFocus={event => { positionTooltip(); buttonProps.onFocus?.(event) }}
      onPointerDown={event => { press.onPointerDown(event); buttonProps.onPointerDown?.(event) }}
      onPointerUp={event => { press.onPointerUp(event); buttonProps.onPointerUp?.(event) }}
      onPointerCancel={event => { press.onPointerCancel(event); buttonProps.onPointerCancel?.(event) }}
      onLostPointerCapture={event => { press.onLostPointerCapture(); buttonProps.onLostPointerCapture?.(event) }}
      onKeyDown={event => { press.onKeyDown(event); buttonProps.onKeyDown?.(event) }}
      onKeyUp={event => { press.onKeyUp(event); buttonProps.onKeyUp?.(event) }}
      onBlur={event => { press.onBlur(); buttonProps.onBlur?.(event) }}
    >
      <span className="fos-ha__circle" ref={circleRef} aria-hidden="true">
        {neutral ? <FosActionSurface quiet geometry="header" motionRef={motionRef}>{icon}</FosActionSurface> : <><span className="fos-ha__contact" />{icon}</>}
      </span>
      <span className="fos-ha__caption" aria-hidden="true">{caption}</span>
      <span className="fos-ha__tooltip" aria-hidden="true">{accessibleName}</span>
    </FosButtonRoot>
  )
}
