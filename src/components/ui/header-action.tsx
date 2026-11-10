import { useLayoutEffect, useRef, type ComponentProps } from 'react'
import { useDirectionalPress } from './use-directional-press'
import { FosGlassMaterial } from './fos-glass-material'
import type { ActionPalette } from './action-palette'
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
  action, accessibleName, presentation = 'auto', palette = 'reference', onAction, disabled = false,
  className = '', ...buttonProps
}: HeaderActionProps) {
  const neutral = import.meta.env.DEV && palette === 'neutral-pilot'
  const buttonRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<HTMLSpanElement>(null)
  const press = useDirectionalPress(buttonRef, circleRef, disabled, 'ha')
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
      data-action-palette={neutral ? 'neutral-pilot' : undefined}
      className={['fos-ha', 'fos-ha--' + presentation, className].filter(Boolean).join(' ')}
      onClick={() => onAction?.()}
      onPointerEnter={event => { positionTooltip(); buttonProps.onPointerEnter?.(event) }}
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
        {neutral && <FosGlassMaterial className="fos-ha__material" strength={0.1} radius={24} blur={1.5} lighting="sidebar" tone="neutral" shadow="reference" centerOpacity={0.24} centerColor="var(--fos-neutral-center)" rimWidth={1} />}
        <span className="fos-ha__contact" />
        {glyph ? <span className="fos-ha__glyph">{neutral ? <span className="fos-ha__glyph-mask" style={{ maskImage: `url("${glyph}")`, WebkitMaskImage: `url("${glyph}")` }} /> : <img src={glyph} alt="" />}</span> : <span className="fos-ha__plus" />}
      </span>
      <span className="fos-ha__caption" aria-hidden="true">{caption}</span>
      <span className="fos-ha__tooltip" aria-hidden="true">{accessibleName}</span>
    </button>
  )
}
