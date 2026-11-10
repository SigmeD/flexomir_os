import { forwardRef, type ComponentProps } from 'react'

export type FosButtonFamily = 'action' | 'navigation' | 'row' | 'field' | 'option' | 'segment' | 'utility'
export type FosButtonRootProps = ComponentProps<'button'> & { family?: FosButtonFamily }

/** Semantic foundation only. Visual variants and interaction owners stay above it. */
export const FosButtonRoot = forwardRef<HTMLButtonElement, FosButtonRootProps>(function FosButtonRoot({ family = 'action', type = 'button', ...props }, ref) {
  return <button {...props} ref={ref} type={type} data-fos-button={family} />
})
