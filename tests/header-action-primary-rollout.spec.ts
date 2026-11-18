import { expect, test, type Locator } from '@playwright/test'
import { chooseMore } from './helpers/orders'

async function expectPrimaryLens(action: Locator) {
  await expect(action).toHaveAttribute('data-appearance', 'primary-lens')
  await expect(action.locator('[data-action-surface]')).toHaveCount(1)
  const circle = action.locator('.fos-ha__circle')
  expect(await circle.boundingBox()).toMatchObject({ width: 48, height: 48 })
  expect(await circle.evaluate(node => getComputedStyle(node, '::before').backgroundColor)).toBe('rgb(2, 53, 127)')
}

for (const role of ['client', 'manager'] as const) {
  test(`${role} order list, editor and item use the same lens`, async ({ page }) => {
    await page.goto(`/?view=${role}-orders&fixture=item-actions-review`)
    const addOrder = page.getByRole('button', { name: 'Добавить заказ', exact: true })
    await expectPrimaryLens(addOrder)
    await expect(addOrder.locator('.fos-ha__plus')).toHaveCSS('color', 'rgb(255, 255, 255)')

    await page.getByRole('button', { name: 'Открыть заказ DEMO-REVIEW-001' }).click()
    await chooseMore(page, 'Изменить')
    const action = page.getByRole('button', { name: role === 'client' ? 'Сохранить заказ' : 'Отправить заказ', exact: true })
    await expectPrimaryLens(action)
    await expect(action).toBeDisabled()
    await expect(action.locator('.fos-ha__glyph-mask')).toHaveCSS('background-color', 'rgb(255, 255, 255)')

    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      const actionBox = await action.boundingBox()
      const moreBox = await page.getByRole('button', { name: 'Ещё', exact: true }).boundingBox()
      if (!actionBox || !moreBox) throw new Error('Order header action is missing')
      expect(actionBox.x + actionBox.width <= moreBox.x || moreBox.x + moreBox.width <= actionBox.x).toBe(true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.getByRole('button', { name: 'Изменить позицию 1' }).click()
    await page.getByLabel('Количество', { exact: true }).fill('700')
    const itemSave = page.getByTestId('order-item-form').locator('.fos-page-header [data-action=save]')
    await expectPrimaryLens(itemSave)
    await itemSave.click()
    await expect(action).toBeEnabled()
    await expectPrimaryLens(action)
  })
}

const screenActions = [
  ['/?view=client-support', 'Добавить обращение'],
  ['/?view=manager-support', 'Добавить обращение'],
  ['/?view=client-layouts', 'Добавить макет'],
  ['/?view=manager-companies', 'Добавить компанию'],
] as const

for (const [route, name] of screenActions) {
  test(`${name} at ${route} uses the shared lens`, async ({ page }) => {
    await page.goto(route)
    const action = page.getByRole('button', { name, exact: true })
    await expectPrimaryLens(action)
    await expect(action.locator('.fos-ha__plus')).toHaveCSS('color', 'rgb(255, 255, 255)')
  })
}

test('support Save and profile Save use the shared lens', async ({ page }) => {
  await page.goto('/?view=client-support')
  await page.getByRole('button', { name: 'Добавить обращение', exact: true }).click()
  await expectPrimaryLens(page.getByRole('button', { name: 'Сохранить обращение', exact: true }))

  await page.goto('/?view=client-orders')
  await page.getByTestId('account-menu-trigger').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
  await expectPrimaryLens(page.getByTestId('profile-page-actions').getByRole('button', { name: 'Сохранить', exact: true }))
})

test('comparison lab keeps explicit standard material and text buttons stay separate', async ({ page }) => {
  await page.goto('/tests/fixtures/header-action-lens-pilot.html')
  await expect(page.getByTestId('lens-original-light')).not.toHaveAttribute('data-appearance', 'primary-lens')
  await expectPrimaryLens(page.getByTestId('lens-candidate-light'))

  await page.goto('/?view=neutral-actions')
  await expect(page.getByTestId('neutral-header').first()).not.toHaveAttribute('data-appearance', 'primary-lens')
  await expect(page.getByTestId('neutral-primary').first()).not.toHaveAttribute('data-appearance', 'primary-lens')
})

test('Add keeps a readable system icon in forced colors', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  const add = page.getByRole('button', { name: 'Добавить заказ', exact: true })
  const circle = add.locator('.fos-ha__circle')
  const plus = add.locator('.fos-ha__plus')
  expect(await plus.evaluate(node => getComputedStyle(node).color)).toBe(await circle.evaluate(node => getComputedStyle(node).color))
  expect(await circle.evaluate(node => getComputedStyle(node, '::before').display)).toBe('none')
})
