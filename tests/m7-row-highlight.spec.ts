import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const rows = [
  ['client-orders', '[data-order-open="DEMO-003"]'],
  ['manager-orders', '[data-order-open="DEMO-003"]'],
  ['manager-companies', '[data-testid="company-row-company-01"]'],
  ['client-layouts', '[data-testid="layout-row-demo-layout-01"]'],
  ['client-support', '[data-testid="ticket-row-client-01"]'],
  ['manager-support', '[data-testid="ticket-row-manager-01"]'],
] as const

for (const width of [1440, 1024, 768, 390, 320]) test(`all row highlights match the Orders reference ${width}`, async ({ page }, info) => {
  await page.setViewportSize({ width, height:900 })
  const samples = []
  for (const [route, selector] of rows) {
    await page.goto('/?view=' + route)
    await page.evaluate(() => document.fonts.ready)
    const row = page.locator(selector).filter({ visible:true }).first()
    await expect(row).toBeVisible()
    const before = await row.boundingBox()
    const styles = () => row.evaluate(n => {
      const s=getComputedStyle(n)
      return { background:s.backgroundColor, border:s.borderColor, shadow:s.boxShadow, outline:s.outlineStyle }
    })
    await row.hover()
    const hover = await styles()
    await row.screenshot({ path:info.outputPath(`${route}-${width}-hover.png`) })
    await page.mouse.down()
    const pressed = await styles()
    // Release outside the row so this presentation test never navigates.
    await page.mouse.move(0,0); await page.mouse.up()
    await row.focus()
    await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab')
    await expect(row).toBeFocused()
    const focused = await styles()
    expect(await row.boundingBox(), route + ' state must not shift bounds').toEqual(before)
    samples.push({ route, hover, pressed, focused })
    if (samples.length > 1) {
      expect.soft(hover, route + ' hover').toEqual(samples[0].hover)
      expect.soft(pressed, route + ' pressed').toEqual(samples[0].pressed)
      expect.soft(focused, route + ' focus').toEqual(samples[0].focused)
    }
  }
  await info.attach('computed-highlights', { body:JSON.stringify(samples,null,2), contentType:'application/json' })
})

test('one hover role reaches all consumers and excludes disabled/static rows', async ({ page }) => {
  for (const [route, selector] of rows) {
    await page.goto('/?view=' + route)
    const row = page.locator(selector).filter({ visible:true }).first()
    await page.evaluate(() => document.documentElement.style.setProperty('--fos-row-hover-background','rgb(230, 240, 250)'))
    await row.hover()
    expect.soft(await row.evaluate(n => getComputedStyle(n).backgroundColor), route).toBe('rgb(230, 240, 250)')
    await row.evaluate(n => { (n as HTMLButtonElement).disabled = true })
    await expect(row).toHaveCSS('box-shadow','none')
    await expect(row).toHaveCSS('background-color','rgb(255, 255, 255)')
    await page.evaluate(() => document.documentElement.style.removeProperty('--fos-row-hover-background'))
  }
  await page.goto('/tests/fixtures/summary-row.html')
  const row = page.locator('[data-summary-row="static"]')
  await row.hover()
  await expect(row).toHaveCSS('box-shadow','none')
})

test('highlight has no second surface-specific implementation', () => {
  const css=readFileSync('src/components/ui/fos-summary-row.css','utf8')
  expect(css).not.toMatch(/data-row-surface[^{}]*:(?:hover|active|focus-visible)/)
  expect(css).not.toContain('--fos-row-card-hover-')
})
