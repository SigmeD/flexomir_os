import { expect, test } from '@playwright/test'

test('shared FOS masters: stateful fields, segmented, overflow and all primary glyphs', async ({ page }, testInfo) => {
  await page.goto('/?view=orders-components')
  await expect(page.getByTestId('orders-components-lab')).toBeVisible()
  await expect(page.getByLabel('Ошибка поля', { exact: true })).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByLabel('Только чтение', { exact: true })).toHaveAttribute('readonly', '')
  await page.getByRole('radio', { name: 'Флексопечать', exact: true }).check()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('radio', { name: 'Цифровая печать', exact: true })).toBeChecked()
  await page.getByRole('button', { name: 'Ещё', exact: true }).click()
  await expect(page.getByRole('menuitem', { name: 'Недоступное действие', exact: true })).toHaveAttribute('aria-disabled', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Ещё', exact: true })).toBeFocused()
  for (const action of ['Сохранить', 'Отправить', 'Изменить']) {
    const button = page.getByRole('button', { name: action, exact: true })
    await expect(button.locator('.fos-ha__circle')).toHaveCount(1)
    await expect(button.locator('img')).toHaveCount(1)
  }
  await expect(page.locator('input[type=file]')).toBeHidden()
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: testInfo.outputPath('fes02-components-' + width + '.png'), fullPage: true, animations: 'disabled' })
  }
})
