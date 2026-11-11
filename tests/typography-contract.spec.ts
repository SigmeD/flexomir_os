import { expect, test, type Page } from '@playwright/test'

for (const role of ['client', 'manager']) {
  test(`order status role: ${role} drafts and details share responsive size without changing secondary text`, async ({ page }) => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 })
      const size = width >= 1024 ? '14px' : '12px'
      await page.goto(`/?view=${role}-orders`)
      await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
      const draftStatus = page.locator('.fos-page-header__subtitle')
      await expect(draftStatus).toHaveText('Черновик')
      await expect(draftStatus).toHaveCSS('font-size', size)
      await expect(draftStatus).toHaveCSS('line-height', '18px')
      await page.goto(`/?view=${role}-orders`)
      await page.locator('[data-order-open="DEMO-003"]').click()
      const detailStatus = page.getByTestId('order-detail-status')
      await expect(detailStatus).toHaveText('В работе')
      await expect(detailStatus).toHaveCSS('font-size', size)
      await expect(detailStatus).toHaveCSS('font-weight', '400')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    await page.evaluate(() => document.documentElement.style.setProperty('--fos-type-order-status-size', '15px'))
    await expect(page.getByTestId('order-detail-status')).toHaveCSS('font-size', '15px')
    await page.goto('/?view=client-layouts')
    await page.getByTestId('layout-row-demo-layout-01').click()
    await page.evaluate(() => document.documentElement.style.setProperty('--fos-type-order-status-size', '15px'))
    const secondary = page.locator('.fos-page-header__subtitle')
    await expect(secondary).toBeVisible()
    await expect(secondary).toHaveCSS('font-size', '12px')
    await expect(secondary).toHaveCSS('line-height', '18px')
  })
}

test('navigation and popup items share the Owner 14/18 Medium role without changing row geometry', async ({ page }) => {
  test.setTimeout(60000)
  async function itemType(selector: string, height: number) {
    const items = page.locator(selector)
    // Wait for React/layout readiness before enumerating dynamically rendered items.
    await expect(items.first()).toBeVisible()
    await items.first().evaluate(element => Promise.all(element.closest('[data-fos-popup-surface]')?.getAnimations().map(animation => animation.finished) ?? []))
    for (const item of await items.all()) {
      await expect(item).toHaveCSS('font-family', /Manrope/)
      await expect(item).toHaveCSS('font-size', '14px')
      await expect(item).toHaveCSS('line-height', '18px')
      await expect(item).toHaveCSS('font-weight', '500')
      expect((await item.boundingBox())!.height).toBeCloseTo(height, 1)
    }
  }
  for (const role of ['client', 'manager']) for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/?view=' + role + '-orders')
    await page.evaluate(() => document.fonts.ready)
    if (width < 1024) await page.getByTestId('navigation-drawer-trigger').click()
    await itemType('.fos-sidebar-nav__item:visible', 44)
    if (width < 1024) await page.keyboard.press('Escape')
    await page.getByTestId('account-menu-trigger').click()
    await itemType('.fos-account-menu__item', 56)
    // Identity is a separate role, not a menu command.
    await expect(page.locator('.fos-account-menu__copy strong')).toHaveCSS('font-size', '16px')
    await expect(page.locator('.fos-account-menu__copy strong')).toHaveCSS('font-weight', '600')
    await expect(page.locator('.fos-account-menu__copy small')).toHaveCSS('font-size', '12px')
    await page.keyboard.press('Escape')
    if (role === 'client') {
      await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
      await page.getByRole('button', { name: 'Ещё', exact: true }).click()
      await itemType('.fos-overflow__item', 48)
    }
  }
  await page.goto('/?view=glass-filter-lab')
  await page.locator('[data-glass-select-trigger]').click()
  await itemType('[role="option"]', 36)
})

test('changing the base item role propagates to navigation and body-portalled popup aliases', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?view=client-orders')
  await page.getByTestId('account-menu-trigger').click()
  await page.evaluate(() => document.documentElement.style.setProperty('--fos-type-menu-item', '500 16px/22px var(--fos-font-family)'))
  for (const selector of ['.fos-sidebar-nav__item', '.fos-account-menu__item']) {
    await expect(page.locator(selector).first()).toHaveCSS('font-size', '16px')
    await expect(page.locator(selector).first()).toHaveCSS('line-height', '22px')
  }
  await expect(page.locator('.fos-account-menu__copy strong')).toHaveCSS('font-size', '16px')
  await expect(page.locator('.fos-account-menu__copy strong')).toHaveCSS('line-height', '20px')
  await page.evaluate(() => document.documentElement.style.removeProperty('--fos-type-menu-item'))
  await page.emulateMedia({ forcedColors: 'active' })
  await expect(page.locator('.fos-sidebar-nav__item[aria-current="page"]')).toHaveCSS('font-weight', '500')
})

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
