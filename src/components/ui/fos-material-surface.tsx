import type { ComponentProps } from 'react'
import { FosGlassMaterial, type FosGlassMaterialProps } from './fos-glass-material'

/* Semantic consumer presets. Explicit defaults pin the existing appearance;
   this file does not own or alter the frozen optics/motion implementation. */
const reference = {
  radius:18, blur:1.5, strength:.1, dome:0, lighting:'sidebar', tone:'reference',
  shadow:'reference', centerOpacity:.16, centerColor:'220 240 247', rimWidth:12, motion:'none',
} as const satisfies FosGlassMaterialProps
const neutralLens = {
  ...reference, tone:'neutral', centerOpacity:.12, centerColor:'var(--fos-neutral-glass-rgb, 248 248 248)',
} as const
const quietAction = {
  ...reference, blur:2, lighting:'native', tone:'neutral', shadow:'none', centerColor:'255 255 255',
} as const
const action = {
  ...reference, tone:'neutral', shadow:'none', centerOpacity:'var(--fos-action-tint, .24)',
  centerColor:'var(--fos-action-center, 240 248 255)', rimWidth:1,
} as const
const presets = {
  'document-preview': {
    ...reference, radius:22, blur:5, strength:.022, tone:'neutral', shadow:'none', centerOpacity:0, rimWidth:1.25,
  },
  navigation: { ...neutralLens, radius:14, motion:'travel' },
  'navigation-reference': { ...reference, radius:14, motion:'travel' },
  segment: { ...neutralLens, radius:19 },
  'segment-reference': { ...reference, radius:19 },
  popup: { ...reference, radius:20, blur:20, tone:'neutral', centerOpacity:0, centerColor:'255 255 255' },
  'account-trigger': { ...reference, radius:15, blur:9, strength:0, tone:'neutral', shadow:'none', centerOpacity:.24, centerColor:'255 255 255' },
  'date-cell': { ...neutralLens, radius:14 },
  action: { ...action, radius:22 },
  'action-round': { ...action, radius:17 },
  'action-quiet': { ...quietAction, radius:22 },
  'action-quiet-round': { ...quietAction, radius:17 },
  'header-action': { ...quietAction, radius:24 },
  'demo-panel': { ...reference, tone:'neutral', shadow:'menu', centerOpacity:.76, centerColor:'248 250 252' },
} satisfies Record<string, FosGlassMaterialProps>

type NavigationVariant = 'navigation' | 'navigation-reference'
type MaterialSurfaceProps = Omit<ComponentProps<'div'>, 'ref' | 'style'> & {
  contentClassName?: string
  /** No inline optical overrides, including callers outside TypeScript. */
  style?: never
} & ({
  variant: Exclude<keyof typeof presets, NavigationVariant>
  layoutTop?: never
  travelY?: never
  onTravelFrame?: never
} | {
  variant: NavigationVariant
  /** Existing measured anchor and spring observer; no general style escape. */
  layoutTop?: number
  travelY?: number
  onTravelFrame?: (y: number) => void
})

/** Purpose + native content/attributes. Only navigation owns a travel target. */
export function FosMaterialSurface({ variant, style: _style, layoutTop, travelY, onTravelFrame, ...props }: MaterialSurfaceProps) {
  if (!Object.hasOwn(presets, variant)) throw new Error('Unknown material preset: ' + variant)
  const preset = presets[variant]
  const navigation = variant === 'navigation' || variant === 'navigation-reference'
  return <FosGlassMaterial {...props} {...preset}
    style={navigation && layoutTop !== undefined ? { top:layoutTop } : undefined}
    travelY={navigation ? travelY : undefined} onTravelFrame={navigation ? onTravelFrame : undefined}
    data-material-preset={variant} />
}
