/** Shared input pressure envelope for every action presentation; no animation driver. */
export const ACTION_PRESS_CONTACT_MS = 180
const CONTACT_POWER = .72

export function actionPressPower(down: boolean, started: number, contactUntil: number, now: number) {
  if (!down && now >= contactUntil) return 0
  const held = Math.min(850, Math.max(0, now - started))
  return Math.max(CONTACT_POWER, .18 + .82 * (1 - Math.exp(-held / 370)))
}
