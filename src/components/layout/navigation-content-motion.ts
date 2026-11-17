import { flushSync } from 'react-dom'
import './navigation-content-motion.css'

export type ContentNavigationDirection = 'forward' | 'back'

let activeTransition: ViewTransition | null = null
let fallbackEpoch = 0

/** Capture only the changing content after a navigation decision has committed. */
export function commitContentNavigation(direction: ContentNavigationDirection, commit: () => void) {
  const epoch = ++fallbackEpoch
  delete document.documentElement.dataset.cabinetSectionMotion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    activeTransition?.skipTransition()
    delete document.documentElement.dataset.orderNavigationMotion
    delete document.documentElement.dataset.orderNavigationFallback
    commit()
    return
  }
  // Current WebKit crashes when the retained order shell is captured by a View Transition.
  // Keep a directional CSS entrance there until the browser path passes regression QA.
  const webkit = /AppleWebKit/.test(navigator.userAgent) && !/Chrom(e|ium)/.test(navigator.userAgent)
  if (!document.startViewTransition || webkit) {
    document.documentElement.dataset.orderNavigationFallback = direction
    flushSync(commit)
    window.setTimeout(() => { if (fallbackEpoch === epoch) delete document.documentElement.dataset.orderNavigationFallback }, 330)
    return
  }
  activeTransition?.skipTransition()
  document.documentElement.dataset.orderNavigationMotion = direction
  const transition = document.startViewTransition(() => { flushSync(commit) })
  activeTransition = transition
  void transition.finished.finally(() => {
    if (activeTransition !== transition) return
    activeTransition = null
    delete document.documentElement.dataset.orderNavigationMotion
  })
}

/** Animate the newly selected cabinet section after its exit guard has committed. */
export function commitSectionNavigation(commit: () => void) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ++fallbackEpoch
    activeTransition?.skipTransition()
    delete document.documentElement.dataset.orderNavigationMotion
    delete document.documentElement.dataset.orderNavigationFallback
    delete document.documentElement.dataset.cabinetSectionMotion
    commit()
    return
  }
  activeTransition?.skipTransition()
  delete document.documentElement.dataset.orderNavigationMotion
  delete document.documentElement.dataset.orderNavigationFallback
  const epoch = ++fallbackEpoch
  document.documentElement.dataset.cabinetSectionMotion = 'enter'
  flushSync(commit)
  window.setTimeout(() => {
    if (fallbackEpoch === epoch) delete document.documentElement.dataset.cabinetSectionMotion
  }, 230)
}
