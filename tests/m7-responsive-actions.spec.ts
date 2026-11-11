import { expect, test, type Locator, type Page } from '@playwright/test'
import { setDemoRole } from './helpers/orders'

async function focusByKeyboard(page: Page, control: Locator) {
  // Scripted focus after a pointer action inherits pointer modality. Exercise
  // actual Tab navigation before asserting the canonical :focus-visible ring.
  await control.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(control).toBeFocused()
}
const actionWidths = [
  { width: 1440, dock: false },
  { width: 1024, dock: false },
  { width: 768, dock: true, right: 24 },
  { width: 390, dock: true, right: 20 },
  { width: 320, dock: true, right: 16 },
] as const
const workActionRoutes = [
  '/?view=client-layouts',
  '/?view=client-orders',
  '/?view=manager-orders',
  '/?view=client-support',
  '/?view=manager-support',
  '/?view=manager-companies',
] as const

for (const viewport of actionWidths) {
  test(`LAYOUTS work actions ${viewport.width}px use the FOS V2 responsive placement`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.width === 320 ? 812 : 900 })
    await page.goto('/?view=client-layouts')

    const actions = page.locator('.fos-page-header__actions')
    await expect(actions).toBeVisible()
    await expect(actions.locator('button')).toHaveCount(2)
    if (viewport.dock) {
      await expect(actions).toHaveCSS('position', 'fixed')
      const box = await actions.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.width).toBe(108)
      expect(box!.height).toBe(48)
      expect(viewport.width - box!.x - box!.width).toBe(viewport.right)
      expect((viewport.width === 320 ? 812 : 900) - box!.y - box!.height).toBe(24)
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      const lastRow = await page.locator('.fos-layout-list > li').last().boundingBox()
      expect(lastRow).not.toBeNull()
      expect(lastRow!.y + lastRow!.height).toBeLessThan(box!.y - 12)
    } else {
      await expect(actions).not.toHaveCSS('position', 'fixed')
    }
    await page.screenshot({ path: testInfo.outputPath(`client-layouts-actions-${viewport.width}.png`), fullPage: true })

    await page.getByTestId('layout-row-demo-layout-01').click()
    const detailActions = page.getByTestId('floating-work-actions')
    await expect(detailActions).toBeVisible()
    await expect(detailActions.locator('button')).toHaveCount(2)
    await expect(detailActions).toHaveCSS('position', viewport.dock ? 'fixed' : 'static')

    await page.reload()
    await page.getByRole('button', { name: 'Добавить макет', exact: true }).click()
    const uploadActions = page.getByTestId('floating-work-actions')
    await expect(uploadActions).toBeVisible()
    await expect(uploadActions.locator('button')).toHaveCount(2)
    await expect(uploadActions).toHaveCSS('position', viewport.dock ? 'fixed' : 'static')
  })
}

for (const width of [768, 390, 320]) {
  test(`Client and Manager paired work actions share the same dock at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 320 ? 812 : width === 390 ? 844 : 900 })
    for (const route of workActionRoutes) {
      await page.goto(route)
      const actions = page.getByTestId('floating-work-actions')
      await expect(actions).toBeVisible()
      await expect(actions.locator('button')).toHaveCount(2)
      const box = await actions.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.width).toBe(108)
      expect(box!.height).toBe(48)
      expect(width - box!.x - box!.width).toBe(width === 320 ? 16 : width === 390 ? 20 : 24)
      expect((width === 320 ? 812 : width === 390 ? 844 : 900) - box!.y - box!.height).toBe(24)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      if (route === '/?view=client-orders' || route === '/?view=manager-orders') {
        await page.screenshot({ path: testInfo.outputPath(`${route.includes('manager') ? 'manager' : 'client'}-orders-actions-${width}.png`), fullPage: true })
      }
    }
  })
}

for (const width of [768, 390, 320]) {
  test(`Client and Manager detail/support pairs stay in the shared dock at ${width}px`, async ({ page }) => {
    const height = width === 320 ? 812 : width === 390 ? 844 : 900
    await page.setViewportSize({ width, height })
    const assertDock = async () => {
      const dock = page.getByTestId('floating-work-actions')
      await expect(dock).toBeVisible()
      await expect(dock.locator('button')).toHaveCount(2)
      const box = await dock.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.width).toBe(108)
      expect(box!.height).toBe(48)
      expect(width - box!.x - box!.width).toBe(width === 320 ? 16 : width === 390 ? 20 : 24)
      expect(height - box!.y - box!.height).toBe(24)
    }

    await page.goto('/?view=client-orders')
    await page.getByTestId('client-order-DEMO-001').click()
    await assertDock()

    await page.goto('/?view=manager-orders')
    await page.getByTestId('manager-order-DEMO-001').click()
    await assertDock()

    await page.goto('/?view=client-support')
    await page.getByRole('button', { name: 'Добавить обращение', exact: true }).click()
    await assertDock()
    await page.goto('/?view=client-support')
    await page.getByTestId('ticket-row-client-01').click()
    await assertDock()

    await page.goto('/?view=manager-support')
    await page.getByRole('button', { name: 'Добавить обращение', exact: true }).click()
    await assertDock()
    await page.goto('/?view=manager-support')
    await page.getByTestId('ticket-row-manager-01').click()
    await assertDock()

    await page.goto('/?view=manager-companies')
    await page.getByTestId('company-row-company-01').click()
    await page.getByTestId('company-order-DEMO-001').click()
    await assertDock()
  })
}

test('Client and Manager photo actions stay centered beside Avatar80 and keep separate Save+More geometry', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 812 : width === 390 ? 844 : 900 })
    const avatar = await page.getByTestId('profile-avatar').boundingBox()
    const photoActions = await page.locator('.fos-profile-photo__actions').boundingBox()
    expect(avatar).not.toBeNull()
    expect(photoActions).not.toBeNull()
    expect(avatar!.width).toBe(80)
    expect(Math.abs((avatar!.y + avatar!.height / 2) - (photoActions!.y + photoActions!.height / 2))).toBeLessThanOrEqual(1)

    const profileActions = page.getByTestId('profile-page-actions')
    const dock = await profileActions.boundingBox()
    expect(dock).not.toBeNull()
    expect(dock!.width).toBe(148)
    expect(dock!.height).toBe(68)
    if (width < 1024) {
      const right = width === 320 ? 16 : width === 390 ? 20 : 24
      expect(width - dock!.x - dock!.width).toBe(right)
      expect((width === 320 ? 812 : width === 390 ? 844 : 900) - dock!.y - dock!.height).toBe(24)
    } else {
      expect(width - dock!.x - dock!.width).toBe(32)
      expect(dock!.y).toBe(92)
    }
  }

  await page.goto('/?view=manager-orders')
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
  await expect(page.getByTestId('profile-avatar')).toContainText('А')
  for (const width of [1440, 1024, 768, 390, 320]) {
    const height = width === 320 ? 812 : width === 390 ? 844 : 900
    await page.setViewportSize({ width, height })
    const avatar = await page.getByTestId('profile-avatar').boundingBox()
    const photoActions = await page.locator('.fos-profile-photo__actions').boundingBox()
    const dock = await page.getByTestId('profile-page-actions').boundingBox()
    expect(avatar?.width).toBe(80)
    expect(photoActions).not.toBeNull()
    expect(Math.abs((avatar!.y + avatar!.height / 2) - (photoActions!.y + photoActions!.height / 2))).toBeLessThanOrEqual(1)
    expect(dock?.width).toBe(148)
    expect(dock?.height).toBe(68)
    if (width < 1024) {
      expect(width - dock!.x - dock!.width).toBe(width === 320 ? 16 : width === 390 ? 20 : 24)
      expect(height - dock!.y - dock!.height).toBe(24)
    } else {
      expect(width - dock!.x - dock!.width).toBe(32)
      expect(dock!.y).toBe(92)
    }
  }
})

test('Account Trigger and menu stay aligned to the FOS shell at all five widths', async ({ page }) => {
  await page.goto('/?demoTools=1')
  for (const width of [1440, 1024, 768, 390, 320]) {
    const height = width === 320 ? 812 : width === 390 ? 844 : 900
    await page.setViewportSize({ width, height })
    const trigger = page.locator('[data-testid="account-menu-trigger"]:visible')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).not.toBeNull()
    if (width < 1024) {
      expect(triggerBox!.width).toBe(40)
      expect(triggerBox!.height).toBe(40)
      expect(width - triggerBox!.x - triggerBox!.width).toBe(16)
      const shellHeader = await page.getByTestId('app-shell-mobile-header').boundingBox()
      const logo = await page.locator('.fos-app-shell__identity').boundingBox()
      expect(shellHeader!.height).toBe(72)
      expect(Math.abs(logo!.x + logo!.width / 2 - width / 2)).toBeLessThanOrEqual(1)
    } else {
      expect(triggerBox!.width).toBe(240)
      expect(triggerBox!.height).toBe(72)
      const sidebar = await page.locator('.fos-app-shell__aside').boundingBox()
      expect(sidebar).not.toBeNull()
      expect(triggerBox!.y + triggerBox!.height).toBe(sidebar!.y + sidebar!.height)
    }

    await trigger.click()
    const menu = page.getByRole('menu')
    const menuBox = await menu.boundingBox()
    expect(menuBox).not.toBeNull()
    expect(menuBox!.x).toBeGreaterThanOrEqual(16)
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(width - 16)
    if (width < 1024) expect(menuBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height)
    else expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1)
    await page.keyboard.press('Escape')
  }
  await page.goto('/?demoTools=1')
  await setDemoRole(page, 'manager')
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 812 : width === 390 ? 844 : 900 })
    const trigger = page.locator('[data-testid="account-menu-trigger"]:visible')
    const box = await trigger.boundingBox()
    expect(box?.width).toBe(40)
    expect(box?.height).toBe(40)
    expect(width - box!.x - box!.width).toBe(16)
    await trigger.click()
    await expect(page.getByRole('menu')).toContainText('manager@example.test')
    await page.keyboard.press('Escape')
  }
})

test('FOSAction secondary keeps the canonical liquid-glass pill at its 44px consumer size', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto('/?demoTools=1')
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()

  const action = page.locator('button.fos-action').filter({ hasText: 'Загрузить фото' })
  await expect(action).toBeVisible()
  await expect(action).toHaveCSS('border-radius', '22px')
  await expect(action).toHaveCSS('height', '44px')
  await expect(action.locator('[data-fos-glass-material]')).toHaveAttribute('data-strength', '0.1')
  await page.screenshot({ path: testInfo.outputPath('fos-action-liquid-glass-profile.png'), fullPage: true })
  await focusByKeyboard(page, action)
  await expect(action).toBeFocused()
  await expect(action).toHaveCSS('outline-style', 'solid')
  const before = await action.boundingBox()
  await action.hover()
  await expect(action).toHaveAttribute('data-surface-active', 'false')
  await expect(action.locator('.fos-action__content')).toHaveCSS('transform', 'none')
  await expect(action.locator('.fos-action__motion')).toHaveCSS('transform', 'matrix(1.02, 0, 0, 1.02, 0, 0)')
  const after = await action.boundingBox()
  expect(after).not.toBeNull()
  expect(before).not.toBeNull()
  expect(after!.width).toBe(before!.width)
  expect(after!.height).toBe(before!.height)
  await page.keyboard.down('Space')
  await expect(action).toHaveAttribute('data-pressed', 'true')
  await page.keyboard.up('Space')
  await expect(action).toHaveAttribute('data-pressed', 'false')
})

test('new order and item editor Primary+More actions use the shared work dock', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  let headerActions = page.locator('.fos-order-composer .fos-page-header__actions')
  await expect(headerActions).toBeVisible()
  await expect(headerActions).toHaveAttribute('data-testid', 'floating-work-actions')
  await expect(headerActions.locator('button')).toHaveCount(2)
  await expect(headerActions).toHaveCSS('position', 'fixed')
  await expect(headerActions).toHaveCSS('width', '108px')

  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  const artworkUpload = page.locator('.fos-artwork-source__dropzone > .fos-action')
  await expect(artworkUpload).toHaveCSS('height', '44px')
  await expect(artworkUpload).toHaveCSS('border-radius', '22px')
  const artworkLibrary = page.locator('button[data-artwork-library]')
  await expect(artworkLibrary).toHaveCSS('height', '40px')
  await expect(artworkLibrary).toHaveCSS('border-radius', '20px')
  headerActions = page.locator('.fos-item-form .fos-page-header__actions')
  await expect(headerActions).toBeVisible()
  await expect(headerActions).toHaveAttribute('data-testid', 'floating-work-actions')
  await expect(headerActions.locator('button')).toHaveCount(2)
  await expect(headerActions).toHaveCSS('position', 'fixed')
  await expect(headerActions).toHaveCSS('width', '108px')
  const more = page.getByRole('button', { name: 'Ещё', exact: true })
  await more.click()
  const menu = page.getByRole('menu')
  const menuBox = await menu.boundingBox()
  const dockBox = await headerActions.boundingBox()
  expect(menuBox).not.toBeNull()
  expect(dockBox).not.toBeNull()
  expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(dockBox!.y - 7)
  expect(menuBox!.x).toBeGreaterThanOrEqual(16)
  expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(390 - 16)
  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await expect(more).toBeFocused()

  await page.getByRole('button', { name: 'Мои макеты', exact: true }).click()
  await expect(page.getByTestId('layout-picker')).toBeVisible()
  const pickerDock = page.getByTestId('floating-work-actions')
  await expect(pickerDock).toBeVisible()
  await expect(pickerDock.locator('button')).toHaveCount(2)
  await expect(pickerDock).toHaveCSS('position', 'fixed')
})

test('FOSAction press motion respects reduced motion and keeps a forced-colors focus cue', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto('/?demoTools=1')
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
  const action = page.locator('button.fos-action').filter({ hasText: 'Загрузить фото' })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await action.hover()
  await expect(action.locator('.fos-action__content')).toHaveCSS('transform', 'none')
  await action.focus()
  await page.keyboard.down('Space')
  await expect(action).toHaveAttribute('data-pressed', 'true')
  await page.keyboard.up('Space')

  await page.emulateMedia({ forcedColors: 'active' })
  await focusByKeyboard(page, action)
  await expect(action.locator('[data-fos-glass-material]')).toBeHidden()
  await expect(action).toHaveCSS('outline-width', '2px')
  await expect(action).toHaveCSS('outline-style', 'solid')
})
