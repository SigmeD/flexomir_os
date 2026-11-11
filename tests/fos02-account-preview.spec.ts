import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const menu = (page: Page) => page.getByTestId('account-menu')
const trigger = (page: Page) => page.locator('[data-testid="account-menu-trigger"]:visible')
const profile = (page: Page) => menu(page).getByRole('menuitem', { name: 'Настройки профиля', exact: true })
const lens = (page: Page) => menu(page).locator('[data-motion="travel"]')
const label = (page: Page) => profile(page).locator('[data-popup-label]')

test('hover presence eases glass and optical scale together, including interrupted leave', async ({ page }, info) => {
  test.skip(info.project.use.hasTouch === true, 'Pointer appearance; touch has no hover requirement')
  await open(page)
  const rows = menu(page).locator('.fos-popup-rows')
  await rows.evaluate(el => el.addEventListener('transitionrun', event => {
    if ((event as TransitionEvent).propertyName === '--fos-action-preview-presence') {
      el.getAnimations().forEach(animation => animation.pause())
    }
  }))
  await profile(page).hover()
  const sample = async () => rows.evaluate(el => {
    const animation = el.getAnimations().find(animation => (animation as CSSTransition).transitionProperty === '--fos-action-preview-presence')
    if (!animation?.effect) return null
    animation.currentTime = Number(animation.effect.getComputedTiming().duration) / 2
    const glass = el.querySelector<HTMLElement>('[data-motion="travel"]')!
    const text = el.querySelector<HTMLElement>('[data-popup-label]')!
    return { opacity: Number(getComputedStyle(glass).opacity), scale: new DOMMatrix(getComputedStyle(text).transform).a }
  })
  await expect.poll(() => rows.evaluate(el => el.getAnimations().length)).toBe(1)
  const entering = (await sample())!
  expect(entering.opacity).toBeGreaterThan(0)
  expect(entering.opacity).toBeLessThan(1)
  expect(entering.scale).toBeGreaterThan(1)
  expect(entering.scale).toBeLessThan(1.043)
  await rows.evaluate(el => el.getAnimations().forEach(animation => animation.finish()))
  await expect.poll(() => label(page).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeCloseTo(1.043, 4)
  await menu(page).locator('.fos-account-menu__identity').hover()
  await expect(lens(page)).toHaveCount(1)
  const leaving = (await sample())!
  expect(leaving.opacity).toBeGreaterThan(0)
  expect(leaving.opacity).toBeLessThan(1)
  expect(leaving.scale).toBeGreaterThan(1)
  await profile(page).hover()
  await rows.evaluate(el => el.getAnimations().forEach(animation => animation.finish()))
  await expect(lens(page)).toHaveCount(1)
  await page.keyboard.press('ArrowDown')
  await expect(lens(page)).toHaveCount(0)
  await expect(profile(page)).toBeFocused()
})

async function open(page: Page, role = 'client', pilot = false) {
  await page.goto(`/?view=${role}-orders${pilot ? '&accountLens=pilot' : ''}`)
  await page.evaluate(() => document.fonts.ready)
  await trigger(page).click()
  await expect(menu(page)).toBeVisible()
  await menu(page).evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)))
}

test('accepted Account hover works on ordinary and former pilot URLs', async ({ page }, info) => {
  for (const role of ['client', 'manager']) for (const formerFlag of [false, true]) {
    await open(page, role, formerFlag)
    if (!info.project.use.hasTouch) { await profile(page).hover(); await expect(lens(page)).toHaveCount(1) }
    else await expect(lens(page)).toHaveCount(0)
    await expect(menu(page)).toHaveAttribute('data-hover-preview', 'v0.3')
    await expect(menu(page).getByRole('menuitem', { name: 'Настройки компании' })).toHaveAttribute('aria-disabled', 'true')
  }
})

for (const role of ['client', 'manager']) test(`pointer preview ${role}: one lens, no action, disabled and leave reset optics at five widths`, async ({ page }, info) => {
  test.skip(info.project.use.hasTouch === true, 'Real touch is checked separately; no mandatory hover')
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await open(page, role)
    await expect(lens(page)).toHaveCount(0)
    const focused = await page.evaluateHandle(() => document.activeElement)
    await profile(page).hover()
    await expect(lens(page)).toHaveCount(1)
    await expect(menu(page)).toHaveAttribute('data-hover-preview', 'v0.3')
    expect(await focused.evaluate(node => node === document.activeElement)).toBe(true)
    await expect(page.getByRole('heading', { level: 1, name: 'Настройки профиля', exact: true })).toHaveCount(0)
    await expect.poll(() => label(page).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeCloseTo(1.043, 4)
    await expect.poll(() => menu(page).locator('.fos-popup-rows').evaluate(el => el.getAnimations().length)).toBe(0)
    const scale = await label(page).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)
    expect(scale).toBeLessThanOrEqual(1.044)
    const box = (await menu(page).boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(15)
    expect(box.x + box.width).toBeLessThanOrEqual(width - 15)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const captureEvents = await page.evaluateHandle(() => {
      const events: unknown[] = []
      const media = matchMedia('(max-width: 1023px)')
      media.addEventListener('change', event => events.push({ kind: 'compact', matches: event.matches, width: innerWidth }))
      addEventListener('resize', () => events.push({ kind: 'resize', width: innerWidth, height: innerHeight }))
      document.addEventListener('focusin', event => events.push({ kind: 'focusin', target: (event.target as Element)?.getAttribute('data-testid'), role: (event.target as Element)?.getAttribute('role') }), true)
      document.addEventListener('keydown', event => events.push({ kind: 'key', key: event.key }), true)
      return events
    })
    // A fixed popup must be captured in its actual viewport. Chromium's fullPage
    // path transiently resized this page to 1x1, remounting AppShell's trigger.
    await page.screenshot({ path: info.outputPath(`${role}-${width}-preview.png`), fullPage: false })
    const observedCapture = await captureEvents.jsonValue()
    await info.attach('capture-events', { body: JSON.stringify(observedCapture), contentType: 'application/json' })
    expect(await menu(page).count(), JSON.stringify(observedCapture)).toBe(1)
    await captureEvents.dispose()
    await menu(page).getByRole('menuitem', { name: 'Настройки компании', exact: true }).hover()
    await expect(lens(page)).toHaveCount(0)
    await expect.poll(() => label(page).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBe(1)
    await profile(page).hover()
    await expect(lens(page)).toHaveCount(1)
    await menu(page).locator('.fos-account-menu__identity').hover()
    await expect(lens(page)).toHaveCount(0)
    await expect.poll(() => label(page).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBe(1)
    await focused.dispose()
  }
})

test('keyboard clears pointer preview, keeps outline and activates without waiting for motion', async ({ page }, info) => {
  for (const key of ['Enter', 'Space']) {
    await open(page)
    if (!info.project.use.hasTouch) { await profile(page).hover(); await expect(lens(page)).toHaveCount(1) }
    await page.keyboard.press('ArrowDown')
    await expect(profile(page)).toBeFocused()
    await expect(lens(page)).toHaveCount(0)
    await expect(profile(page)).toHaveCSS('outline-width', '2px')
    await page.keyboard.press(key)
    await expect(page.getByRole('heading', { level: 1, name: 'Настройки профиля', exact: true })).toHaveCount(1)
    const name = page.getByLabel('Имя пользователя', { exact: true })
    await expect(name).toBeVisible()
    await name.focus()
    await expect(menu(page)).toHaveCount(0)
    await expect(name).toBeFocused()
  }
})

test('rapid hover, Escape, outside and reopening leave no stale preview or enlarged label', async ({ page }, info) => {
  test.skip(info.project.use.hasTouch === true, 'Pointer lifecycle; touch has its own flow')
  await open(page)
  for (let i = 0; i < 4; i++) {
    await profile(page).hover()
    await expect(lens(page)).toHaveCount(1)
    await page.mouse.move(700, 400)
    await expect(lens(page)).toHaveCount(0)
    await expect.poll(() => label(page).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBe(1)
  }
  await profile(page).hover()
  await page.keyboard.press('Escape')
  await expect(trigger(page)).toBeFocused()
  await trigger(page).click()
  await expect(lens(page)).toHaveCount(0)
  await expect.poll(() => label(page).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBe(1)
  await profile(page).hover()
  await page.mouse.click(700, 400)
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false')
  await trigger(page).click()
  await expect(lens(page)).toHaveCount(0)
  await profile(page).hover()
  await profile(page).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Настройки профиля', exact: true })).toHaveCount(1)
})

test('touch opens both profiles directly and never needs a hover state', async ({ page }, info) => {
  test.skip(info.project.use.hasTouch !== true, 'Requires genuine touch-enabled context')
  for (const role of ['client', 'manager']) for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 600 })
    await page.goto(`/?view=${role}-orders&accountLens=pilot`)
    await trigger(page).tap()
    await expect(lens(page)).toHaveCount(0)
    await profile(page).dispatchEvent('pointermove', { pointerType: 'touch', buttons: 0 })
    await expect(lens(page)).toHaveCount(0)
    await profile(page).tap()
    await expect(page.getByRole('heading', { level: 1, name: 'Настройки профиля', exact: true })).toBeVisible()
  }
})

for (const fallback of ['reduced-motion', 'forced-colors']) test(`pilot preserves ${fallback} and accessible action semantics`, async ({ page, browserName }, info) => {
  test.skip(info.project.use.hasTouch === true || (fallback === 'forced-colors' && browserName !== 'chromium'), 'Pointer fallback on supported browser')
  await page.emulateMedia(fallback === 'reduced-motion' ? { reducedMotion: 'reduce' } : { forcedColors: 'active' })
  await open(page)
  await profile(page).hover()
  await expect(lens(page)).toHaveCount(1)
  await expect(label(page)).toHaveCSS('transform', 'none')
  await page.keyboard.press('ArrowDown')
  await expect(lens(page)).toHaveCount(0)
  await expect(profile(page)).toBeFocused()
  const fingerprint = (violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) => violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(node => node.target) }))
  const pilot = (await new AxeBuilder({ page }).analyze()).violations
  await info.attach('pilot-axe', { body: JSON.stringify(pilot), contentType: 'application/json' })
  await open(page, 'client', false)
  await page.keyboard.press('ArrowDown')
  await expect(profile(page)).toBeFocused()
  const reference = (await new AxeBuilder({ page }).analyze()).violations
  await info.attach('reference-axe', { body: JSON.stringify(reference), contentType: 'application/json' })
  expect(fingerprint(pilot)).toEqual(fingerprint(reference))
})
