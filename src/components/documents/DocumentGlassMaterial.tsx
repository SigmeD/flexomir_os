import { useLayoutEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { GlassLens, refractionSupported, useHydrated } from '@/components/ui/glass'
import { cn } from '@/lib/utils'
import '@/components/ui/fos-glass-material.css'
import documentGlassCss from './document-glass.css?inline'

type Version = 'pilot' | 'latest'
interface DocumentGlassMaterialProps extends Omit<ComponentProps<'div'>, 'children' | 'ref' | 'style'> {
  children?: ReactNode
  contentClassName?: string
  version: Version
}

const forcedQuery = '(forced-colors: active)'
function subscribeForced(notify: () => void) {
  const media = matchMedia(forcedQuery)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}
const forcedSnapshot = () => matchMedia(forcedQuery).matches

/** DocumentPreview material; Pilot is available for DEV comparison only. */
export function DocumentGlassMaterial({ children, className, contentClassName, version, ...attrs }: DocumentGlassMaterialProps) {
  const root = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })
  const hydrated = useHydrated()
  const forced = useSyncExternalStore(subscribeForced, forcedSnapshot, () => false)
  const latest = version === 'latest'
  const mode = forced ? 'high-contrast' : hydrated && refractionSupported() ? 'refraction' : 'frosted'

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const measure = () => {
      const width = element.clientWidth
      const height = element.clientHeight
      setBox(previous => previous.width === width && previous.height === height ? previous : { width, height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const materialStyle = {
    '--fos-center-opacity': 0,
    '--fos-center-rgb': '220 240 247',
    '--fos-rim-width': '1.25px',
    borderRadius: 22,
  } as CSSProperties

  return <><style>{documentGlassCss}</style><div {...attrs} ref={root} className={cn('fos-glass-material', className)} style={materialStyle}
    data-fos-glass-material="" data-optics-mode={mode} data-strength={.022}
    data-material-preset="document-preview"
    data-material-ready={hydrated && box.width > 0 && box.height > 0}
    data-travel-target={0} data-lighting="sidebar" data-tone="neutral"
    data-motion="none" data-motion-state={forced ? 'off' : 'settled'}>
    {!forced && box.width > 0 && box.height > 0 && <GlassLens
      width={box.width} height={box.height} radius={22} strength={.022} blur={.5} dome={0}
      brightness={latest ? 1 : 1.05} edgeBand={latest ? 24 : undefined}
      edgeProfile={latest ? 'tapered' : 'rim'} filterOutset
      className="fos-glass-optics"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', boxShadow: 'none' }}
      aria-hidden="true"
    />}
    {latest && <div className="fos-document-frost" aria-hidden="true" />}
    {children !== undefined && <div className={cn('fos-glass-content', contentClassName)}>{children}</div>}
  </div></>
}
