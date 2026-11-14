import type { ComponentProps, ReactNode } from 'react'
import { FosButtonRoot, type FosButtonRootProps } from './fos-button-root'
import chevron from '@/assets/orders/chevron.svg'
import './fos-summary-row.css'

interface Presentation {
  children: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  density?: 'compact' | 'regular'
  surface?: 'flat' | 'card'
}
type SummaryRowProps = Presentation & (
  | ({ readOnly?: false; overlay?: false } & Omit<FosButtonRootProps, 'children' | 'family'>)
  | ({ readOnly: true; overlay?: false } & Omit<ComponentProps<'div'>, 'children'>)
  | ({ readOnly?: false; overlay: true } & Omit<FosButtonRootProps, 'children' | 'family'>)
)

/** Presentation only. Native attributes/refs pass through; no domain data or state. */
export function FosSummaryRow(props: SummaryRowProps) {
  const density = props.density ?? 'regular', surface = props.surface ?? 'flat'
  const className = ['fos-summary-row', props.className].filter(Boolean).join(' ')
  const content = <>{props.leading}{props.children}{props.trailing ?? <img className="fos-summary-row__chevron" src={chevron} alt="" />}</>
  if (props.readOnly) {
    const { readOnly, overlay: _overlay, leading, trailing, children, density: _density, surface: _surface, className: _className, ...attrs } = props
    return <div {...attrs} className={className} data-summary-row="static" data-row-density={density} data-row-surface={surface}>{content}</div>
  }
  const { readOnly, overlay, leading, trailing, children, density: _density, surface: _surface, className: _className, ...attrs } = props
  if (overlay) return <div className={className} data-summary-row="interactive" data-row-interaction="overlay" data-row-density={density} data-row-surface={surface}>
    {content}
    <FosButtonRoot {...attrs} family="row" className="fos-summary-row__hit" />
  </div>
  return <FosButtonRoot {...attrs} family="row" className={className} data-summary-row="interactive" data-row-density={density} data-row-surface={surface}>{content}</FosButtonRoot>
}

/** Shared copy slots; tag/class hooks retain existing semantics and selectors. */
export function FosSummaryRowCopy({ title, metadata, titleAs: Title = 'strong', metadataAs: Meta = 'small', classes = {}, children, className = '' }: {
  title: ReactNode; metadata: ReactNode; titleAs?: 'span' | 'strong'; metadataAs?: 'span' | 'small'
  classes?: { title?: string; metadata?: string }; children?: ReactNode; className?: string
}) {
  return <span className={['fos-summary-row__copy', className].filter(Boolean).join(' ')}>
    <Title className={['fos-summary-row__title', classes.title].filter(Boolean).join(' ')}>{title}</Title>
    <Meta className={['fos-summary-row__meta', classes.metadata].filter(Boolean).join(' ')}>{metadata}</Meta>
    {children}
  </span>
}
