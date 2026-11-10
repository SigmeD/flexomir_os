import { useLayoutEffect, useRef, type RefObject } from 'react'

/** Adapter lifecycle only. All motion/coverage/physics remain in the frozen Rows/material. */
export function usePopupSelectionRest({ open, target, value, generation, surfaceRef, onComplete }: {
  open: boolean; target: string | null; value: string | undefined
  generation: RefObject<number>; surfaceRef: RefObject<HTMLDivElement | null>
  onComplete: (restoreFocus: boolean) => void
}) {
  const committed = useRef(value), complete = useRef(onComplete)
  committed.current = value
  complete.current = onComplete
  useLayoutEffect(() => {
    if (!open || target === null || !surfaceRef.current) return
    const surface = surfaceRef.current, request = generation.current
    let stopped = false, seenLens = false
    const finish = () => {
      if (stopped || request !== generation.current) return
      stopped = true
      complete.current(surface.contains(document.activeElement))
    }
    const check = () => {
      if (stopped || request !== generation.current) return
      const row = Array.from(surface.querySelectorAll<HTMLElement>('[data-popup-item]')).find(item => item.dataset.popupItem === target)
      if (committed.current !== target || !row || row.matches(':disabled, [data-disabled], [aria-disabled="true"]')) { finish(); return }
      const lens = surface.querySelector<HTMLElement>('[data-motion="travel"]')
      if (!lens) { if (seenLens) finish(); return }
      seenLens = true
      if (lens.dataset.motionState !== 'settled' && lens.dataset.motionState !== 'off') return
      const rowBox = row.getBoundingClientRect(), lensBox = lens.getBoundingClientRect()
      if (Math.abs(rowBox.top - lensBox.top) > .75 || Math.abs(rowBox.height - lensBox.height) > .75) return
      finish()
    }
    const observer = new MutationObserver(check)
    observer.observe(surface, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'data-motion-state', 'data-travel-target', 'disabled', 'data-disabled', 'aria-disabled'] })
    check()
    return () => { stopped = true; observer.disconnect() }
  }, [open, target, value, generation, surfaceRef])
}
