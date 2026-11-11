import { FosGlassMaterial } from './fos-glass-material'
import './fos-action-material.css'

/** Consumer preset, not an optical engine. Frozen material and GlassLens stay intact. */
export function FosActionMaterial({ quiet = false, round = false, geometry = 'action' }: { quiet?: boolean; round?: boolean; geometry?: 'action' | 'header' }) {
  if (quiet) return <FosGlassMaterial aria-hidden="true" data-action-surface="" className={`fos-action__glass ${geometry === 'header' ? 'fos-ha__material ' : ''}fos-action-material--quiet`}
    data-action-material="neutral-action" strength={.1} radius={geometry === 'header' ? 24 : round ? 17 : 22} blur={2}
    dome={0} lighting="native" tone="neutral" shadow="none" centerColor="255 255 255" />
  return <FosGlassMaterial aria-hidden="true" className="fos-action__glass" strength={.1} radius={round ? 17 : 22}
    blur={1.5} lighting="sidebar" tone="neutral" shadow="none" centerOpacity="var(--fos-action-tint, .24)"
    centerColor="var(--fos-action-center, 240 248 255)" rimWidth={1} />
}
