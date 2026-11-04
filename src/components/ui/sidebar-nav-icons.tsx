import type { ReactNode, SVGProps } from 'react'

/**
 * SVG shapes reproduced from the owner-provided, accepted Sidebar 2.2.5 C lab.
 * Icons are optional and live OUTSIDE the glass material as crisp DOM SVGs.
 * No icon pack or raster asset is loaded for the component.
 */
export type SidebarNavIconName =
  | 'overview' | 'orders' | 'artworks' | 'messages'
  | 'support' | 'profile' | 'clients'

export function SidebarNavIcon({
  name, ...props
}: { name: SidebarNavIconName } & Omit<SVGProps<SVGSVGElement>, 'children'>) {
  let shapes: ReactNode = null
  switch (name) {
    case 'overview':
      shapes = <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" /><rect x="13" y="10" width="8" height="11" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /></>
      break
    case 'orders':
      shapes = <><rect x="4" y="4" width="16" height="17" rx="3" /><path d="M8 4.5V2m8 2.5V2M4 10h16M8 15h8" /></>
      break
    case 'artworks':
      shapes = <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 8h8M8 12h8M8 16h5" /></>
      break
    case 'messages':
      shapes = <path d="M4 6h16v12H4zM4 9l8 5 8-5" />
      break
    case 'support':
      shapes = <><path d="M8 11a4 4 0 1 1 8 0c0 3-2 4-4 5M12 20h.01" /><circle cx="12" cy="12" r="10" /></>
      break
    case 'profile':
      shapes = <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>
      break
    case 'clients':
      // This route is part of current Manager UX, but not of the lab.
      // Keep a minimal matching-outline people glyph, pending visual DS review.
      shapes = <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M17 5a3 3 0 0 1 0 6m1.5 9v-2a5.4 5.4 0 0 0-3-4.85" /></>
      break
  }
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >{shapes}</svg>
  )
}
