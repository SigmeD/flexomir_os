import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=navigation-drawer')
})

async function openDrawer(page: import('@playwright/test').Page) {
  const trigger = page.getByTestId('navigation-drawer-trigger')
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('dialog')).toBeVisible()
  return page.getByTestId('navigation-drawer-panel')
}

test('canonical CURRENT Figma mobile 296×229, tablet 320×229, top72 right20', async ({ page }) => {
  const cases = [
    { viewport: 390, width: 296, x: 74, inner: 264 },
    { viewport: 768, width: 320, x: 428, inner: 288 },
    { viewport: 320, width: 280, x: 20, inner: 248 },
  ]
  for (const { viewport, width, x, inner } of cases) {
    await page.setViewportSize({ width: viewport, height: 900 })
    const panel = await openDrawer(page)
    // getBoundingClientRect includes the temporary open scale (0.985→1).
    // Wait for visual settling before comparing the actual Figma coordinates.
    await page.waitForTimeout(260)
    const bbox = await panel.boundingBox()
    expect(bbox?.width).toBe(width)
    expect(bbox?.height).toBe(229)
    expect(bbox?.x).toBe(x)
    expect(bbox?.y).toBe(72)
    await expect(panel).toHaveCSS('border-radius', '20px')
    const rows = panel.getByRole('navigation').getByRole('button')
    await expect(rows).toHaveCount(3)
    for (const row of await rows.all()) {
      const b = await row.boundingBox()
      expect(b?.width).toBe(inner)
      expect(b?.height).toBe(44)
    }
    const lens = panel.getByTestId('sidebar-selected-lens')
    expect((await lens.boundingBox())?.width).toBe(inner)
    await expect(lens).toHaveAttribute('data-tone', 'neutral')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
  }
})

test('menu icon is Figma 20px visual glyph inside accessible 44px trigger', async ({ page }) => {
  const trigger = page.getByTestId('navigation-drawer-trigger')
  await expect(trigger).toHaveAccessibleName('Открыть меню')
  expect((await trigger.boundingBox())?.width).toBe(44)
  expect((await trigger.boundingBox())?.height).toBe(44)
  const glyph = trigger.locator('.fos-nav-drawer__hamburger')
  expect((await glyph.boundingBox())?.width).toBe(20)
  expect((await glyph.boundingBox())?.height).toBe(20)
  await expect(glyph.locator('i')).toHaveCount(3)
})

test('opens with focus on current item and traps Tab and Shift+Tab within dialog', async ({ page }) => {
  await openDrawer(page)
  const panel = page.getByTestId('navigation-drawer-panel')
  const orders = panel.getByTestId('sidebar-nav-orders')
  const support = panel.getByTestId('sidebar-nav-support')
  await expect(orders).toBeFocused()
  await expect(page.locator('#root')).toHaveAttribute('inert', '')
  await page.keyboard.press('Shift+Tab')
  await expect(support).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(orders).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(panel.getByTestId('sidebar-nav-artworks')).toBeFocused()
  await expect(orders).toHaveAttribute('aria-current', 'page')
})

test('Escape closes and restores opener focus and background scrollability', async ({ page }) => {
  const trigger = page.getByTestId('navigation-drawer-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  await expect(page.locator('html')).toHaveCSS('overflow', 'hidden')
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden')
  await expect(page.locator('#root')).not.toHaveAttribute('inert', '')
  await expect(trigger).toBeFocused()
})

test('scrim click dismisses modal; background cannot be interacted with while open', async ({ page }) => {
  const trigger = page.getByTestId('navigation-drawer-trigger')
  await openDrawer(page)
  const scrim = page.getByTestId('navigation-drawer-scrim')
  await expect(scrim).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.16)')
  await expect(page.getByTestId('drawer-role-manager')).toHaveAttribute('aria-pressed', 'false')
  await scrim.click({ position: { x: 15, y: 440 } })
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
})

test('selection uses accepted SidebarNav, closes menu, and does not navigate to API/routes', async ({ page }) => {
  const panel = await openDrawer(page)
  await panel.getByTestId('sidebar-nav-artworks').click()
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Макеты')
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
  expect(new URL(page.url()).searchParams.get('view')).toBe('navigation-drawer')

  const nextPanel = await openDrawer(page)
  await expect(nextPanel.getByTestId('sidebar-nav-artworks')).toHaveAttribute('aria-current', 'page')
  await expect(nextPanel.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-tone', 'neutral')
})

test('Client and Manager use one component and preserve independent selections', async ({ page }) => {
  await openDrawer(page)
  await page.getByTestId('navigation-drawer-panel').getByTestId('sidebar-nav-support').click()
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Поддержка')
  await page.getByTestId('drawer-role-manager').click()
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Заказы')
  const managerPanel = await openDrawer(page)
  await expect(managerPanel).toHaveAttribute('aria-label', 'Меню менеджера')
  await expect(managerPanel.getByText('Менеджер · тестовый режим')).toBeVisible()
  await managerPanel.getByTestId('sidebar-nav-clients').click()
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Клиенты')
  await page.getByTestId('drawer-role-client').click()
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Поддержка')
  await openDrawer(page)
  await expect(page.getByTestId('navigation-drawer-panel').getByText('ООО «Клиент»')).toBeVisible()
})

test('touch at 390px opens and closes on scrim without horizontal overflow', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  try {
    await page.goto('/?view=navigation-drawer')
    await page.getByTestId('navigation-drawer-trigger').tap()
    await expect(page.getByRole('dialog', { name: 'Меню клиента' })).toBeVisible()
    await page.getByTestId('navigation-drawer-scrim').tap({ position: { x: 15, y: 400 } })
    await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  } finally {
    await context.close()
  }
})

test('reduced motion and forced-colors preserve semantics and solid menu fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDrawer(page)
  const panel = page.getByTestId('navigation-drawer-panel')
  await expect(panel).toHaveCSS('animation-duration', '1e-05s')
  await page.getByTestId('navigation-drawer-panel').getByTestId('sidebar-nav-support').click()
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Поддержка')
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await openDrawer(page)
  await expect(panel).toHaveCSS('backdrop-filter', 'none')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
})

test('visual review captures Tablet/Mobile with open menu', async ({ page }, testInfo) => {
  for (const width of [768, 390]) {
    await page.setViewportSize({ width, height: width === 768 ? 1024 : 844 })
    await page.screenshot({
      path: testInfo.outputPath('navigation-drawer-' + width + '-closed.png'),
      fullPage: false,
      animations: 'disabled',
    })
    await openDrawer(page)
    await page.waitForTimeout(250)
    await page.screenshot({
      path: testInfo.outputPath('navigation-drawer-' + width + '-open.png'),
      fullPage: false,
      animations: 'disabled',
    })
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
  }
})
