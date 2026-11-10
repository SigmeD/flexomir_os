import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { commitItem } from './helpers/orders'

const pilot = '/?view=client-orders&popupPilot=1'
async function openItem(page: import('@playwright/test').Page) {
  await page.goto(pilot)
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
}

test('pilot Account is a flat action list without fabricated selection; identity and dismissal survive', async ({ page }) => {
  for (const role of ['client', 'manager']) {
    await page.goto('/?view=' + role + '-orders&popupPilot=1')
    const trigger = page.getByTestId('account-menu-trigger')
    await trigger.click()
    const menu = page.getByTestId('account-menu')
    await expect(menu).toHaveAttribute('data-fos-popup', 'actions')
    await expect(menu.getByRole('separator')).toHaveCount(0)
    await expect(menu.locator('[data-motion="travel"]')).toHaveCount(0)
    await expect(menu.locator('[data-testid="popup-hover-lens"]')).toHaveCount(0)
    await expect(menu.locator('[aria-selected]')).toHaveCount(0)
    await expect(menu.locator('.fos-account-menu__copy strong')).toHaveCSS('font-size', '16px')
    const profile = menu.getByRole('menuitem', { name: 'Настройки профиля' })
    await expect(profile).toHaveCSS('font-size', '14px')
    await expect(profile).toHaveCSS('font-weight', '500')
    await expect(menu.getByRole('menuitem', { name: 'Настройки компании' })).toHaveAttribute('aria-disabled', 'true')
    await profile.focus()
    await expect(menu.locator('[data-motion="travel"]')).toHaveCount(0)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await trigger.click()
    await profile.click()
    await expect(page.getByRole('heading', { name: 'Настройки профиля', exact: true })).toBeVisible()
    await expect(page.getByLabel('Имя пользователя')).toBeVisible()
  }
})

test('pilot More uses shared actions and preserves delete confirmation and cancel focus', async ({ page }) => {
  await page.goto(pilot)
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const trigger = page.getByRole('button', { name: 'Ещё', exact: true })
  await trigger.click()
  const menu = page.getByRole('menu')
  await expect(menu).toHaveAttribute('data-fos-popup', 'actions')
  await expect(menu.locator('[data-testid="popup-hover-lens"]')).toHaveCount(0)
  await expect(menu.locator('[data-motion="travel"]')).toHaveCount(0)
  await menu.getByRole('menuitem', { name: 'Удалить черновик' }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await page.getByRole('button', { name: 'Отмена', exact: true }).click()
  await expect(trigger).toBeFocused()
  await expect(page.getByTestId('order-composer')).toBeVisible()
})

test('pilot Shape and Material use shared listbox, keyboard commit and real native change bridge', async ({ page }) => {
  await openItem(page)
  const shape = page.getByRole('combobox', { name: 'Форма', exact: true })
  await expect(shape).toHaveJSProperty('tagName', 'BUTTON')
  await expect(shape).toHaveAttribute('aria-required', 'true')
  await shape.click()
  const list = page.getByRole('listbox')
  await expect(list).toHaveAttribute('data-fos-popup', 'listbox')
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await expect(shape).toContainText('Круглая')
  await expect(shape).toBeFocused()
  await expect(page.locator('.fos-item-form__shape select')).toHaveValue('Круглая')
  const material = page.getByRole('combobox', { name: 'Материал', exact: true })
  await material.click()
  await page.getByRole('option', { name: 'Плёнка', exact: true }).click()
  await expect(material).toContainText('Плёнка')
  await expect(page.locator('.fos-item-form__material select')).toHaveValue('Плёнка')
  await material.click()
  await page.keyboard.press('Home')
  await page.keyboard.press('Escape')
  await expect(material).toContainText('Плёнка')
  await expect(material).toBeFocused()
  expect((await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze()).violations).toEqual([])
})

test('ordinary routes retain approved adapters until the rollout gate', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByTestId('account-menu-trigger').click()
  await expect(page.getByTestId('account-menu').locator('[data-fos-popup]')).toHaveCount(0)
  await expect(page.getByTestId('account-menu').getByRole('separator')).toHaveCount(3)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await expect(page.getByLabel('Форма', { exact: true })).toHaveJSProperty('tagName', 'SELECT')
})

test('pilot works at five widths in both roles and keeps popup bounds inside the viewport', async ({ page }) => {
  test.setTimeout(60000)
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    for (const role of ['client', 'manager']) {
      await page.goto('/?view=' + role + '-orders&popupPilot=1')
      await page.getByTestId('account-menu-trigger').click()
      const menu = page.getByTestId('account-menu')
      await menu.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)))
      const box = (await menu.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(15)
      expect(box.x + box.width).toBeLessThanOrEqual(width - 15)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.y + box.height).toBeLessThanOrEqual(900)
      await expect(menu.getByRole('separator')).toHaveCount(0)
    }
    await openItem(page)
    for (const label of ['Форма', 'Материал']) {
      await page.getByRole('combobox', { name: label, exact: true }).click()
      const list = page.getByRole('listbox')
      await list.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)))
      const box = (await list.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(15)
      expect(box.x + box.width).toBeLessThanOrEqual(width - 15)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.y + box.height).toBeLessThanOrEqual(900)
      await page.keyboard.press('Escape')
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0)
  }
})

test('pilot values survive saving and reopening an item', async ({ page }) => {
  await openItem(page)
  await page.getByLabel('Наименование продукции', { exact: true }).fill('Этикетка PILOT')
  await page.getByLabel('Количество', { exact: true }).fill('500')
  await page.getByLabel('Флексопечать', { exact: true }).check()
  for (const [label, option] of [['Форма', 'Круглая'], ['Материал', 'Плёнка']]) {
    await page.getByRole('combobox', { name: label, exact: true }).click()
    await page.getByRole('option', { name: option, exact: true }).click()
  }
  await page.getByLabel('Ширина, мм', { exact: true }).fill('100')
  await page.getByLabel('Высота, мм', { exact: true }).fill('150')
  await page.getByLabel('Нужна помощь с макетом', { exact: true }).check()
  await commitItem(page)
  await page.getByRole('button', { name: 'Изменить позицию 1' }).click()
  await expect(page.getByRole('combobox', { name: 'Форма', exact: true })).toContainText('Круглая')
  await expect(page.getByRole('combobox', { name: 'Материал', exact: true })).toContainText('Плёнка')
})
