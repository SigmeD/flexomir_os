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
  if ((page.viewportSize()?.width ?? 1440) <= 900) {
    // Desktop SidebarNav is intentionally hidden until GL-02B Drawer is approved.
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

test('non-implemented navigation and order routes cannot be clicked', async ({ page }) => {
  const nav = page.getByTestId('shared-sidebar-nav')
  // Query actual DOM nodes: the SidebarNav itself is hidden at mobile width.
  await expect(nav.locator('[data-testid="sidebar-nav-clients"]')).toBeDisabled()
  await expect(nav.locator('[data-testid="sidebar-nav-support"]')).toBeDisabled()
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
    await expect(page.getByTestId('manager-orders-screen')).toBeVisible()
    await expect(page.getByTestId('manager-order-count')).toHaveText('6 из 6')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({
      path: testInfo.outputPath('fe08-manager-orders-' + label + '.png'),
      fullPage: true,
      animations: 'disabled',
    })
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
