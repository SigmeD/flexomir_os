import { expect, test } from '@playwright/test'

test('reference New Item uses shared Header Add/More, FOS fields, segmented and no footer substitutes', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  const form = page.getByTestId('order-item-form')
  await expect(form.getByRole('heading', { level: 1, name: 'Новая позиция', exact: true })).toBeVisible()
  await expect(form.locator('.fos-page-header [data-action=add]')).toBeDisabled()
  await expect(form.getByRole('button', { name: 'Ещё', exact: true })).toBeVisible()
  await expect(form.locator('.fos-field')).toHaveCount(7)
  await expect(form.locator('.fos-segmented')).toBeVisible()
  await expect(form.getByRole('button', { name: /Восстановить значения|Закрыть форму позиции|Сохранить позицию/ })).toHaveCount(0)
})

test('reference New Item responsive geometry and screenshots', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 975 })
    await page.goto('/?view=client-orders')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    await page.evaluate(() => document.fonts.ready)
    const form = page.getByTestId('order-item-form')
    const fields = await form.locator('.fos-item-form__fields').boundingBox()
    expect(Math.round(fields!.x)).toBe(width >= 1024 ? 295 : 20)
    expect(Math.round(fields!.y)).toBe(width >= 1024 ? 152 : 178)
    await expect(form.getByRole('heading', { name: 'Новая позиция' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: 'output/fe-s02-parity/react-new-item-' + width + '.png', fullPage: true })
  }
})
