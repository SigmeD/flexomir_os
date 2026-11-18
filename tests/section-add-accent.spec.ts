import { expect, test } from '@playwright/test'

for (const role of ['client', 'manager'] as const) {
  test(`${role} uses one turquoise lens for product and signed-file add controls`, async ({ page }, info) => {
    await page.goto(`/?view=${role}-orders`)
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()

    for (const selector of ['[data-add-item]', '[data-add-file]']) {
      const button = page.locator(`.fos-order-composer__body ${selector}`).first()
      await expect(button).toHaveAttribute('data-appearance', 'accent-lens')
      await expect(button).toHaveCSS('width', '44px')
      await expect(button).toHaveCSS('height', '44px')
      await expect(button.locator('.fos-action__glass')).toHaveCSS('width', '34px')
      await expect(button.locator('.fos-glass-material')).toHaveCount(1)
      await expect(button.locator('.fos-section-add__glyph')).toHaveCSS('color', 'rgb(255, 255, 255)')
      expect(await button.locator('.fos-action__glass').evaluate(node => getComputedStyle(node, '::after').backgroundColor)).toBe('rgb(70, 193, 206)')
      await button.screenshot({ path: info.outputPath(`${selector === '[data-add-item]' ? 'product' : 'file'}-add.png`) })
    }

    const fileButton = page.locator('.fos-order-composer__body [data-add-file]').first()
    await fileButton.focus()
    await page.keyboard.down('Space')
    await expect(fileButton).toHaveAttribute('data-pressed', 'true')
    await expect.poll(() => fileButton.locator('.fos-action__glass').evaluate(node => getComputedStyle(node, '::after').backgroundColor)).toBe('rgb(36, 150, 164)')
    await page.keyboard.up('Space')
    await expect(fileButton).toHaveAttribute('data-feedback', 'true')

    await page.setViewportSize({ width: 320, height: 800 })
    await expect(fileButton).toHaveCSS('width', '44px')
    await expect(fileButton.locator('.fos-action__glass')).toHaveCSS('width', '34px')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test('small add lens remains readable in forced colors', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  const button = page.locator('.fos-order-composer__body [data-add-item]').first()
  await expect(button).toHaveAttribute('data-appearance', 'accent-lens')
  expect(await button.locator('.fos-action__glass').evaluate(node => getComputedStyle(node, '::after').display)).toBe('none')
  await expect(button.locator('.fos-section-add__glyph')).toHaveCSS('color', await button.evaluate(node => getComputedStyle(node).color))
})
