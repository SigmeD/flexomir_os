import { useLayoutEffect, useRef, useState } from 'react'
import { commitContentNavigation, type ContentNavigationDirection } from './navigation-content-motion'

/** Same-document demo navigation only. Each host owns its own history namespace. */
export function usePreviewNavigation(root = 'list', onExit?: () => void, beforePop?: (next: string, proceed: () => void) => boolean, isActive?: () => boolean, enableMotion = false) {
  const [session] = useState(() => crypto.randomUUID())
  const [path, setPath] = useState(root)
  const current = useRef(root)
  const points = useRef(new Map<string, { scroll: number; attribute?: string; value?: string }>())
  const depth = useRef(0)
  const exitCallback = useRef(onExit)
  exitCallback.current = onExit
  const beforePopCallback = useRef(beforePop)
  const activeCallback = useRef(isActive)
  const motionEnabled = useRef(enableMotion)
  beforePopCallback.current = beforePop
  activeCallback.current = isActive
  motionEnabled.current = enableMotion
  const changePath = (next: string, direction: ContentNavigationDirection) => {
    if (motionEnabled.current) commitContentNavigation(direction, () => setPath(next))
    else setPath(next)
  }
  useLayoutEffect(() => {
    const pop = (event: PopStateEvent) => {
      if (activeCallback.current && !activeCallback.current()) return
      const state = event.state?.preview
      if (state?.session === session) {
        const next = state.path as string
        const previousDepth = depth.current
        const proceed = () => { depth.current = state.depth; history.replaceState({ ...history.state, preview: { session, path: next, depth: state.depth } }, ''); changePath(next, state.depth < previousDepth ? 'back' : 'forward') }
        if (next !== current.current && beforePopCallback.current?.(next, proceed)) {
          history.pushState({ ...history.state, preview: { session, path: current.current, depth: depth.current } }, '')
          return
        }
        proceed()
      }
      else exitCallback.current?.()
    }
    // StrictMode replays effects. A nested picker must add exactly one entry.
    if (history.state?.preview?.session !== session) {
      if (exitCallback.current) history.pushState({ ...history.state, preview: { session, path: current.current, depth: depth.current } }, '')
      else history.replaceState({ ...history.state, preview: { session, path: current.current, depth: depth.current } }, '')
    }
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [root, session])
  useLayoutEffect(() => {
    current.current = path
    const point = points.current.get(path)
    // Browser history restores its own focus after popstate; apply the host's
    // return point on the next frame, after both DOM and history restoration.
    const frame = requestAnimationFrame(() => {
      if (point?.attribute) {
        const target = Array.from(document.querySelectorAll<HTMLElement>('[' + point.attribute + ']')).find(node => node.getAttribute(point.attribute!) === point.value)
        target?.focus({ preventScroll: true })
      }
      window.scrollTo(0, point?.scroll ?? 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [path])
  return { path, open(next: string, opener?: { attribute: string; value: string }) {
    const active = document.activeElement
    const attribute = ['data-focus-key', 'data-order-open'].find(name => active?.hasAttribute(name))
    points.current.set(current.current, { scroll: window.scrollY, attribute: opener?.attribute ?? attribute, value: opener?.value ?? (attribute ? active?.getAttribute(attribute) ?? undefined : undefined) })
    depth.current += 1
    history.pushState({ ...history.state, preview: { session, path: next, depth: depth.current } }, '')
    changePath(next, 'forward')
  }, replace(next: string) {
    history.replaceState({ ...history.state, preview: { session, path: next, depth: depth.current } }, '')
    changePath(next, next === root ? 'back' : 'forward')
  }, back() { if (depth.current > 0) history.back() }, exit() { if (exitCallback.current) history.go(-depth.current - 1) } }
}
