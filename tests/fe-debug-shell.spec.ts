import { expect, test } from '@playwright/test'

test('desktop Sidebar uses the CURRENT brand-to-navigation spacing and pins account to a short viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 })
  await page.goto('/?view=client-orders&demoTools=1')

  const brand = page.locator('.fos-app-shell__brand')
  const nav = page.getByRole('navigation', { name: 'Навигация клиента', exact: true })
  const footer = page.locator('.fos-account-footer')
  const brandBox = await brand.boundingBox()
  const navBox = await nav.boundingBox()
  expect(brandBox).not.toBeNull()
  expect(navBox).not.toBeNull()
  expect(navBox!.y - (brandBox!.y + brandBox!.height)).toBe(52)

  for (const height of [600, 700, 850, 960]) {
    await page.setViewportSize({ width: 1440, height })
    const footerBox = await footer.boundingBox()
    expect(footerBox).not.toBeNull()
    expect(footerBox!.y + footerBox!.height).toBeCloseTo(height, 0)
  }

  await expect(nav).toHaveCSS('overflow-y', 'auto')
})

test('demo presentation utility can hide and reopen without changing cabinet geometry', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=client-orders&demoTools=1')

  const shell = page.locator('.fos-app-shell')
  const header = page.getByTestId('app-shell-mobile-header')
  const content = page.getByTestId('client-orders-screen')
  const roleButtons = page.getByRole('group', { name: 'Роль кабинета' })
  const trigger = page.getByRole('button', { name: 'Демо — показать панель демонстрации' })
  await expect(trigger).toBeVisible()
  await expect(roleButtons).toHaveCount(0)
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(roleButtons).toBeVisible()

  const before = await Promise.all([shell, header, content].map(locator => locator.boundingBox()))
  await page.getByRole('button', { name: 'Скрыть панель демонстрации' }).focus()
  await page.keyboard.press('Enter')
  await expect(roleButtons).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Демо — показать панель демонстрации' })).toBeFocused()

  const hidden = await Promise.all([shell, header, content].map(locator => locator.boundingBox()))
  expect(hidden).toEqual(before)

  await page.keyboard.press('Enter')
  await expect(roleButtons).toBeVisible()
  const reopened = await Promise.all([shell, header, content].map(locator => locator.boundingBox()))
  expect(reopened).toEqual(before)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)

  await page.getByRole('button', { name: 'Скрыть панель демонстрации' }).click()
  for (const [width, height] of [[320, 600], [390, 844], [768, 600], [1024, 768], [1440, 900]]) {
    await page.setViewportSize({ width, height })
    const baseline = await Promise.all([shell, header, content].map(locator => locator.boundingBox()))
    await page.getByRole('button', { name: 'Демо — показать панель демонстрации' }).focus()
    await page.keyboard.press('Enter')
    await expect(roleButtons).toBeVisible()
    expect(await Promise.all([shell, header, content].map(locator => locator.boundingBox()))).toEqual(baseline)
    await page.getByRole('button', { name: 'Скрыть панель демонстрации' }).click()
    expect(await Promise.all([shell, header, content].map(locator => locator.boundingBox()))).toEqual(baseline)
    if (width === 390) await page.screenshot({ path: testInfo.outputPath('demo-utility-mobile-collapsed.png'), fullPage: true })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})

test('collapsed demo utilities leave primary page actions reachable', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?view=client-orders&demoTools=1')
  await expect(page.getByRole('button', { name: 'Добавить заказ', exact: true })).toBeEnabled()
  await expect(page.getByTestId('demo-technical-controls')).toHaveCount(0)
  await page.screenshot({ path: testInfo.outputPath('demo-utility-collapsed.png'), fullPage: true })
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await expect(page.getByTestId('order-composer')).toBeVisible()
})
