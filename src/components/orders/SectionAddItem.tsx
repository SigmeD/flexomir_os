import type { ComponentProps } from 'react'
import circle from '@/assets/orders/section-add-circle.svg'
import { FOSAction } from '@/components/ui/fos-controls'
import type { ActionPalette } from '@/components/ui/action-palette'
import './section-add-item.css'

/** 1986:774: secondary 44px target/34px circle/canonical plus, no Primary optics. */
export function SectionAddItem({ palette = 'reference', ...props }: Omit<ComponentProps<'button'>, 'children'> & { palette?: ActionPalette }) {
  const glyph = <span className="fos-section-add__glyph" aria-hidden="true" />
  if (import.meta.env.DEV && palette === 'neutral-pilot') return <FOSAction {...props} palette={palette} shape="round" hierarchy="secondary" data-add-item className="fos-section-add fos-section-add--glass" aria-label="Добавить позицию" title="Добавить позицию">{glyph}</FOSAction>
  return <button {...props} type="button" data-add-item className="fos-section-add" aria-label="Добавить позицию" title="Добавить позицию"><img src={circle} alt="" />{glyph}</button>
}
