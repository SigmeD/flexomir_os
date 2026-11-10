import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { chooseFormOption, chooseMore, commitItem } from './helpers/orders'

async function openProfile(page: Page) {
  await page.getByTestId('account-menu-trigger').filter({ visible: true }).click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
  await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toBeVisible()
}

test('FOS01 failed Profile save keeps draft and guard; Escape cancels the pending route', async ({ page }) => {
  await page.goto('/?view=client-orders&fixture=profile-save-error')
  await openProfile(page)
  await page.getByLabel('Имя пользователя').fill('Ошибка DEMO')
  await selectSection(page, 'orders')
  const dialog = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
  await dialog.getByRole('button', { name: 'Да', exact: true }).click()
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('alert')).toContainText('Не удалось сохранить')
  await expect(page.getByLabel('Имя пользователя')).toHaveValue('Ошибка DEMO')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByLabel('Имя пользователя')).toHaveValue('Ошибка DEMO')
})

for (const role of ['client', 'manager'] as const) {
  test(`FOS01 ${role}: other sections and five widths retain shell, focus and layout`, async ({ page }, info) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/?view=' + role + '-orders')
      await page.emulateMedia({ reducedMotion: width === 768 ? 'reduce' : 'no-preference', forcedColors: width === 320 ? 'active' : 'none' })
      await openProfile(page)
      await selectSection(page, 'orders')
      await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toHaveCount(0)
      await expect(page.getByRole('heading', { level: 1, name: role === 'client' ? 'Мои заказы' : 'Заказы', exact: true })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await expect.poll(() => page.evaluate(() => document.activeElement !== document.body && document.activeElement?.isConnected)).toBe(true)
      await page.screenshot({ path: info.outputPath(`root-${role}-${width}.png`), fullPage: true })
    }
    await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'none' })
    for (const section of [role === 'client' ? 'artworks' : 'clients', 'support']) {
      await selectSection(page, section)
      const title = await page.getByRole('heading', { level: 1 }).textContent()
      await openProfile(page)
      await selectSection(page, section)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title!)
    }
    expect(errors).toEqual([])
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  })
}

async function selectSection(page: Page, id: string, input: 'click' | 'Enter' | 'Space' = 'click') {
  const compact = page.viewportSize()!.width < 1024
  if (compact) await page.getByTestId('navigation-drawer-trigger').filter({ visible: true }).click()
  const row = (compact ? page.getByTestId('navigation-drawer-panel').filter({ visible: true }) : page.getByRole('complementary', { name: 'Навигация' })).getByTestId('sidebar-nav-' + id)
  if (input === 'click') {
    if (await page.evaluate(() => navigator.maxTouchPoints > 0)) await row.tap()
    else await row.click()
  } else await row.press(input)
  if (compact) {
    // Activity preserves inactive sections and their exiting portal DOM. Every
    // retained layer must be hidden and inert; no visible or modal blocker remains.
    await expect(page.getByTestId('navigation-drawer-layer').filter({ visible: true })).toHaveCount(0)
    for (const layer of await page.getByTestId('navigation-drawer-layer').all()) {
      await expect(layer).toHaveAttribute('inert', '')
      await expect(layer).toHaveAttribute('aria-hidden', 'true')
    }
    await expect(page.locator('#root')).not.toHaveAttribute('inert', '')
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  }
}

for (const role of ['client', 'manager'] as const) {
  for (const input of ['click', 'Enter', 'Space'] as const) {
    test(`FOS01 ${role}: clean Profile to active Orders by ${input}`, async ({ page }, info) => {
      await page.goto('/?view=' + role + '-orders')
      await openProfile(page)
      const history = await page.evaluate(() => window.history.length)
      await page.screenshot({ path: info.outputPath('profile-before.png'), fullPage: true })
      await selectSection(page, 'orders', input)
      await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toHaveCount(0)
      await expect(page.getByRole('heading', { level: 1, name: role === 'client' ? 'Мои заказы' : 'Заказы', exact: true })).toBeVisible()
      expect(await page.evaluate(() => window.history.length)).toBe(history)
      await expect(page.locator('main:visible')).toHaveCount(1)
      await page.screenshot({ path: info.outputPath('orders-after.png'), fullPage: true })
    })
  }
  for (const choice of ['save', 'discard', 'cancel'] as const) {
    test(`FOS01 ${role}: dirty Profile active Orders ${choice}`, async ({ page }) => {
      await page.goto('/?view=' + role + '-orders')
      await openProfile(page)
      const original = await page.getByLabel('Имя пользователя').inputValue()
      await page.getByLabel('Имя пользователя').fill('Изменённое имя DEMO')
      await selectSection(page, 'orders')
      const dialog = page.getByRole('alertdialog', { name: 'Сохранить изменения?' })
      await expect(dialog).toBeVisible()
      if (choice === 'cancel') {
        await dialog.getByRole('button', { name: 'Закрыть', exact: true }).click()
        await expect(page.getByLabel('Имя пользователя')).toHaveValue('Изменённое имя DEMO')
        await expect(page.getByTestId('profile-save')).toBeEnabled()
      } else {
        await dialog.getByRole('button', { name: choice === 'save' ? 'Да' : 'Нет', exact: true }).click()
        await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toHaveCount(0)
        await openProfile(page)
        await expect(page.getByLabel('Имя пользователя')).toHaveValue(choice === 'save' ? 'Изменённое имя DEMO' : original)
      }
    })
  }
  test(`FOS01 ${role}: detail Profile returns to root, and active list preserves filter`, async ({ page }) => {
    await page.goto('/?view=' + role + '-orders')
    await page.locator('button[data-order-open]').first().click()
    await expect(page.getByTestId('order-detail')).toBeVisible()
    await openProfile(page)
    await selectSection(page, 'orders')
    await expect(page.getByTestId('order-detail')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toHaveCount(0)
    const filter = page.getByRole('group', { name: 'Фильтр заказов по статусу' }).getByRole('button', { name: 'В работе', exact: true })
    await filter.click()
    await selectSection(page, 'orders')
    await expect(filter).toHaveAttribute('aria-pressed', 'true')
  })
}

test('FOS04 required placeholder is disabled and skipped by keyboard before and after choice', async ({ page }, info) => {
  await page.goto('/tests/fixtures/fos-select.html')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await trigger.click()
  await page.screenshot({ path: info.outputPath('required-placeholder.png'), fullPage: true })
  await expect(page.getByRole('option', { name: 'Выберите значение' })).toBeDisabled()
  await expect(page.getByRole('option', { name: 'Альфа' })).toBeFocused()
  await page.keyboard.press('Home')
  await page.keyboard.press('Space')
  await expect(trigger).toContainText('Альфа')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.click()
  await page.keyboard.press('Home')
  await expect(page.getByRole('option', { name: 'Альфа' })).toBeFocused()
  await page.getByRole('option', { name: 'Альфа' }).dispatchEvent('keydown', { key: 'в' })
  await expect(page.getByRole('option', { name: 'Альфа' })).toBeFocused()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Отправить', exact: true }).click()
  await expect(page.getByTestId('form-data')).toHaveText('[["choice","a"]]')
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click()
  await expect(trigger).toContainText('Выберите значение')
  await page.getByRole('button', { name: 'Отправить', exact: true }).click()
  await expect(trigger).toHaveAttribute('aria-invalid', 'true')
  await expect(trigger).toBeFocused()
})

test('FOS04 Item shape/material and Manager company placeholders cannot clear required values', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  for (const [label, option, placeholder] of [['Форма', 'Круглая', 'Выберите форму'], ['Материал', 'Бумага', 'Выберите материал']]) {
    await chooseFormOption(page, label, option)
    await page.getByRole('combobox', { name: label, exact: true }).click()
    await expect(page.getByRole('option', { name: placeholder })).toBeDisabled()
    await page.keyboard.press('Escape')
  }
  await page.goto('/?view=manager-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('combobox', { name: 'Компания', exact: true }).click()
  await expect(page.getByRole('option', { name: 'Выберите компанию' })).toBeDisabled()
})

for (const source of ['LOCAL', 'LIBRARY', 'HELP'] as const) {
  test(`FOS05 duplicate detects dirty and ${source} resolves unavailable artwork without changing IDs`, async ({ page }, info) => {
    await page.goto('/?view=client-orders')
    await page.locator('[data-order-open="DEMO-007"]').click()
    await chooseMore(page, 'Дублировать заказ')
    const composer = page.getByTestId('order-composer')
    const id = await composer.getAttribute('data-order-id')
    const item = composer.locator('li[data-item-id]').first()
    const itemId = await item.getAttribute('data-item-id')
    const other = await composer.locator('li[data-item-id]').nth(1).textContent()
    await page.getByRole('button', { name: 'Изменить позицию 1' }).click()
    await page.getByLabel('Количество', { exact: true }).fill('1234')
    await expect(page.getByRole('status')).toContainText('Есть несохранённые изменения')
    await expect(page.getByRole('button', { name: 'Сохранить позицию' })).toBeDisabled()
    await expect(page.getByText(/Исходный макет недоступен:/)).toBeVisible()
    await page.screenshot({ path: info.outputPath('unavailable-before.png'), fullPage: true })
    if (source === 'LOCAL') await page.getByLabel('Выбрать файл макета').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from('synthetic') })
    else if (source === 'HELP') await page.getByLabel('Нужна помощь с макетом').check()
    else {
      await page.getByRole('button', { name: 'Мои макеты', exact: true }).click()
      await page.getByTestId('layout-row-demo-layout-01').click()
      await page.getByRole('button', { name: 'Выбрать макет', exact: true }).click()
      await expect(page.getByLabel('Количество', { exact: true })).toHaveValue('1234')
    }
    await expect(page.getByText(/Исходный макет недоступен:/)).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Сохранить позицию' })).toBeEnabled()
    await commitItem(page)
    await expect(composer).toHaveAttribute('data-order-id', id!)
    await expect(item).toHaveAttribute('data-item-id', itemId!)
    await expect(item).toContainText('1234 шт.')
    expect(await composer.locator('li[data-item-id]').nth(1).textContent()).toBe(other)
    await page.getByRole('button', { name: 'Изменить позицию 1' }).click()
    await expect(page.getByText(/Исходный макет недоступен:/)).toHaveCount(0)
    await page.getByLabel('Количество', { exact: true }).fill('9999')
    await chooseMore(page, 'Отменить изменения')
    await expect(item).toContainText('1234 шт.')
  })
}

test('FOS01 closing a dirty Profile guard for another section preserves the draft', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await openProfile(page)
  await page.getByLabel('Имя пользователя').fill('Не терять DEMO')
  await selectSection(page, 'support')
  await page.getByRole('alertdialog').getByRole('button', { name: 'Закрыть', exact: true }).click()
  await expect(page.getByLabel('Имя пользователя')).toHaveValue('Не терять DEMO')
  await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toBeVisible()
})

test('FOS04 optional semantic empty filter remains selectable after a value', async ({ page }) => {
  await page.goto('/tests/fixtures/fos-select.html?optional=1&filter=1')
  const trigger = page.getByRole('combobox', { name: 'Выбор' })
  await chooseFormOption(page, 'Выбор', 'Альфа')
  await trigger.click()
  await expect(page.getByRole('option', { name: 'Выберите значение' })).toBeEnabled()
  await page.keyboard.press('Home')
  await expect(page.getByRole('option', { name: 'Выберите значение' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('select')).toHaveValue('')
  await expect(trigger).not.toHaveAttribute('data-empty', 'true')
  await page.getByRole('button', { name: 'Отправить', exact: true }).click()
  await expect(page.getByTestId('form-data')).toHaveText('[["choice",""]]')
})

for (const role of ['client', 'manager'] as const) {
  for (const decision of ['Да', 'Нет']) {
    test(`FOS01 ${role}: dirty cross-section transition ${decision} commits once`, async ({ page }) => {
      await page.goto('/?view=' + role + '-orders')
      await openProfile(page)
      await page.getByLabel('Имя пользователя').fill('Другой раздел DEMO')
      await selectSection(page, 'support')
      await page.getByRole('alertdialog').getByRole('button', { name: decision, exact: true }).click()
      await expect(page.getByRole('alertdialog')).toHaveCount(0)
      await expect(page.getByRole('heading', { level: 1, name: 'Мои обращения', exact: true })).toBeVisible()
    })
  }
  test(`FOS01 ${role}: CabinetPage cross-section transition commits once`, async ({ page }) => {
    await page.goto('/?view=' + (role === 'client' ? 'client-layouts' : 'manager-companies'))
    await openProfile(page)
    await page.getByLabel('Имя пользователя').fill('Из кабинета DEMO')
    await selectSection(page, 'orders')
    await page.getByRole('alertdialog').getByRole('button', { name: 'Нет', exact: true }).click()
    await expect(page.getByRole('alertdialog')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1, name: role === 'client' ? 'Мои заказы' : 'Заказы', exact: true })).toBeVisible()
  })
}

test('FOS01 Profile guard retains keyboard focus after Drawer close', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=client-orders')
  await openProfile(page)
  await page.getByLabel('Имя пользователя').fill('Фокус DEMO')
  await selectSection(page, 'orders', 'Enter')
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Shift+Tab')
  expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true)
})
