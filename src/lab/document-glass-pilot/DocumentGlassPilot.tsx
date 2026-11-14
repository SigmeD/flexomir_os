import type { ComponentProps } from 'react'
import { FosGlassMaterial } from './material'
import perimeterCss from './perimeter.css?inline'

/** Temporary Owner-requested duplicate. Never selected in a production build.
 * Keep the original material/engine frozen until the Owner accepts this pilot.
 * Candidate tests a wider filter region, balanced lighting, and DEV-only viewport backgrounds. */
export default function DocumentGlassPilot(props: Omit<ComponentProps<'div'>,'style'> & {contentClassName?:string; variant:'document-preview'}) {
  const {variant: _variant,...attrs}=props
  return <><style>{perimeterCss}</style><FosGlassMaterial {...attrs} radius={22} blur={5} strength={.022} dome={0}
    lighting="sidebar" tone="neutral" shadow="none" centerOpacity={0}
    centerColor="220 240 247" rimWidth={1.25} motion="none" data-material-preset="document-preview" /></>
}
