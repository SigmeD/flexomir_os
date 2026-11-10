import { expect, test } from '@playwright/test'

async function openProfile(page: import('@playwright/test').Page) {
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
}

test('Client account menu and profile use the same identity and canonical page actions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?demoTools=1')

  const footer = page.locator('[data-testid="account-menu-trigger"]:visible')
  await expect(footer).toContainText('Мария Иванова')
  await expect(footer).toHaveAccessibleName('Мария Иванова')
  await footer.click()
  await expect(page.getByRole('menu')).toContainText('Мария Иванова')
  await expect(page.getByRole('menu')).toContainText('Компания 01')
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()

  await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toBeVisible()
  await expect(page.getByLabel('Имя пользователя')).toHaveValue('Мария Иванова')
  await expect(page.getByLabel('E-mail')).toHaveValue('client@example.test')
  await expect(page.getByLabel('E-mail')).toHaveAttribute('readonly', '')
  await expect(page.getByTestId('profile-avatar')).toHaveCSS('width', '80px')
  await expect(page.getByTestId('profile-save')).toBeDisabled()
  await expect(page.getByTestId('profile-more')).toBeDisabled()
  await expect(page.getByTestId('profile-page-actions')).toHaveCSS('width', '148px')
  await expect(page.locator('[data-testid="account-menu-trigger"]:visible')).toContainText('М')
})

test('Manager profile keeps its own fixture identity when switching demo roles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?demoTools=1')
  await page.getByRole('button', { name: 'Демо — показать панель демонстрации' }).click()
  await page.getByRole('button', { name: 'Демо: менеджер', exact: true }).click()

  await expect(page.locator('[data-testid="account-menu-trigger"]:visible')).toContainText('А')
  await openProfile(page)
  await expect(page.getByLabel('Имя пользователя')).toHaveValue('Александр Петров')
  await expect(page.getByLabel('E-mail')).toHaveValue('manager@example.test')
  await expect(page.getByTestId('profile-page-actions')).toBeVisible()
  await expect(page.getByTestId('profile-page-actions')).toHaveCSS('position', 'fixed')
})

test('profile draft saves only in the demo session and resets to its fixture after reload', async ({ page }) => {
  await page.goto('/?demoTools=1')
  await openProfile(page)

  const name = page.getByLabel('Имя пользователя')
  await name.fill('Мария Новая')
  await expect(page.getByTestId('profile-save')).toBeEnabled()
  await page.getByTestId('profile-save').click()
  await expect(page.getByRole('status')).toContainText('демонстрационной сессии')
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await expect(page.getByRole('menu')).toContainText('Мария Новая')
  await expect(page.getByTestId('profile-save')).toBeDisabled()

  await page.reload()
  await openProfile(page)
  await expect(page.getByLabel('Имя пользователя')).toHaveValue('Мария Иванова')
})

test('photo preview can be selected, cancelled, marked for removal, restored, and saved locally', async ({ page }) => {
  await page.goto('/?demoTools=1')
  await openProfile(page)

  await page.getByTestId('profile-photo-input').setInputFiles({
    name: 'profile.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p4cAAAAASUVORK5CYII=', 'base64'),
  })
  await expect(page.getByTestId('profile-avatar').locator('img')).toBeVisible()

  await page.getByRole('button', { name: 'Удалить фото' }).click()
  await expect(page.getByRole('alertdialog', { name: 'Удалить фотографию?' })).toBeVisible()
  await page.getByRole('button', { name: 'Отмена' }).click()
  await expect(page.getByTestId('profile-avatar').locator('img')).toBeVisible()

  await page.getByRole('button', { name: 'Удалить фото' }).click()
  await page.getByRole('button', { name: 'ОК', exact: true }).click()
  await expect(page.getByTestId('profile-avatar').locator('img')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Восстановить фотографию' })).toBeVisible()
  await page.getByRole('button', { name: 'Восстановить фотографию' }).click()
  await expect(page.getByTestId('profile-avatar').locator('img')).toBeVisible()
  await page.getByTestId('profile-save').click()
  await expect(page.getByRole('status')).toContainText('демонстрационной сессии')
})

test('dirty profile guards navigation and saves before continuing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?demoTools=1')
  await openProfile(page)
  await page.getByLabel('Имя пользователя').fill('Мария Изменённая')

  await page.getByTestId('navigation-drawer-trigger').click()
  await page.getByTestId('navigation-drawer-panel').getByRole('button', { name: 'Макеты' }).click()
  await expect(page.getByRole('alertdialog', { name: 'Сохранить изменения?' })).toBeVisible()
  await expect(page.getByTestId('client-layouts-screen')).toBeHidden()

  await page.getByRole('button', { name: 'Да' }).click()
  await expect(page.getByRole('heading', { name: 'Мои макеты' })).toBeVisible()
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await expect(page.getByRole('menu')).toContainText('Мария Изменённая')
})

test('failed demo save leaves the draft and confirmation dialog open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?demoTools=1&fixture=profile-save-error')
  await openProfile(page)
  await page.getByLabel('Имя пользователя').fill('Мария Ошибка')
  await page.getByTestId('navigation-drawer-trigger').click()
  await page.getByTestId('navigation-drawer-panel').getByRole('button', { name: 'Макеты' }).click()
  await page.getByRole('button', { name: 'Да' }).click()

  await expect(page.getByRole('alertdialog', { name: 'Сохранить изменения?' })).toBeVisible()
  await expect(page.getByRole('alert')).toContainText('Не удалось сохранить')
  await expect(page.getByLabel('Имя пользователя')).toHaveValue('Мария Ошибка')
  await expect(page.getByTestId('client-layouts-screen')).toBeHidden()
})

test('account menu closes on Escape and returns focus to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?demoTools=1')
  const trigger = page.locator('[data-testid="account-menu-trigger"]:visible')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('profile actions stay clear of the mobile viewport edge at 320 and 390 pixels', async ({ page }) => {
  await page.goto('/?demoTools=1')
  await openProfile(page)

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 812 : 844 })
    const dock = page.getByTestId('profile-page-actions')
    const rect = await dock.boundingBox()
    expect(rect).not.toBeNull()
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width - (width === 320 ? 16 : 20) + 0.5)
  }
})

test('profile fits the five Figma viewport widths and captures Client visual evidence', async ({ page }, testInfo) => {
  await page.goto('/?view=client-orders')
  await openProfile(page)

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 812 : width === 390 ? 844 : 900 })
    const actions = page.getByTestId('profile-page-actions')
    await expect(actions).toBeVisible()
    await expect(page.locator('[data-testid="account-menu-trigger"]:visible')).toHaveCount(1)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await expect(actions).toHaveCSS('position', width < 1024 ? 'fixed' : 'absolute')
    await page.screenshot({ path: testInfo.outputPath(`profile-client-${width}.png`), fullPage: true })
  }
})

test('touch account trigger opens the shared menu', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('touch'), 'Runs in the touch-enabled Playwright project.')
  await page.goto('/?view=client-orders')
  const trigger = page.locator('[data-testid="account-menu-trigger"]:visible')
  await trigger.tap()
  await expect(page.getByRole('menu')).toContainText('Мария Иванова')
})
