import { expect, test } from '@playwright/test'

test('light Select closed, open and keyboard focus match reviewed screenshots', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  const trigger = page.getByTestId('filter-control').locator('button')
  await expect(trigger).toContainText('Все заказы')
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('select-light-closed.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
  await trigger.click()
  await expect(page.getByRole('listbox')).toHaveCSS('opacity', '1')
  await expect(page.locator('feDisplacementMap')).toHaveCount(2) // static shell + one moving lens
  await expect(page.getByRole('listbox').locator('[data-motion="travel"]')).toHaveCount(1)
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('select-light-open.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveCSS('outline-style', 'solid')
  await expect(page).toHaveScreenshot('select-light-focus.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
})

test('dark component palette matches reviewed closed and open screenshots', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark' })
  const trigger = page.getByTestId('filter-control').locator('button')
  await expect(trigger).toHaveCSS('color-scheme', 'dark')
  await expect(trigger).toContainText('Все заказы')
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('select-dark-closed.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
  await trigger.click()
  await expect(page.getByRole('listbox')).toHaveCSS('opacity', '1')
  await expect(page.locator('feDisplacementMap')).toHaveCount(2)
  await expect(page.getByRole('listbox').locator('[data-motion="travel"]')).toHaveCount(1)
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('select-dark-open.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
})

test('visual negative control rejects a return to unreadable white text', async ({ page }, testInfo) => {
  await page.goto('/?view=glass-filter-lab')
  await expect(page.getByTestId('filter-control').locator('button')).toContainText('Все заказы')
  // This mutation exists only in this isolated browser context, never in application CSS.
  await page.addStyleTag({ content: ':root { --gs-foreground: #fff; }' })
  await page.mouse.move(0, 0)
  await expect(page).not.toHaveScreenshot('select-light-closed.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
  await testInfo.attach('negative-control-white-text', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
})

test('matte 97 preview matches reviewed closed and open screenshots', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab&glass=matte')
  const trigger = page.getByTestId('filter-control').locator('button')
  await expect(trigger).toContainText('Все заказы')
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('select-matte-97-closed.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
  await trigger.click()
  await expect(page.getByRole('listbox')).toHaveCSS('opacity', '1')
  await expect(page.locator('feDisplacementMap')).toHaveCount(2)
  await expect(page.getByRole('listbox').locator('[data-motion="travel"]')).toHaveCount(1)
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('select-matte-97-open.png', { fullPage: true, animations: 'disabled', maxDiffPixels: 40, threshold: 0.15 })
})

test('closed Select has no moving optics after selection, reopening or keyboard close', async ({ page }) => {
  for (const theme of ['light', 'dark', 'matte']) {
    await page.goto('/?view=glass-filter-lab' + (theme === 'matte' ? '&glass=matte' : ''))
    if (theme === 'dark') await page.evaluate(() => { document.documentElement.dataset.theme = 'dark' })
    const trigger = page.getByTestId('filter-control').getByRole('button')
    const popup = page.locator('.glass-select-material')
    const assertClosed = async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
      await expect(popup).toHaveAttribute('data-state', 'closed')
      await expect(page.locator('[data-glass-select-content]')).toHaveAttribute('aria-hidden', 'true')
      await expect(page.locator('[data-glass-select-content]')).toHaveAttribute('inert', '')
      await expect(popup.locator('[data-motion="travel"]')).toHaveCount(0)
    }
    await assertClosed()
    await trigger.click()
    await expect(popup.locator('[data-motion="travel"]')).toHaveCount(1)
    await page.getByRole('option', { name: 'Черновики', exact: true }).click()
    await expect(trigger).toContainText('Черновики')
    await assertClosed()
    await trigger.click()
    await expect(page.getByRole('option', { name: 'Черновики', exact: true })).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('Escape')
    await assertClosed()
    await expect(trigger).toBeFocused()
  }
})

test('visual negative control rejects the obsolete hidden moving lens', async ({ page }, info) => {
  await page.goto('/?view=glass-filter-lab')
  const trigger = page.getByTestId('filter-control').getByRole('button')
  await trigger.click()
  const lens = page.locator('.glass-select-material [data-motion="travel"]')
  await expect(lens).toHaveAttribute('data-material-ready', 'true')
  const obsoleteLens = await lens.evaluate(node => node.outerHTML)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(lens).toHaveCount(0)
  await page.mouse.move(0, 0)
  const comparison = { fullPage:true, animations:'disabled' as const, maxDiffPixels:40, threshold:0.15 }
  await expect(page).toHaveScreenshot('select-light-focus.png', comparison)
  // Only this isolated browser DOM is mutated. Restoring old closed optics
  // changes text rasterization despite unchanged control geometry and fonts.
  await page.locator('.fos-popup-rows').evaluate((node, html) => node.insertAdjacentHTML('afterbegin', html), obsoleteLens)
  await expect(lens).toHaveCount(1)
  await expect(page).not.toHaveScreenshot('select-light-focus.png', comparison)
  await info.attach('obsolete-closed-optics', { body:await page.screenshot({ fullPage:true }), contentType:'image/png' })
})
