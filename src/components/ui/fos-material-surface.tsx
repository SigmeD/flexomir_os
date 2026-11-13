import type { ComponentProps } from 'react'
import { FosGlassMaterial, type FosGlassMaterialProps } from './fos-glass-material'

/* External consumer preset. Explicit defaults pin the existing appearance;
   this file does not own or alter the frozen optics/motion implementation. */
const presets = {
  'document-preview': {
    radius:22, blur:5, strength:.022, dome:0, tone:'neutral', shadow:'none',
    centerOpacity:0, rimWidth:1.25, lighting:'sidebar', centerColor:'220 240 247', motion:'none',
  },
} satisfies Record<string, FosGlassMaterialProps>

type MaterialSurfaceProps = Omit<ComponentProps<'div'>, 'ref' | 'style'> & {
  variant: keyof typeof presets
  contentClassName?: string
  /** No inline optical overrides, including callers outside TypeScript. */
  style?: never
}

/** Pilot API: purpose + native content/attributes. Optical knobs remain internal. */
export function FosMaterialSurface({ variant, style: _style, ...props }: MaterialSurfaceProps) {
  return <FosGlassMaterial {...props} {...presets[variant]} data-material-preset={variant} />
}
