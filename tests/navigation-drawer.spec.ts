import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=navigation-drawer')
  // Keep previous navigation close-after-lens acceptance tests explicit.
  // The isolated preview defaults to the Owner's stay-open mode.
  await page.getByTestId('drawer-mode-close-after-lens').click()
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


test('tapping the already-selected menu item dismisses without fake navigation', async ({ page }) => {
  const trigger = page.getByTestId('navigation-drawer-trigger')
  const panel = await openDrawer(page)
  await panel.getByTestId('sidebar-nav-orders').click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Заказы')
  await expect(trigger).toBeFocused()
})

test('actual wheel scrolling is blocked behind open drawer and resumes after close', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 680 })
  await openDrawer(page)
  await page.mouse.move(10, 550)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(150)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
  await page.mouse.wheel(0, 600)
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
})


test('pointer opening suppresses stale keyboard focus ring; Tab restores it for accessibility', async ({ page }) => {
  const trigger = page.getByTestId('navigation-drawer-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')
  let panel = page.getByTestId('navigation-drawer-panel')
  await expect(panel).toHaveAttribute('data-focus-mode', 'keyboard')
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()

  // A pointer click after keyboard Escape must NOT show a permanent blue
  // outline over the neutral selected glass. Keyboard Tab must restore it.
  await trigger.click()
  panel = page.getByTestId('navigation-drawer-panel')
  const selected = panel.getByTestId('sidebar-nav-orders')
  await expect(panel).toHaveAttribute('data-focus-mode', 'pointer')
  await expect(selected).toBeFocused()
  await expect(selected).toHaveCSS('outline-style', 'none')

  await page.keyboard.press('Tab')
  const next = panel.getByTestId('sidebar-nav-artworks')
  await expect(panel).toHaveAttribute('data-focus-mode', 'keyboard')
  await expect(next).toBeFocused()
  await expect(next).toHaveCSS('outline-style', 'solid')
})


test('selected lens visibly reaches its destination BEFORE drawer starts closing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const panel = await openDrawer(page)
  const layer = page.getByTestId('navigation-drawer-layer')
  const trigger = page.getByTestId('navigation-drawer-trigger')
  const lens = panel.getByTestId('sidebar-selected-lens')

  await panel.getByTestId('sidebar-nav-support').click()
  // Parent selected state updates immediately, but opening stays true until
  // the shared spring reports REST and its geometry matches the chosen row.
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Поддержка')
  await expect(layer).toHaveAttribute('data-selection-transition', 'moving')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: —')
  await expect(lens).toHaveAttribute('data-travel-target', '96')
  await expect(lens).toHaveAttribute('data-motion-state', 'moving')

  // Must complete during the native spring, not via the 5s safety watchdog.
  await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: Поддержка', {
    timeout: 3000,
  })
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
})

test('two rapid taps on the same destination do not cut off the ongoing lens transition', async ({ page }) => {
  await openDrawer(page)
  const layer = page.getByTestId('navigation-drawer-layer')
  const trigger = page.getByTestId('navigation-drawer-trigger')
  const support = page.getByTestId('navigation-drawer-panel').getByTestId('sidebar-nav-support')
  // Both events happen before a paint; route state is coalesced by React.
  await support.evaluate(element => {
    (element as HTMLButtonElement).click()
    ;(element as HTMLButtonElement).click()
  })
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Поддержка')
  await expect(layer).toHaveAttribute('data-selection-transition', 'moving')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: Поддержка', {
    timeout: 6000,
  })
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('rapid re-targeting waits for the LAST selected lens destination', async ({ page }) => {
  await openDrawer(page)
  const panel = page.getByTestId('navigation-drawer-panel')
  await panel.getByTestId('sidebar-nav-artworks').evaluate(el => (el as HTMLButtonElement).click())
  await panel.getByTestId('sidebar-nav-support').evaluate(el => (el as HTMLButtonElement).click())
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Поддержка')
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: Поддержка', {
    timeout: 6000,
  })
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
})

test('Escape during moving lens closes immediately and never fires a route commit', async ({ page }) => {
  await openDrawer(page)
  await page.getByTestId('navigation-drawer-panel').getByTestId('sidebar-nav-support').click()
  await expect(page.getByTestId('navigation-drawer-layer')).toHaveAttribute('data-selection-transition', 'moving')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
  await page.waitForTimeout(1000)
  await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: —')
})

test('reduced-motion selects and closes without waiting for spring movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDrawer(page)
  await page.getByTestId('navigation-drawer-panel').getByTestId('sidebar-nav-support').click()
  await expect(page.getByTestId('drawer-selection')).toHaveText('Выбрано: Поддержка')
  await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: Поддержка', {
    timeout: 1500,
  })
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
})


test('mobile/tablet show the EXACT SAME optional SVG icon set as Desktop SidebarNav', async ({ page }) => {
  // Read both role icon definitions from their rendered Desktop SidebarNav.
  const desktopSVGs: Record<string, Record<string, string>> = {}
  await page.goto('/?view=sidebar-nav')
  for (const role of ['client', 'manager']) {
    desktopSVGs[role] = {}
    const nav = page.getByTestId('sidebar-lab-' + role).getByRole('navigation')
    for (const id of ['orders', role === 'client' ? 'artworks' : 'clients', 'support']) {
      desktopSVGs[role][id] = await nav.getByTestId('sidebar-nav-' + id)
        .locator('.fos-sidebar-nav__icon svg')
        .evaluate(el => el.innerHTML)
    }
  }
  await page.goto('/?view=navigation-drawer')
  for (const width of [390, 768, 320]) {
    await page.setViewportSize({ width, height: width === 768 ? 1024 : 844 })
    for (const role of ['client', 'manager']) {
      await page.getByTestId('drawer-role-' + role).click()
      const panel = await openDrawer(page)
      const nav = panel.getByRole('navigation')
      for (const id of ['orders', role === 'client' ? 'artworks' : 'clients', 'support']) {
        const button = nav.getByTestId('sidebar-nav-' + id)
        const svg = button.locator('.fos-sidebar-nav__icon svg')
        await expect(svg).toHaveCount(1)
        await expect(svg).toHaveAttribute('aria-hidden', 'true')
        await expect(svg).toHaveAttribute('focusable', 'false')
        // SVG layout is 19px. The selected lens can optically scale it
        // to 1.022x without changing the underlying reusable icon dimensions.
        await expect(svg).toHaveCSS('width', '19px')
        await expect(svg).toHaveCSS('height', '19px')
        expect(await svg.evaluate(el => el.innerHTML)).toBe(desktopSVGs[role][id])
      }
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
    }
  }
})

test('Owner keep-open mode: choose, watch same lens settle, choose again; dismiss only outside/Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByTestId('drawer-mode-stay-open').click()
  await expect(page.getByTestId('drawer-mode-stay-open')).toHaveAttribute('aria-pressed', 'true')
  const panel = await openDrawer(page)
  const nav = panel.getByRole('navigation')
  const lens = panel.getByTestId('sidebar-selected-lens')
  for (const [id, label, target] of [
    ['support', 'Поддержка', '96'],
    ['artworks', 'Макеты', '48'],
  ] as const) {
    await nav.getByTestId('sidebar-nav-' + id).click()
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveAttribute('data-selection-transition', 'moving')
    await expect(lens).toHaveAttribute('data-travel-target', target)
    await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: ' + label, {
      timeout: 6000,
    })
    await expect(lens).toHaveAttribute('data-motion-state', 'settled')
    await expect(page.getByTestId('navigation-drawer-layer')).toHaveAttribute('data-selection-transition', 'idle')
    await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'true')
  }
  // Clicking active item also must not dismiss keep-open mode.
  await nav.getByTestId('sidebar-nav-artworks').click()
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'true')
  const scrim = page.getByTestId('navigation-drawer-scrim')
  await scrim.click({ position: { x: 12, y: 440 } })
  await expect(page.getByTestId('navigation-drawer-trigger')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
})

test('keep-open mode does not hide selected lens or change item geometry when icons are present', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByTestId('drawer-mode-stay-open').click()
  const panel = await openDrawer(page)
  // Panel scales 0.985→1 during its 220ms opening animation. Measure the
  // actual settled Figma layout, not the temporary transformed box.
  await page.waitForTimeout(260)
  const rows = panel.getByRole('navigation').getByRole('button')
  for (const row of await rows.all()) {
    await expect(row).toHaveCSS('height', '44px')
    await expect(row.locator('.fos-sidebar-nav__icon')).toHaveCSS('width', '19px')
  }
  const selected = panel.getByTestId('sidebar-nav-orders')
  const lens = panel.getByTestId('sidebar-selected-lens')
  await expect(lens).toHaveAttribute('data-tone', 'neutral')
  await expect(selected).toHaveAttribute('aria-current', 'page')
  await expect(lens).toHaveAttribute('data-motion', 'travel')
  expect((await lens.boundingBox())?.height).toBe(44)
  const scrim = page.getByTestId('navigation-drawer-scrim')
  await scrim.click({ position: { x: 12, y: 440 } })
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
})

test('keep-open mode supports keyboard Escape even after the lens completes', async ({ page }) => {
  await page.getByTestId('drawer-mode-stay-open').click()
  const panel = await openDrawer(page)
  await panel.getByTestId('sidebar-nav-support').click()
  await expect(page.getByTestId('drawer-settled')).toHaveText('Линза завершила переход: Поддержка', {
    timeout: 6000,
  })
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 3500 })
  await expect(page.getByTestId('navigation-drawer-trigger')).toBeFocused()
})
