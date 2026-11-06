import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=client-orders')
})

test('Client My Orders composes the existing shell, cards and GL03', async ({ page }) => {
  await expect(page.getByTestId('client-orders-screen')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Мои заказы', exact: true })).toBeVisible()
  await expect(page.getByTestId('client-order-count')).toHaveText('2 из 2')
  await expect(page.getByTestId('client-orders-list').locator('.fos-order-card')).toHaveCount(2)
  await expect(page.getByTestId('client-order-DEMO-001')).toContainText('Компания 01')
  await expect(page.getByTestId('client-order-DEMO-003')).toContainText('В работе')
  await expect(page.getByTestId('client-order-DEMO-002')).toHaveCount(0)
  await expect(page.getByTestId('glass-pill-tabs').getByRole('button')).toHaveCount(5)
  await expect(page.getByTestId('glass-pill-lens')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Добавить заказ' })).toBeDisabled()
})

test('Client filters show actual fixture membership and an honest empty result', async ({ page }) => {
  await page.getByTestId('glass-pill-work').click()
  await expect(page.getByTestId('client-order-count')).toHaveText('1 из 2')
  await expect(page.getByTestId('client-order-DEMO-003')).toBeVisible()
  await expect(page.getByTestId('client-order-DEMO-001')).toHaveCount(0)
  await page.getByTestId('glass-pill-done').focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('glass-pill-done')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('client-orders-empty')).toBeVisible()
  await expect(page.getByTestId('client-order-count')).toHaveText('0 из 2')
  await page.getByTestId('glass-pill-all').click()
  await expect(page.getByTestId('client-order-count')).toHaveText('2 из 2')
})

test('Client empty input remains empty when a filter is changed', async ({ page }) => {
  await page.goto('/?view=client-orders&fixture=empty')
  await expect(page.getByTestId('client-orders-empty')).toBeVisible()
  await expect(page.getByTestId('client-order-count')).toHaveText('0 из 0')
  await page.getByTestId('glass-pill-work').click()
  await expect(page.getByTestId('client-order-count')).toHaveText('0 из 0')
  await expect(page.getByTestId('client-orders-list').locator('li')).toHaveCount(0)
})

test('Client shell and drawer remain usable at all five widths', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
    await expect(page.getByRole('heading', { name: 'Мои заказы', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const desktop = page.getByRole('navigation', { name: 'Навигация клиента', exact: true })
    if (width >= 1024) {
      await expect(desktop).toBeVisible()
      await expect(desktop.getByTestId('sidebar-nav-artworks')).toBeDisabled()
      await expect(desktop.getByTestId('sidebar-nav-support')).toBeDisabled()
      await expect(page.getByTestId('navigation-drawer-trigger')).toHaveCount(0)
    } else {
      await expect(desktop).toBeHidden()
      const trigger = page.getByRole('button', { name: 'Открыть меню клиента' })
      await trigger.click()
      const dialog = page.getByRole('dialog', { name: 'Меню клиента', exact: true })
      await expect(dialog).toBeVisible()
      await expect(dialog.getByTestId('sidebar-nav-orders')).toBeFocused()
      await expect(dialog.getByTestId('sidebar-nav-artworks')).toBeDisabled()
      await expect(dialog.getByTestId('sidebar-nav-support')).toBeDisabled()
      await expect(page.locator('#root')).toHaveAttribute('inert', '')
      await page.keyboard.press('Escape')
      await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
      await expect(trigger).toBeFocused()
      await expect(page.locator('#root')).not.toHaveAttribute('inert')
    }
  }
})

test('Client touch drawer closes on its current page and preserves the selected filter', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:5173/?view=client-orders')
    await page.getByTestId('glass-pill-work').tap()
    await page.getByRole('button', { name: 'Открыть меню клиента' }).tap()
    await page.getByRole('dialog', { name: 'Меню клиента', exact: true }).getByTestId('sidebar-nav-orders').tap()
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
    await expect(page.getByTestId('client-order-count')).toHaveText('1 из 2')
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  } finally {
    await context.close()
  }
})

test('Client screenshots for the five review sizes', async ({ page }, testInfo) => {
  for (const [label, width, height] of [
    ['D1440', 1440, 900], ['L1024', 1024, 768], ['T768', 768, 1024],
    ['M390', 390, 844], ['M320', 320, 740],
  ] as const) {
    await page.setViewportSize({ width, height })
    await page.goto('/?view=client-orders')
    await expect(page.getByTestId('client-order-count')).toHaveText('2 из 2')
    await page.screenshot({ path: testInfo.outputPath('fes01-client-' + label + '.png'), fullPage: true, animations: 'disabled' })
    if (width < 1024) {
      await page.getByRole('button', { name: 'Открыть меню клиента' }).click()
      await expect(page.getByRole('dialog', { name: 'Меню клиента', exact: true })).toBeVisible()
      await page.screenshot({ path: testInfo.outputPath('fes01-client-' + label + '-menu.png'), animations: 'disabled' })
      await page.keyboard.press('Escape')
      await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
    }
  }
})
