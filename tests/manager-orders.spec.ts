import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=manager-orders')
})

test('composed Manager Orders uses approved shared UI primitives', async ({ page }) => {
  await expect(page.getByTestId('manager-orders-screen')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Заказы', level: 1 })).toBeVisible()
  const tabs = page.getByTestId('glass-pill-tabs')
  await expect(tabs.getByRole('button')).toHaveCount(5)
  await expect(tabs.getByTestId('glass-pill-work')).toHaveText('В работе')
  await expect(tabs.locator('[data-fos-glass-material]')).toHaveCount(1)
  await expect(tabs.locator('select')).toHaveCount(0)
  const sidebar = page.getByTestId('shared-sidebar-nav')
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    // The shell mounts the modal navigation at tablet/mobile widths.
    await expect(sidebar).toBeHidden()
  } else {
    await expect(sidebar).toBeVisible()
  }
  await expect(page.getByRole('button', { name: 'Добавить заказ' })).toBeDisabled()
  await expect(page.getByTestId('manager-orders-list').locator('li')).toHaveCount(6)
  await expect(page.getByTestId('manager-order-count')).toHaveText('6 из 6')
  await expect(page.getByTestId('manager-orders-list').locator('.fos-order-card')).toHaveCount(6)
})

test('controlled GL-03 filter changes visible orders without backend mutations', async ({ page }) => {
  const tabs = page.getByTestId('glass-pill-tabs')
  await tabs.getByTestId('glass-pill-work').click()
  await expect(tabs.getByTestId('glass-pill-work')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('manager-order-count')).toHaveText('2 из 6')
  await expect(page.getByTestId('manager-orders-list').locator('li')).toHaveCount(2)
  await tabs.getByTestId('glass-pill-done').click()
  await expect(page.getByTestId('manager-order-count')).toHaveText('1 из 6')
  await expect(page.getByTestId('manager-order-DEMO-004')).toBeVisible()
  await expect(page.getByTestId('manager-order-DEMO-005')).toHaveCount(0)
  await tabs.getByTestId('glass-pill-all').click()
  await expect(page.getByTestId('manager-order-count')).toHaveText('6 из 6')
  await expect(page.getByTestId('manager-order-DEMO-005')).toContainText('Отменён')
})

test('screen is responsive D1440/L1024/T768/M390/M320 and glass shadow not clipped', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
    await expect(page.getByRole('heading', { name: 'Заказы', level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const scroll = page.getByTestId('glass-pill-scroll')
    const padding = await scroll.evaluate(element => {
      const css = getComputedStyle(element)
      return [css.paddingTop, css.paddingBottom]
    })
    expect(padding).toEqual(['7px', '12px'])
    await expect(page.getByTestId('glass-pill-lens')).toHaveCount(1)
    if (width <= 390) {
      expect(await scroll.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
    }
  }
})

test('empty fixture renders honest list state', async ({ page }) => {
  await page.goto('/?view=manager-orders&fixture=empty')
  await expect(page.getByTestId('manager-order-count')).toHaveText('0 из 0')
  await expect(page.getByTestId('manager-orders-empty')).toBeVisible()
  await expect(page.getByTestId('manager-orders-list').locator('li')).toHaveCount(0)
})

test('implemented navigation is available while unapproved Manager order commands stay disabled', async ({ page }) => {
  const nav = page.getByTestId('shared-sidebar-nav')
  // Query actual DOM nodes: the SidebarNav itself is hidden at mobile width.
  await expect(nav.locator('[data-testid="sidebar-nav-clients"]')).toBeEnabled()
  await expect(nav.locator('[data-testid="sidebar-nav-support"]')).toBeEnabled()
  await expect(page.getByTestId('manager-orders-list').getByRole('link')).toHaveCount(0)
})


test('viewport screenshots for independent Owner review', async ({ page }, testInfo) => {
  const sizes = [
    { label: 'D1440', width: 1440, height: 900 },
    { label: 'L1024', width: 1024, height: 768 },
    { label: 'T768', width: 768, height: 1024 },
    { label: 'M390', width: 390, height: 844 },
    { label: 'M320', width: 320, height: 740 },
  ] as const
  for (const { label, width, height } of sizes) {
    await page.setViewportSize({ width, height })
    await page.goto('/?view=manager-orders')
    await expect(page.getByTestId('manager-orders-screen')).toBeVisible()
    await expect(page.getByTestId('manager-order-count')).toHaveText('6 из 6')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({
      path: testInfo.outputPath('fe08-manager-orders-' + label + '.png'),
      fullPage: true,
      animations: 'disabled',
    })
    if (width < 1024) {
      await page.getByRole('button', { name: 'Открыть меню менеджера' }).click()
      const dialog = page.getByRole('dialog', { name: 'Меню менеджера', exact: true })
      await expect(dialog).toBeVisible()
      await expect(dialog.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', /settled|off/)
      await page.screenshot({
        path: testInfo.outputPath('fe08-manager-orders-' + label + '-menu.png'),
        fullPage: false,
        animations: 'disabled',
      })
      await page.keyboard.press('Escape')
      await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
    }
  }
})

test('presentation is isolated from demo record fields and supports a clean empty data source', async ({ page }) => {
  await page.goto('/?view=manager-orders&fixture=empty')
  const tabs = page.getByTestId('glass-pill-tabs')
  await expect(page.getByTestId('manager-order-count')).toHaveText('0 из 0')
  await tabs.getByTestId('glass-pill-work').click()
  await expect(page.getByTestId('manager-orders-empty')).toBeVisible()
  await expect(page.getByTestId('manager-order-count')).toHaveText('0 из 0')
})

test('tablet and mobile navigation opens on the real Orders screen and preserves its filter', async ({ page }) => {
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 })
    await page.getByTestId('glass-pill-work').click()
    const trigger = page.getByRole('button', { name: 'Открыть меню менеджера' })
    await expect(trigger).toBeVisible()
    await trigger.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Меню менеджера', exact: true })
    await expect(dialog).toBeVisible()
    const orders = dialog.getByRole('button', { name: 'Заказы', exact: true })
    await expect(orders).toBeFocused()
    await expect(orders).toHaveAttribute('aria-current', 'page')
    await expect(dialog.getByRole('button', { name: 'Клиенты', exact: true })).toBeEnabled()
    await expect(dialog.getByRole('button', { name: 'Поддержка', exact: true })).toBeEnabled()
    await expect(dialog.getByTestId('sidebar-selected-lens')).toHaveCount(1)
    await expect(dialog.getByText('Менеджер', { exact: true })).toBeVisible()
    await expect(page.locator('#root')).toHaveAttribute('inert', '')
    expect(await page.evaluate(() => [document.body.style.overflow, document.documentElement.style.overflow]))
      .toEqual(['hidden', 'hidden'])
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', { name: 'Клиенты', exact: true })).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(orders).toBeFocused()
    // Selecting the current destination dismisses the modal and preserves the screen.
    await orders.click()
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await expect(page.locator('#root')).not.toHaveAttribute('inert')
    expect(await page.evaluate(() => [document.body.style.overflow, document.documentElement.style.overflow]))
      .toEqual(['', ''])
    await expect(page.getByTestId('manager-order-count')).toHaveText('2 из 6')
    await expect(page.getByTestId('glass-pill-work')).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(/\?view=manager-orders$/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('Orders menu Escape and scrim dismissal release focus and scrolling after repeated opening', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const dismissal of ['Escape', 'scrim', 'Escape']) {
    const trigger = page.getByRole('button', { name: 'Открыть меню менеджера' })
    await trigger.click()
    await expect(page.getByRole('dialog', { name: 'Меню менеджера', exact: true })).toBeVisible()
    if (dismissal === 'Escape') await page.keyboard.press('Escape')
    else await page.getByTestId('navigation-drawer-scrim').click({ position: { x: 5, y: 400 } })
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#root')).not.toHaveAttribute('inert')
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  }
  await page.mouse.wheel(0, 450)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  // Fixed menu geometry stays below the sticky 72px header even after scrolling.
  await page.getByRole('button', { name: 'Открыть меню менеджера' }).click()
  const panel = page.getByTestId('navigation-drawer-panel')
  await expect(panel).toBeVisible()
  await expect(panel).toHaveCSS('top', '72px')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
})

test('desktop breakpoint unmounts an open Orders menu and releases modal isolation', async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 900 })
  await page.getByTestId('glass-pill-work').click()
  await page.getByRole('button', { name: 'Открыть меню менеджера' }).click()
  await expect(page.getByRole('dialog', { name: 'Меню менеджера', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveCount(0)
  await expect(page.locator('#root')).not.toHaveAttribute('inert')
  expect(await page.evaluate(() => [document.body.style.overflow, document.documentElement.style.overflow]))
    .toEqual(['', ''])
  await expect(page.getByRole('navigation', { name: 'Навигация менеджера', exact: true })).toBeVisible()
  await expect(page.getByTestId('manager-order-count')).toHaveText('2 из 6')
  await page.setViewportSize({ width: 768, height: 1024 })
  await expect(page.getByRole('button', { name: 'Открыть меню менеджера' })).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('manager-order-count')).toHaveText('2 из 6')
})

test('Orders navigation adapts at all five review sizes without losing its only available destination', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
    const desktop = page.getByRole('navigation', { name: 'Навигация менеджера', exact: true })
    const trigger = page.getByTestId('navigation-drawer-trigger')
    if (width >= 1024) {
      await expect(desktop).toBeVisible()
      await expect(desktop.getByRole('button', { name: 'Заказы', exact: true })).toHaveAttribute('aria-current', 'page')
      await expect(trigger).toHaveCount(0)
    } else {
      await expect(desktop).toBeHidden()
      await expect(trigger).toBeVisible()
      const header = page.getByTestId('app-shell-mobile-header')
      expect((await header.boundingBox())?.height).toBe(72)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('empty Orders data keeps mobile navigation usable with reduced motion and forced colors', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' })
  await page.setViewportSize({ width: 320, height: 480 })
  await page.goto('/?view=manager-orders&fixture=empty')
  await page.getByRole('button', { name: 'Открыть меню менеджера' }).click()
  const dialog = page.getByRole('dialog', { name: 'Меню менеджера', exact: true })
  await expect(dialog).toBeVisible()
  const box = await dialog.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(320)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
  await expect(page.getByTestId('manager-orders-empty')).toBeVisible()
  await expect(page.getByTestId('manager-order-count')).toHaveText('0 из 0')
})

test('touch navigation works in a short landscape viewport without changing Orders data', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 768, height: 390 }, hasTouch: true })
  const page = await context.newPage()
  try {
    await page.goto('http://127.0.0.1:5173/?view=manager-orders')
    await page.getByRole('button', { name: 'Открыть меню менеджера' }).tap()
    const dialog = page.getByRole('dialog', { name: 'Меню менеджера', exact: true })
    await expect(dialog).toBeVisible()
    const box = await dialog.boundingBox()
    expect(box!.y + box!.height).toBeLessThanOrEqual(390)
    await dialog.getByRole('button', { name: 'Заказы', exact: true }).tap()
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
    await expect(page.getByTestId('manager-order-count')).toHaveText('6 из 6')
    await expect(page.locator('#root')).not.toHaveAttribute('inert')
  } finally {
    await context.close()
  }
})
