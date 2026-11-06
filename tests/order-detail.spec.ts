import { expect, test } from '@playwright/test'

const roles = ['client', 'manager'] as const
const sizes = [
  ['D1440', 1440, 900], ['L1024', 1024, 768], ['T768', 768, 1024],
  ['M390', 390, 844], ['M320', 320, 740],
] as const

for (const role of roles) {
  test(role + ' list → read-only detail → back preserves identity, filter and focus at five widths', async ({ page }) => {
    for (const [, width, height] of sizes) {
      await page.setViewportSize({ width, height })
      await page.goto('/?view=' + role + '-orders')
      await page.getByTestId('glass-pill-work').click()
      const opener = page.getByRole('button', { name: 'Открыть заказ DEMO-003', exact: true })
      await expect(opener).toBeVisible()
      await opener.focus()
      await page.keyboard.press('Enter')
      const detail = page.getByTestId('order-detail')
      await expect(detail).toBeVisible()
      await expect(detail.getByRole('heading', { name: 'Заказ DEMO-003', exact: true })).toBeFocused()
      await expect(detail.getByTestId('order-detail-status')).toHaveText('В работе')
      await expect(detail.getByText('Демонстрационный заказ 03', { exact: true })).toBeVisible()
      await expect(detail.getByText('Компания 01', { exact: true })).toBeVisible()
      await expect(detail.getByTestId('order-item-summary')).toHaveCount(2)
      await expect(detail.getByRole('textbox')).toHaveCount(0)
      await expect(detail.getByRole('button', { name: /Создать|Отправить|Подтвердить|Повторить|Редактировать/ })).toHaveCount(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await expect(page).toHaveURL(new RegExp('\\?view=' + role + '-orders$'))
      await detail.getByRole('button', { name: 'К списку заказов', exact: true }).click()
      await expect(page.getByTestId('order-detail')).toHaveCount(0)
      await expect(page.getByTestId('glass-pill-work')).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByTestId(role + '-order-count')).toHaveText(role === 'client' ? '1 из 3' : '2 из 6')
      await expect(opener).toBeFocused()
    }
  })

  test(role + ' detail keeps every visible order status and renders zero/one/many positions honestly', async ({ page }) => {
    await page.goto('/?view=' + role + '-orders')
    const cases = role === 'client'
      ? [['DEMO-001', 0], ['DEMO-003', 2], ['DEMO-007', 2]] as const
      : [['DEMO-001', 0], ['DEMO-002', 1], ['DEMO-003', 2], ['DEMO-004', 1], ['DEMO-005', 0], ['DEMO-006', 1]] as const
    for (const [id, count] of cases) {
      const row = page.getByTestId(role + '-order-' + id)
      const status = await row.locator('.fos-order-card__status').innerText()
      await row.getByRole('button', { name: 'Открыть заказ ' + id, exact: true }).click()
      const detail = page.getByTestId('order-detail')
      await expect(detail.getByRole('heading', { name: 'Заказ ' + id, exact: true })).toBeVisible()
      await expect(detail.getByTestId('order-detail-status')).toHaveText(status)
      await expect(detail.getByTestId('order-item-summary')).toHaveCount(count)
      if (!count) await expect(detail.getByText('Позиции не указаны.', { exact: true })).toBeVisible()
      await detail.getByRole('button', { name: 'К списку заказов', exact: true }).click()
      await expect(row).toBeVisible()
    }
  })

  test(role + ' detail keeps the shared drawer usable in reduced-motion/forced-colors mode', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' })
    await page.setViewportSize({ width: 320, height: 740 })
    await page.goto('/?view=' + role + '-orders')
    await page.getByRole('button', { name: 'Открыть заказ DEMO-003', exact: true }).click()
    await page.getByTestId('navigation-drawer-trigger').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveCount(0)
    await expect(page.locator('#root')).not.toHaveAttribute('inert')
    await expect(page.getByTestId('order-detail')).toBeVisible()
    await page.getByRole('button', { name: 'К списку заказов', exact: true }).click()
    await expect(page.getByTestId(role + '-orders-list')).toBeVisible()
  })

  test(role + ' detail screenshots for Owner review', async ({ page }, testInfo) => {
    for (const [label, width, height] of sizes) {
      await page.setViewportSize({ width, height })
      await page.goto('/?view=' + role + '-orders')
      await page.getByRole('button', { name: 'Открыть заказ DEMO-003', exact: true }).click()
      await expect(page.getByTestId('order-detail')).toBeVisible()
      await page.screenshot({ path: testInfo.outputPath('fes01-detail-' + role + '-' + label + '.png'), fullPage: true, animations: 'disabled' })
    }
  })
}

test('the same DEMO order has identical read-only content in both cabinets', async ({ page }) => {
  const content: string[] = []
  for (const role of roles) {
    await page.goto('/?view=' + role + '-orders')
    await page.getByRole('button', { name: 'Открыть заказ DEMO-003', exact: true }).click()
    content.push(await page.getByTestId('order-detail').innerText())
  }
  expect(content[0]).toBe(content[1])
})

test('touch detail/back restores the originating order and scroll position', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 740 }, hasTouch: true })
  try {
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:5173/?view=manager-orders')
    const opener = page.getByRole('button', { name: 'Открыть заказ DEMO-006', exact: true })
    await opener.scrollIntoViewIfNeeded()
    const originalY = await page.evaluate(() => window.scrollY)
    await opener.tap()
    await expect(page.getByTestId('order-detail')).toBeVisible()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    await page.getByRole('button', { name: 'К списку заказов', exact: true }).tap()
    await expect(opener).toBeFocused()
    expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(originalY, 0)
  } finally {
    await context.close()
  }
})

