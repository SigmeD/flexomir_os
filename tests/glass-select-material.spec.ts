import { expect, test } from '@playwright/test'

test('shared popup surface frosts real DOM and keeps foreground labels sharp', async ({ page }, testInfo) => {
  await page.goto('/?view=glass-filter-lab')
  await page.getByTestId('filter-control').locator('button').click()
  const popup = page.getByRole('listbox')
  await expect(popup).toHaveCSS('opacity', '1')
  const displacement = popup.locator('feDisplacementMap')
  await expect(displacement).toHaveCount(2) // common shell and exactly one selection lens
  await expect(popup.locator('[data-motion="travel"]')).toHaveCount(1)
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('.order-row')).toHaveCount(5)
  await page.mouse.move(0, 0)
  await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)))
  const surface = popup.locator('.glass-select-material')
  const original = await surface.evaluate(el => getComputedStyle(el).backdropFilter)
  expect(original).toBe('blur(20px)')
  const withBlur = await popup.screenshot({ animations: 'disabled' })
  await surface.evaluate(el => {
    const style = (el as HTMLElement).style
    style.backdropFilter = 'none'
    style.setProperty('-webkit-backdrop-filter', 'none')
  })
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const withoutBlur = await popup.screenshot({ animations: 'disabled' })
  await surface.evaluate((el, value) => {
    const style = (el as HTMLElement).style
    style.backdropFilter = value
    style.setProperty('-webkit-backdrop-filter', value)
  }, original)
  await testInfo.attach('native-lens-without-blur', { body: withoutBlur, contentType: 'image/png' })
  await testInfo.attach('shared-popup-frosted', { body: withBlur, contentType: 'image/png' })
  await testInfo.attach('shared-popup-without-blur', { body: withoutBlur, contentType: 'image/png' })
  expect(withBlur.equals(withoutBlur), 'real backdrop pixels must change when frosted blur is disabled').toBe(false)
  const foreground = popup.locator('.glass-select-viewport')
  expect(await foreground.evaluate(el => Number(getComputedStyle(el).zIndex))).toBeGreaterThan(0)
})
