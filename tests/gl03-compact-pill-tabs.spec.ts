import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'

const html = readFileSync(
  new URL('../prototypes/GL03_Compact_Pill_Tabs_Candidate_2026-11-04.html', import.meta.url),
  'utf8',
)
test.beforeEach(async ({ page }) => {
  // No real backend, routes or 1C in this isolated HTML concept.
  await page.setContent(html, { waitUntil: 'load' })
})

test('one neutral Glass-like pill; 5 dynamic filters, accessible hit targets', async ({ page }) => {
  await expect(page.locator('.pill-lens')).toHaveCount(1)
  await expect(page.locator('.pill-tab')).toHaveCount(5)
  await expect(page.locator('.pill-tab[aria-pressed="true"]')).toHaveCount(1)
  await expect(page.locator('select')).toHaveCount(0)
  for (const tab of await page.locator('.pill-tab').all()) await expect(tab).toHaveCSS('height', '44px')
  await expect(page.getByTestId('pill-lens')).toHaveCSS('height', '38px')
})

test('responsive D1440/L1024/T768/M390/M320; no page horizontal overflow', async ({ page }, testInfo) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('.pill-tab')).toHaveCount(5)
    if (width <= 390) {
      expect(await page.evaluate(() => {
        const el = document.querySelector('#scroller')!
        return el.scrollWidth > el.clientWidth
      })).toBe(true)
    }
    await page.screenshot({
      path: testInfo.outputPath('gl03-' + width + '.png'),
      fullPage: false,
      animations: 'disabled',
    })
  }
})

test('hover only changes color; click moves a single lens and filters orders', async ({ page }) => {
  await page.getByTestId('pill-review').hover()
  await expect(page.getByTestId('pill-all')).toHaveAttribute('aria-pressed', 'true')
  await page.getByTestId('pill-review').click()
  await expect(page.getByTestId('pill-review')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#selected-label')).toHaveText('На рассмотрении')
  await expect(page.locator('#order-count')).toContainText('1 из 6')
  await expect.poll(() => page.getByTestId('pill-lens').getAttribute('data-moving'), {
    timeout: 3000,
  }).toBe('false')
  const delta = await page.evaluate(() => {
    const lens = document.querySelector('#lens') as HTMLElement
    const selected = document.querySelector('[data-testid="pill-review"]') as HTMLElement
    return Math.abs(parseFloat(lens.style.getPropertyValue('--lens-x')) - selected.offsetLeft) +
      Math.abs(parseFloat(lens.style.width) - selected.offsetWidth)
  })
  expect(delta).toBeLessThan(1)
})

test('add/remove stress: active removal fallback, reveal last filter', async ({ page }) => {
  await page.getByTestId('add-filter').click()
  await page.locator('.pill-tab').last().click()
  await expect(page.locator('#selected-label')).toHaveText('Демо-этап 1')
  await page.getByTestId('remove-filter').click()
  await expect(page.locator('#selected-label')).toHaveText('Все заказы')
  for (let i = 0; i < 7; i++) await page.getByTestId('add-filter').click()
  await expect(page.locator('.pill-tab')).toHaveCount(12)
  await expect(page.getByTestId('add-filter')).toBeDisabled()
  await page.locator('.pill-tab').last().click()
  await expect.poll(() => page.evaluate(() => {
    const rail = document.querySelector('#scroller') as HTMLElement
    const active = document.querySelector('.pill-tab[aria-pressed="true"]') as HTMLElement
    return active.offsetLeft + active.offsetWidth <= rail.scrollLeft + rail.clientWidth + 2
  })).toBe(true)
})

test('keyboard focus is separate from selection; reduced motion snaps', async ({ page }) => {
  await page.getByTestId('pill-all').focus()
  await page.keyboard.press('End')
  await expect(page.getByTestId('pill-done')).toBeFocused()
  await expect(page.getByTestId('pill-all')).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('pill-done')).toHaveAttribute('aria-pressed', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByTestId('pill-work').click()
  await expect(page.getByTestId('pill-lens')).toHaveAttribute('data-moving', 'false')
})

test('physical touch input events scroll without activating a filter', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  try {
    await page.setContent(html)
    const box = await page.locator('#scroller').boundingBox()
    if (!box) throw new Error('Scroller missing')
    const x1 = box.x + box.width - 30, x2 = box.x + 32, y = box.y + box.height / 2
    const cdp = await context.newCDPSession(page)
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y, id: 1 }] })
    for (let i = 1; i <= 14; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove', touchPoints: [{ x: x1 + (x2 - x1) * i / 14, y, id: 1 }],
      })
      await page.waitForTimeout(19)
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(() => page.evaluate(() => document.querySelector('#scroller')!.scrollLeft)).toBeGreaterThan(100)
    await expect(page.getByTestId('pill-all')).toHaveAttribute('aria-pressed', 'true')
  } finally {
    await context.close()
  }
})
