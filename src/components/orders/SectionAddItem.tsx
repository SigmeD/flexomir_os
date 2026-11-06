import type { ComponentProps } from 'react'
import circle from '@/assets/orders/section-add-circle.svg'
import './section-add-item.css'

/** 1986:774: secondary 44px target/34px circle/canonical plus, no Primary optics. */
export function SectionAddItem(props: Omit<ComponentProps<'button'>, 'children'>) {
  return <button {...props} type="button" data-add-item className="fos-section-add" aria-label="Добавить позицию" title="Добавить позицию"><img src={circle} alt="" /><span aria-hidden="true" /></button>
}
