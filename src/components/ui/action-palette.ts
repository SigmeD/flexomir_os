/** One system palette. Reference is an explicit comparison variant only. */
export type ActionPalette = 'neutral' | 'reference'
export const DEFAULT_ACTION_PALETTE: ActionPalette = 'neutral'
export const isNeutralAction = (palette: ActionPalette) => palette !== 'reference'
