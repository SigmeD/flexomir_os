import { expect, test, type Page } from '@playwright/test'

async function openProfile(page: Page) {
  await page.goto('/?demoTools=1')
  await page.locator('[data-testid="account-menu-trigger"]:visible').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
  await page.evaluate(() => document.fonts.ready)
}

test('Profile and Manager PageHeader keep the FOS responsive H1 role', async ({ page }) => {
  await openProfile(page)
  const profileTitle = page.locator('.fos-profile-page__header .fos-page-header__row h1')
  const expected = [
    { width: 1440, height: 900, size: '30px', line: '40px' },
    { width: 1024, height: 768, size: '30px', line: '40px' },
    { width: 768, height: 1024, size: '26px', line: '36px' },
    { width: 390, height: 844, size: '22px', line: '30px' },
    { width: 320, height: 812, size: '22px', line: '30px' },
  ]

  for (const viewport of expected) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await expect(profileTitle).toHaveCSS('font-size', viewport.size)
    await expect(profileTitle).toHaveCSS('line-height', viewport.line)
    await expect(profileTitle).toHaveCSS('font-family', /Manrope/)
  }

  await page.goto('/?view=manager-orders')
  await page.evaluate(() => document.fonts.ready)
  const managerTitle = page.locator('.fos-page-header__row h1')
  for (const viewport of expected) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await expect(managerTitle).toHaveCSS('font-size', viewport.size)
    await expect(managerTitle).toHaveCSS('line-height', viewport.line)
  }

  await page.goto('/?view=client-orders')
  await page.evaluate(() => document.fonts.ready)
  const clientTitle = page.locator('.fos-page-header__row h1')
  for (const viewport of expected) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await expect(clientTitle).toHaveCSS('font-size', viewport.size)
    await expect(clientTitle).toHaveCSS('line-height', viewport.line)
  }
})

test('Profile photo actions retain shared 14/20 text at compact widths', async ({ page }) => {
  await openProfile(page)
  const action = page.locator('.fos-profile-photo__actions .fos-action').first()

  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 })
    await expect(action).toHaveCSS('font-size', '14px')
    await expect(action).toHaveCSS('line-height', '20px')
    const height = await action.evaluate(element => element.getBoundingClientRect().height)
    expect(height).toBeGreaterThanOrEqual(40)
  }
})

test('GlassSelect trigger and body portal use the canonical family after font load', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  await page.evaluate(() => document.fonts.ready)
  const trigger = page.locator('[data-glass-select-trigger]')
  await trigger.click()
  const content = page.locator('[data-glass-select-content]')
  await expect(content).toBeVisible()

  const [triggerFamily, contentFamily] = await page.evaluate(() => [
    getComputedStyle(document.querySelector('[data-glass-select-trigger]')!).fontFamily,
    getComputedStyle(document.querySelector('[data-glass-select-content]')!).fontFamily,
  ])
  expect(triggerFamily).toContain('Manrope')
  expect(contentFamily).toBe(triggerFamily)
  expect(await page.evaluate(() => document.fonts.check('14px Manrope'))).toBe(true)
})

test('Composer empty product copy uses the shared 14/20 body role', async ({ page }) => {
  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const emptyCopy = page.locator('.fos-order-composer__products[data-empty] .fos-order-detail__empty')
  await expect(emptyCopy).toBeVisible()
  await expect(emptyCopy).toHaveCSS('font-size', '14px')
  await expect(emptyCopy).toHaveCSS('line-height', '20px')
})

