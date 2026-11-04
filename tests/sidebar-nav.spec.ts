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
  await expect(manager.getByRole('navigation').getByText('Поддержка')).toHaveCount(1)
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
    const manager = page.getByTestId('sidebar-lab-manager')
    await manager.getByTestId('sidebar-nav-clients').hover()
    await page.waitForTimeout(210)
    await page.screenshot({
      path: testInfo.outputPath('sidebar-' + width + '-hover-color-only.png'),
      fullPage: true,
      animations: 'disabled',
    })
    await page.mouse.move(1200, 600)
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


function scaleFromTransform(transform: string) {
  if (transform === 'none') return 1
  const matrix = /matrix\(([^)]+)\)/.exec(transform)
  return matrix ? Number(matrix[1].split(',')[0].trim()) : NaN
}

test('reference 2.2.5 C label magnification follows the selected lens', async ({ page }) => {
  const manager = page.getByTestId('sidebar-lab-manager')
  const orders = manager.getByTestId('sidebar-nav-orders')
  const clients = manager.getByTestId('sidebar-nav-clients')
  const support = manager.getByTestId('sidebar-nav-support')
  const getScale = async (button: typeof orders) => {
    const value = await button.locator('.fos-sidebar-nav__label').evaluate(node => getComputedStyle(node).transform)
    return scaleFromTransform(value)
  }

  await page.mouse.move(1200, 600)
  await expect.poll(() => getScale(orders)).toBeGreaterThan(1.040)
  expect(await getScale(clients)).toBeCloseTo(1, 2)

  await support.click()
  await page.mouse.move(1200, 600)
  await expect(manager.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  await expect.poll(() => getScale(support)).toBeGreaterThan(1.040)
  expect(await getScale(orders)).toBeCloseTo(1, 2)
  expect(await getScale(clients)).toBeCloseTo(1, 2)
  expect(await getScale(support)).toBeLessThan(1.046)
})

test('hover only changes color; focus only adds outline; zoom follows click and lens arrival', async ({ page }) => {
  const manager = page.getByTestId('sidebar-lab-manager')
  const orders = manager.getByTestId('sidebar-nav-orders')
  const clients = manager.getByTestId('sidebar-nav-clients')
  const lens = manager.getByTestId('sidebar-selected-lens')
  const label = clients.locator('.fos-sidebar-nav__label')
  const icon = clients.locator('.fos-sidebar-nav__icon')
  const labelScale = async () => scaleFromTransform(await label.evaluate(el => getComputedStyle(el).transform))
  const iconScale = async () => scaleFromTransform(await icon.evaluate(el => getComputedStyle(el).transform))

  await page.mouse.move(1200, 600)
  await expect(clients).toHaveCSS('color', 'rgb(115, 119, 129)')
  await clients.hover()
  await expect(clients).toHaveCSS('color', 'rgb(62, 101, 120)')
  expect(await labelScale()).toBeCloseTo(1, 3)
  expect(await iconScale()).toBeCloseTo(1, 3)
  await expect(orders).toHaveAttribute('aria-current', 'page')
  await expect(lens).toHaveAttribute('data-travel-target', '0')

  await clients.focus()
  await expect(clients).toBeFocused()
  expect(await labelScale()).toBeCloseTo(1, 3)
  expect(await iconScale()).toBeCloseTo(1, 3)
  await expect(orders).toHaveAttribute('aria-current', 'page')

  await clients.click()
  await page.mouse.move(1200, 600)
  await expect(lens).toHaveAttribute('data-travel-target', '48')
  await expect(lens).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  await expect.poll(labelScale).toBeGreaterThan(1.040)
  await expect.poll(iconScale).toBeGreaterThan(1.020)
})

test('font scale fallback in reduced motion and forced colors', async ({ page }) => {
  const client = page.getByTestId('sidebar-lab-client')
  const artworks = client.getByTestId('sidebar-nav-artworks')
  const label = artworks.locator('.fos-sidebar-nav__label')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await artworks.hover()
  await expect(label).toHaveCSS('transform', 'none')
  await artworks.click()
  await expect(artworks).toHaveAttribute('aria-current', 'page')
  await expect(label).toHaveCSS('transform', 'none')
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'no-preference' })
  await expect(label).toHaveCSS('transform', 'none')
})


test('optional reference SVG icons are correctly sized and decorative across both roles', async ({ page }) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    for (const role of ['manager', 'client']) {
      const nav = page.getByTestId('sidebar-lab-' + role).getByRole('navigation')
      for (const item of ['orders', role === 'client' ? 'artworks' : 'clients', 'support']) {
        const button = nav.getByTestId('sidebar-nav-' + item)
        const icon = button.locator('.fos-sidebar-nav__icon svg')
        await expect(icon).toHaveCount(1)
        await expect(icon).toHaveAttribute('aria-hidden', 'true')
        await expect(icon).toHaveAttribute('focusable', 'false')
        const rect = await icon.boundingBox()
        expect(rect?.width).toBeGreaterThanOrEqual(18.9)
        expect(rect?.height).toBeGreaterThanOrEqual(18.9)
        await expect(button).toHaveAccessibleName(
          item === 'orders' ? 'Заказы' : item === 'artworks' ? 'Макеты' : item === 'clients' ? 'Клиенты' : 'Поддержка',
        )
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('selected icon +2.2% lens magnification; hovering only changes color', async ({ page }) => {
  const nav = page.getByTestId('sidebar-lab-client').getByRole('navigation')
  const orders = nav.getByTestId('sidebar-nav-orders')
  const artworks = nav.getByTestId('sidebar-nav-artworks')
  const selectedIcon = orders.locator('.fos-sidebar-nav__icon')
  const targetIcon = artworks.locator('.fos-sidebar-nav__icon')
  const scale = async (locator: typeof selectedIcon) =>
    scaleFromTransform(await locator.evaluate(el => getComputedStyle(el).transform))

  await page.mouse.move(1200, 600)
  await expect.poll(() => scale(selectedIcon)).toBeGreaterThan(1.020)
  await artworks.hover()
  await expect(artworks).toHaveCSS('color', 'rgb(62, 101, 120)')
  expect(await scale(targetIcon)).toBeCloseTo(1, 3)
  await expect(orders).toHaveAttribute('aria-current', 'page')
  await expect(nav.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-travel-target', '0')

  await artworks.click()
  await page.mouse.move(1200, 600)
  await expect(nav.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  await expect.poll(() => scale(targetIcon)).toBeGreaterThan(1.020)
  await expect.poll(() => scale(selectedIcon)).toBeCloseTo(1, 2)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await orders.hover()
  await expect(selectedIcon).toHaveCSS('transform', 'none')
  await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' })
  await expect(selectedIcon).toHaveCSS('transform', 'none')
})


test('neutral glass tint avoids blue coat on grey surface; cool reference remains selectable', async ({ page }) => {
  const neutral = page.getByTestId('sidebar-tone-neutral')
  const reference = page.getByTestId('sidebar-tone-reference')
  const manager = page.getByTestId('sidebar-lab-manager')
  const client = page.getByTestId('sidebar-lab-client')
  const lens = manager.getByTestId('sidebar-selected-lens')

  await expect(neutral).toHaveAttribute('aria-pressed', 'true')
  await expect(reference).toHaveAttribute('aria-pressed', 'false')
  for (const role of [manager, client]) {
    await expect(role.getByRole('navigation')).toHaveAttribute('data-glass-tone', 'neutral')
    await expect(role.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-tone', 'neutral')
  }
  await expect.poll(async () => lens.evaluate(node => getComputedStyle(node).getPropertyValue('--fos-rim-rgb').trim())).toBe('147 150 155')
  await expect.poll(async () => lens.evaluate(node => getComputedStyle(node).getPropertyValue('--fos-lowlight-rgb').trim())).toBe('110 112 116')
  await expect(lens).toHaveAttribute('data-motion', 'travel')

  await reference.click()
  await expect(reference).toHaveAttribute('aria-pressed', 'true')
  await expect(lens).toHaveAttribute('data-tone', 'reference')
  await expect.poll(async () => lens.evaluate(node => getComputedStyle(node).getPropertyValue('--fos-rim-rgb').trim())).toBe('133 169 191')
  await expect.poll(async () => lens.evaluate(node => getComputedStyle(node).getPropertyValue('--fos-lowlight-rgb').trim())).toBe('111 159 186')

  await neutral.click()
  await manager.getByTestId('sidebar-nav-support').click()
  await expect(manager.getByTestId('sidebar-nav-support')).toHaveAttribute('aria-current', 'page')
  await expect(lens).toHaveAttribute('data-tone', 'neutral')
  await expect(lens).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  await expect(lens).toHaveAttribute('data-travel-target', '96')
})

test('Owner A/B screenshots: neutral grey versus original cool glass without moving navigation', async ({ page }, testInfo) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 })
    await page.getByTestId('sidebar-tone-neutral').click()
    await page.mouse.move(1200, 800)
    await page.screenshot({
      path: testInfo.outputPath('sidebar-tone-neutral-' + width + '.png'),
      fullPage: true,
      animations: 'disabled',
    })
    await page.getByTestId('sidebar-tone-reference').click()
    await page.screenshot({
      path: testInfo.outputPath('sidebar-tone-reference-' + width + '.png'),
      fullPage: true,
      animations: 'disabled',
    })
  }
})
