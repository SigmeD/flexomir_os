import { test, expect } from '@playwright/test'

for (const contactMs of [180, 1800]) test(`one action contact profile reaches Header/Plus/Secondary: ${contactMs}ms`, async ({ page }) => {
  let profileRequests = 0
  await page.route('**/src/components/ui/action-press-profile.ts', async route => {
    const response = await route.fetch()
    const source = await response.text()
    expect(source).toMatch(/ACTION_PRESS_CONTACT_MS = 180\b/)
    profileRequests++
    // Override only this shared module in the isolated test context. No product
    // knobs, frozen source edits or per-consumer overrides are introduced.
    await route.fulfill({ response, body: source.replace(/ACTION_PRESS_CONTACT_MS = 180\b/, `ACTION_PRESS_CONTACT_MS = ${contactMs}`) })
  })
  await page.clock.install()
  await page.goto('/?view=neutral-actions')
  await page.emulateMedia({ reducedMotion:'no-preference' })
  const host = page.getByTestId('neutral-paper')
  await expect(host.getByTestId('neutral-plus').locator('[data-fos-glass-material]')).toHaveAttribute('data-material-ready', 'true')
  await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 1000))
  for (const id of ['neutral-header', 'neutral-plus', 'neutral-secondary']) {
    const button = host.getByTestId(id)
    await button.focus()
    await page.keyboard.down('Enter')
    await page.clock.runFor(50)
    await page.keyboard.up('Enter')
    await page.clock.runFor(800)
    const scale = await button.locator('[data-action-surface]').evaluate(n => {
      const transform = getComputedStyle(n).transform
      return transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).m22
    })
    if (contactMs === 180) expect(scale, id).toBeGreaterThan(.999)
    else expect(scale, id).toBeLessThan(.98)
    await page.clock.runFor(2600)
    await expect(button).toHaveAttribute('data-surface-active', 'false')
  }
  expect(profileRequests).toBe(1)
  await expect(host.getByTestId('neutral-count')).toHaveText('Нажатий: 3')
  await expect(host.getByTestId('neutral-disabled')).toBeDisabled()
})
