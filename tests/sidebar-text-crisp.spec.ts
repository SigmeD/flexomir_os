import { expect, test } from '@playwright/test'

for (const role of ['client', 'manager'] as const) {
  test(`${role} renders the selected sidebar label sharply on the first navigation`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`/?view=${role}-orders`)
    await page.evaluate(() => document.fonts.ready)
    const nav = page.getByRole('navigation', { name: role === 'client' ? 'Навигация клиента' : 'Навигация менеджера', exact: true })
    const button = nav.getByTestId('sidebar-nav-support')
    const before = await button.boundingBox()
    await button.click()
    const label = nav.getByTestId('sidebar-nav-support').locator('.fos-sidebar-nav__label')
    await expect(nav.getByTestId('sidebar-nav-support')).toHaveAttribute('aria-current', 'page')
    await expect.poll(() => label.evaluate(node => Number.parseFloat(node.style.getPropertyValue('--fos-sidebar-label-scale')))).toBeGreaterThan(1.01)
    await expect(label).toHaveCSS('transform', 'none')
    await expect.poll(() => label.evaluate(node => Number.parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThan(14.1)
    expect(await nav.getByTestId('sidebar-nav-support').boundingBox()).toEqual(before)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(label).toHaveCSS('font-size', '14px')
    await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' })
    await expect(label).toHaveCSS('font-size', '14px')
  })
}
