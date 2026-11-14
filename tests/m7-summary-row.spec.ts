import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const consumers = [
  ['manager-companies', '[data-testid="company-row-company-01"]', 80],
  ['client-orders', '[data-order-open="DEMO-003"]', 92],
  ['manager-orders', '[data-order-open="DEMO-003"]', 92],
  ['client-layouts', '[data-testid="layout-row-demo-layout-01"]', 92],
  ['client-support', '[data-testid="ticket-row-client-01"]', 92],
  ['manager-support', '[data-testid="ticket-row-manager-01"]', 92],
] as const

test('migrated adapters and CSS retain one presentation owner', () => {
  for (const adapter of ['companies/CompanyRow', 'orders/OrderCard', 'layouts/LayoutRow', 'support/SupportTicketRow']) {
    const source = readFileSync(`src/components/${adapter}.tsx`, 'utf8')
    expect(source, adapter).toContain("from '@/components/ui/fos-summary-row'")
    expect(source, adapter).not.toContain('FosButtonRoot')
  }
  for (const file of ['companies/companies.css', 'layouts/layouts.css', 'support/support.css']) {
    const css = readFileSync(`src/components/${file}`, 'utf8')
    expect(css, file).not.toMatch(/\.fos-(?:company|layout|support)-row[^{}]*\{/)
  }
  expect(readFileSync('src/components/orders/order-card.css', 'utf8')).not.toMatch(/\.fos-order-card__(?:open|content|number|meta)[^{}]*\{/)
})

for (const width of [1440, 1024, 768, 390, 320]) test(`shared row source preserves bounds and propagates spacing ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  for (const [route, selector, wideHeight] of consumers) {
    await page.goto('/?view=' + route)
    await page.evaluate(() => document.fonts.ready)
    const row = page.locator(selector).filter({ visible: true }).first()
    await expect(row).toBeVisible()
    expect.soft(await row.getAttribute('data-summary-row'), route).toBe('interactive')
    expect((await row.boundingBox())!.height, route).toBe(width <= 600 && wideHeight === 92 ? 104 : wideHeight)
    // One CSS source owns the row/copy layout; adapters do not compensate locally.
    await page.evaluate(() => document.documentElement.style.setProperty('--fos-row-copy-gap', '7px'))
    expect.soft(await row.locator('.fos-summary-row__copy').count(), route).toBe(1)
    if (await row.locator('.fos-summary-row__copy').count()) await expect(row.locator('.fos-summary-row__copy')).toHaveCSS('gap', '7px')
    await page.evaluate(() => document.documentElement.style.removeProperty('--fos-row-copy-gap'))
    expect(await row.locator('button,a,input,select,textarea').count()).toBe(0)
    expect(await row.getAttribute('data-fos-button')).toBe('row')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('static order summary stays non-interactive while sharing the presentation owner', async ({ page }) => {
  await page.goto('/tests/fixtures/summary-row.html')
  const row = page.locator('.fos-order-card__open:not(button)').first()
  await expect(row).toBeVisible()
  await expect(row).toHaveAttribute('data-summary-row', 'static')
  expect(await row.getAttribute('role')).toBeNull()
  expect(await row.getAttribute('tabindex')).toBeNull()
  expect(await row.locator('button,a').count()).toBe(0)
})
