import { useLayoutEffect, useRef, useState } from 'react'

/** Same-document demo navigation only. Each host owns its own history namespace. */
export function usePreviewNavigation(root = 'list', onExit?: () => void) {
  const [session] = useState(() => crypto.randomUUID())
  const [path, setPath] = useState(root)
  const current = useRef(root)
  const points = useRef(new Map<string, { scroll: number; attribute?: string; value?: string }>())
  const depth = useRef(0)
  const exitCallback = useRef(onExit)
  exitCallback.current = onExit
  useLayoutEffect(() => {
    const pop = (event: PopStateEvent) => {
      const state = event.state?.preview
      if (state?.session === session) { depth.current = state.depth; setPath(state.path) }
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
    setPath(next)
  }, replace(next: string) {
    history.replaceState({ ...history.state, preview: { session, path: next, depth: depth.current } }, '')
    setPath(next)
  }, back() { if (depth.current > 0) history.back() }, exit() { if (exitCallback.current) history.go(-depth.current - 1) } }
}
