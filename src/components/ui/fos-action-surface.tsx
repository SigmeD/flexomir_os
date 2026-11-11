import type { ReactNode, RefObject } from 'react'
import { FosActionMaterial } from './fos-action-material'
import './fos-action-surface.css'

/** One material/content composition for Secondary, circular Plus and neutral HeaderAction. */
export function FosActionSurface({ children, motionRef, material = true, solid = false, quiet = false, round = false, geometry = 'action' }: {
  children: ReactNode; motionRef: RefObject<HTMLSpanElement | null>; material?: boolean
  solid?: boolean; quiet?: boolean; round?: boolean; geometry?: 'action' | 'header'
}) {
  return <>
    {material && <FosActionMaterial {...{ quiet, round, geometry }} />}
    {solid && <span aria-hidden="true" data-action-surface="solid" className="fos-action__solid" />}
    <span ref={motionRef} data-action-content="" className="fos-action__motion"><span className="fos-action__content">{children}</span></span>
  </>
}
