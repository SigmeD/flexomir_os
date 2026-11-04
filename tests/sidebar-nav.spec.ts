import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=sidebar-nav')
})

test('shared Figma geometry and a single lens per role', async ({ page }) => {
  const manager = page.getByTestId('sidebar-lab-manager')
  const client = page.getByTestId('sidebar-lab-client')
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    for (const role of [manager, client]) {
      await expect(role.getByTestId('sidebar-selected-lens')).toHaveCount(1)
      const nav = role.getByRole('navigation')
      const navBox = await nav.boundingBox()
      expect(navBox?.width).toBe(208)
      const buttons = nav.getByRole('button')
      await expect(buttons).toHaveCount(3)
      const rows = await Promise.all([buttons.nth(0).boundingBox(), buttons.nth(1).boundingBox()])
      expect(rows[0]?.height).toBe(44)
      expect(rows[1]?.height).toBe(44)
      expect((rows[1]?.y ?? 0) - (rows[0]?.y ?? 0)).toBe(48)
      const lensBox = await role.getByTestId('sidebar-selected-lens').boundingBox()
      expect(lensBox?.width).toBe(208)
      expect(lensBox?.height).toBe(44)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})

test('selected lens follows click only; hover does not switch route', async ({ page }) => {
  const manager = page.getByTestId('sidebar-lab-manager')
  const orders = manager.getByTestId('sidebar-nav-orders')
  const clients = manager.getByTestId('sidebar-nav-clients')
  const lens = manager.getByTestId('sidebar-selected-lens')

  await expect(orders).toHaveAttribute('aria-current', 'page')
  await clients.hover()
  await expect(orders).toHaveAttribute('aria-current', 'page')
  await expect(lens).toHaveAttribute('data-travel-target', '0')
  await clients.click()
  await expect(clients).toHaveAttribute('aria-current', 'page')
  await expect(orders).not.toHaveAttribute('aria-current', 'page')
  await expect(lens).toHaveAttribute('data-travel-target', '48')
  await expect(manager.getByRole('status')).toHaveText('Выбрано: Клиенты')
  await expect(lens).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  const pos = await Promise.all([lens.boundingBox(), clients.boundingBox()])
  expect(Math.abs((pos[0]?.y ?? 0) - (pos[1]?.y ?? 0))).toBeLessThan(1.25)
})

test('independent selection between Manager and Client nav instances', async ({ page }) => {
  const client = page.getByTestId('sidebar-lab-client')
  const manager = page.getByTestId('sidebar-lab-manager')
  await client.getByTestId('sidebar-nav-artworks').click()
  await expect(client.getByTestId('sidebar-nav-artworks')).toHaveAttribute('aria-current', 'page')
  await expect(manager.getByTestId('sidebar-nav-orders')).toHaveAttribute('aria-current', 'page')
  await client.getByTestId('sidebar-nav-support').click()
  await expect(client.getByRole('status')).toHaveText('Выбрано: Поддержка')
  await expect(client.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-travel-target', '96')
  await expect(manager.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-travel-target', '0')
})

test('keyboard Enter/Space, focus, and label single-layer check', async ({ page }) => {
  const manager = page.getByTestId('sidebar-lab-manager')
  const clients = manager.getByTestId('sidebar-nav-clients')
  const support = manager.getByTestId('sidebar-nav-support')
  await clients.focus()
  await expect(clients).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(clients).toHaveAttribute('aria-current', 'page')
  await support.focus()
  await page.keyboard.press('Space')
  await expect(support).toHaveAttribute('aria-current', 'page')
  await expect(manager.getByText('Поддержка')).toHaveCount(1)
})

test('reduced motion and forced colors do not affect semantic selection', async ({ page }) => {
  const client = page.getByTestId('sidebar-lab-client')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await client.getByTestId('sidebar-nav-support').click()
  await expect(client.getByTestId('sidebar-nav-support')).toHaveAttribute('aria-current', 'page')
  await expect(client.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'off')
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await client.getByTestId('sidebar-nav-orders').click()
  await expect(client.getByTestId('sidebar-nav-orders')).toHaveAttribute('aria-current', 'page')
  await expect(client.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-optics-mode', 'high-contrast')
})

test('touch changes only the lab selection without routing away', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  try {
    const page = await context.newPage()
    await page.goto('/?view=sidebar-nav')
    await page.getByTestId('sidebar-lab-manager').getByTestId('sidebar-nav-support').tap()
    await expect(page.getByTestId('sidebar-lab-manager').getByRole('status')).toHaveText('Выбрано: Поддержка')
    expect(new URL(page.url()).searchParams.get('view')).toBe('sidebar-nav')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  } finally {
    await context.close()
  }
})

test('screenshot for owner visual review', async ({ page }, testInfo) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 })
    await page.screenshot({
      path: testInfo.outputPath('sidebar-' + width + '-idle.png'),
      fullPage: true,
      animations: 'disabled',
    })
    const client = page.getByTestId('sidebar-lab-client')
    await client.getByTestId('sidebar-nav-support').click()
    await expect(client.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
    await page.screenshot({
      path: testInfo.outputPath('sidebar-' + width + '-selected.png'),
      fullPage: true,
      animations: 'disabled',
    })
    await client.getByTestId('sidebar-nav-orders').click()
    await expect(client.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  }
})
