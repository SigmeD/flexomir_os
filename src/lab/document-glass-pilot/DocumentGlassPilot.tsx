import type { ComponentProps } from 'react'
import { DocumentGlassMaterial } from './material'
import perimeterCss from './perimeter.css?inline'

/** Two DEV-only DocumentPreview versions. The approved shared material stays frozen. */
export default function DocumentGlassPilot(props: Omit<ComponentProps<'div'>,'style'> & {contentClassName?:string; variant:'document-preview'}) {
  const {variant: _variant,...attrs}=props
  const version = import.meta.env.DEV && new URLSearchParams(location.search).get('documentGlass') === 'latest' ? 'latest' : 'pilot'
  return <><style>{perimeterCss}</style><DocumentGlassMaterial {...attrs} version={version} data-material-preset="document-preview" /></>
}
