import { FosButtonRoot } from '@/components/ui/fos-button-root'
import { useImperativeHandle, useRef, type ComponentProps } from 'react'
import circle from '@/assets/orders/section-add-circle.svg'
import { FOSAction } from '@/components/ui/fos-controls'
import type { ActionPalette } from '@/components/ui/action-palette'
import { DEFAULT_ACTION_PALETTE, isNeutralAction } from '@/components/ui/action-palette'
import { useDirectionalPress } from '@/components/ui/use-directional-press'
import './section-add-item.css'

/** 1986:774: secondary 44px target/34px circle/canonical plus, no Primary optics. */
type SectionAddItemIcon = 'plus' | 'file'
type SectionAddItemProps = Omit<ComponentProps<'button'>, 'children'> & {
  palette?: ActionPalette
  icon?: SectionAddItemIcon
  accessibleName?: string
}

function ActionGlyph({ icon }: { icon: SectionAddItemIcon }) {
  return <span className="fos-section-add__glyph" aria-hidden="true">
    {icon === 'file' ? <span className="fos-section-add__file-icon" /> : '+'}
  </span>
}

/** Reuse the existing 44px Liquid Glass control; only the icon and accessible name change. */
export function SectionAddItem({ palette = DEFAULT_ACTION_PALETTE, icon = 'plus', accessibleName, ...props }: SectionAddItemProps) {
  const name = accessibleName ?? (icon === 'file' ? 'Добавить файл' : 'Добавить позицию')
  if (isNeutralAction(palette)) return <FOSAction {...props} type="button" palette={palette} shape="round" hierarchy="secondary" data-add-item className="fos-section-add fos-section-add--glass" aria-label={name} title={name}><ActionGlyph icon={icon} /></FOSAction>
  return <ReferenceSectionAddItem {...props} icon={icon} accessibleName={name} />
}

/** Reference palette keeps its SVG circle and shares the action-family click envelope. */
function ReferenceSectionAddItem({ icon, accessibleName, ref, onClick, onPointerDown, onPointerUp, onPointerCancel, onLostPointerCapture, onKeyDown, onKeyUp, onBlur, ...props }: Omit<ComponentProps<'button'>, 'children'> & { icon: SectionAddItemIcon; accessibleName: string }) {
  const button = useRef<HTMLButtonElement>(null), glyph = useRef<HTMLSpanElement>(null)
  useImperativeHandle(ref, () => button.current!, [])
  const press = useDirectionalPress(button, glyph, props.disabled ?? false, 'fos-action')
  return <FosButtonRoot {...props} ref={button} type="button" data-add-item data-pressed="false" className="fos-section-add" aria-label={accessibleName} title={accessibleName}
    onClick={event => { if (press.allowsClick(event)) onClick?.(event) }}
    onPointerDown={event => { press.onPointerDown(event); onPointerDown?.(event) }}
    onPointerUp={event => { press.onPointerUp(event); onPointerUp?.(event) }}
    onPointerCancel={event => { press.onPointerCancel(event); onPointerCancel?.(event) }}
    onLostPointerCapture={event => { press.onLostPointerCapture(); onLostPointerCapture?.(event) }}
    onKeyDown={event => { press.onKeyDown(event); onKeyDown?.(event) }}
    onKeyUp={event => { press.onKeyUp(event); onKeyUp?.(event) }}
    onBlur={event => { press.onBlur(); onBlur?.(event) }}>
    <img src={circle} alt="" /><span ref={glyph} className="fos-section-add__glyph" aria-hidden="true">{icon === 'file' ? <span className="fos-section-add__file-icon" /> : '+'}</span>
  </FosButtonRoot>
}
