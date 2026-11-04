import { expect, test } from '@playwright/test'

test('one Website Glass lens refracts real DOM and keeps foreground labels sharp', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.getByTestId('filter-control').locator('button').click()
  const popup = page.getByRole('listbox')
  await expect(popup).toHaveCSS('opacity', '1')
  const displacement = popup.locator('feDisplacementMap')
  await expect(displacement).toHaveCount(1)
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('.order-row')).toHaveCount(5)
  const filters = await popup.locator('[aria-hidden]').evaluateAll(nodes => nodes.map(el => getComputedStyle(el).backdropFilter))
  expect(filters.filter(value => value.includes('url('))).toHaveLength(1)
  expect(filters.find(value => value.includes('url('))).toContain('blur(3px)')
  await page.mouse.move(0, 0)
  await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)))
  const withLens = await popup.screenshot({ animations: 'disabled' })
  const scale = await displacement.getAttribute('scale')
  await displacement.evaluate(el => el.setAttribute('scale', '0'))
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const withoutLens = await popup.screenshot({ animations: 'disabled' })
  await displacement.evaluate((el, value) => el.setAttribute('scale', value!), scale)
  await testInfo.attach('native-lens-on', { body: withLens, contentType: 'image/png' })
  await testInfo.attach('native-lens-zero-displacement', { body: withoutLens, contentType: 'image/png' })
  expect(withLens.equals(withoutLens), 'real backdrop pixels must change when displacement is disabled').toBe(false)
  const opticalLayer = popup.locator('.glass-select-material > div[aria-hidden][style*="backdrop-filter"]')
  const original = await opticalLayer.evaluate(el => (el as HTMLElement).style.backdropFilter)
  await opticalLayer.evaluate(el => {
    const style = (el as HTMLElement).style
    const clear = style.backdropFilter.replace(/blur\([^)]+\)/, '')
    style.backdropFilter = clear
    style.setProperty('-webkit-backdrop-filter', clear)
  })
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const withoutBlur = await popup.screenshot({ animations: 'disabled' })
  await opticalLayer.evaluate((el, value) => {
    const style = (el as HTMLElement).style
    style.backdropFilter = value
    style.setProperty('-webkit-backdrop-filter', value)
  }, original)
  await testInfo.attach('native-lens-without-blur', { body: withoutBlur, contentType: 'image/png' })
  expect(withLens.equals(withoutBlur), 'real backdrop pixels must change when frosted blur is disabled').toBe(false)
  const foreground = popup.locator('.glass-select-viewport')
  expect(await foreground.evaluate(el => Number(getComputedStyle(el).zIndex))).toBeGreaterThan(0)
})
