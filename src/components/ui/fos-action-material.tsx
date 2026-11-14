import { FosMaterialSurface } from './fos-material-surface'
import './fos-action-material.css'

/** Consumer preset, not an optical engine. Frozen material and GlassLens stay intact. */
export function FosActionMaterial({ quiet = false, round = false, geometry = 'action' }: { quiet?: boolean; round?: boolean; geometry?: 'action' | 'header' }) {
  if (quiet) return <FosMaterialSurface aria-hidden="true" data-action-surface="" className={`fos-action__glass ${geometry === 'header' ? 'fos-ha__material ' : ''}fos-action-material--quiet`}
    data-action-material="neutral-action" variant={geometry === 'header' ? 'header-action' : round ? 'action-quiet-round' : 'action-quiet'} />
  return <FosMaterialSurface aria-hidden="true" className="fos-action__glass" variant={round ? 'action-round' : 'action'} />
}
