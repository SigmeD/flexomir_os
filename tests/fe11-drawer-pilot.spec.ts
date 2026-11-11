import { expect, test } from '@playwright/test'

type GeometryFrame = { time: number; y: number; height: number; same: boolean; labels: Array<{ id?: string; top: number; bottom: number; scale: number; selected: boolean }> }

test.use({ video: 'on' })
test.beforeEach(async ({ page }) => { await page.goto('/?view=navigation-drawer') })

test('accepted popup hover previews one lens while the real navigation selection remains unchanged', async ({ page }, info) => {
  test.skip(info.project.use.hasTouch === true, 'Pointer preview is covered on desktop engines')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByTestId('navigation-drawer-trigger').click()
  const panel = page.getByRole('dialog')
  const orders = panel.getByTestId('sidebar-nav-orders')
  const support = panel.getByTestId('sidebar-nav-support')
  const lens = panel.getByTestId('sidebar-selected-lens')
  await panel.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)))
  const before = await lens.boundingBox()
  const color = await support.evaluate(el => getComputedStyle(el).color)
  await support.hover()
  await expect(lens).toHaveAttribute('data-travel-target', '96')
  await expect(orders).toHaveAttribute('aria-current', 'page')
  await expect(lens).toHaveAttribute('data-motion-state', 'settled')
  expect(Math.abs((await lens.boundingBox())!.y - before!.y - 96)).toBeLessThan(.8)
  await expect.poll(() => support.locator('[data-popup-label]').evaluate(el => Number(getComputedStyle(el).getPropertyValue('--fos-sidebar-label-scale')))).toBeCloseTo(1.043, 4)
  await expect.poll(() => support.evaluate(el => getComputedStyle(el).color)).not.toBe(color)
  await expect(panel.locator('[data-motion="travel"]')).toHaveCount(1)
  await page.screenshot({ path: `output/playwright/fe11-pilot/${info.project.name}-hover.png` })
  await panel.locator('.fos-nav-drawer__footer').hover()
  await expect(lens).toHaveAttribute('data-travel-target', '0')
  await expect(orders).toHaveAttribute('aria-current', 'page')
})

test('candidate arrows only focus; activation moves the same lens and Escape restores focus', async ({ page }, info) => {
  test.skip(info.project.use.hasTouch === true, 'Keyboard/pointer on desktop engines')
  await page.getByTestId('navigation-drawer-trigger').click()
  const panel = page.getByRole('dialog')
  await page.keyboard.press('ArrowDown')
  await expect(panel.getByTestId('sidebar-nav-artworks')).toBeFocused()
  await expect(panel.getByTestId('sidebar-nav-orders')).toHaveAttribute('aria-current', 'page')
  await expect(panel.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-travel-target', '0')
  await page.keyboard.press('Enter')
  await expect(panel.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-travel-target', '48')
  await panel.getByTestId('sidebar-nav-support').click()
  await expect(panel.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-travel-target', '96')
  await expect(panel.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'settled')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('navigation-drawer-trigger')).toBeFocused()
  await expect(page.locator('#root')).not.toHaveAttribute('inert', '')
})

test('candidate intermediate frames follow geometric text intersection, never selected state', async ({ page }, info) => {
  // The CI WebKit sample jumped from y85.469 (full old-label coverage) to
  // y108.893 (no coverage), skipping the narrow partial-coverage interval.
  // Reload under Clock before any app timers; run every native spring frame.
  await page.clock.install({ time: new Date('2026-11-11T12:00:00Z') })
  await page.reload()
  await page.getByTestId('navigation-drawer-trigger').click()
  await expect(page.locator('[data-motion-reference]')).toBeVisible()
  // Isolate click-driven full travel; hover now intentionally previews the target.
  // Viewport Y must not include the independent 190ms panel-entry transform.
  await page.getByRole('dialog').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)))
  await page.clock.pauseAt(new Date('2026-11-11T13:00:00Z'))
  await page.evaluate(() => {
    const root = document.querySelector('[data-motion-reference]')!
    const lens = root.querySelector<HTMLElement>('[data-testid="sidebar-selected-lens"]')!
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-popup-item]')]
    const sample = () => {
      const box = lens.getBoundingClientRect()
      return { time: performance.now(), y: box.top, height: box.height, same: root.querySelector('[data-testid="sidebar-selected-lens"]') === lens,
        labels: buttons.map(button => {
          const label = button.querySelector<HTMLElement>('[data-popup-label]')!
          const rect = label.getBoundingClientRect()
          return { id: button.dataset.popupItem, top: rect.top, bottom: rect.bottom,
            scale: Number(label.style.getPropertyValue('--fos-sidebar-label-scale')), selected: button.hasAttribute('aria-current') }
        }) }
    }
    const result = [sample()]
    Object.assign(window, { drawerGeometryFrames: result })
    buttons[2].click()
    // Capture real DOM/controller output; no production formula/driver is mocked.
    let resting = 0
    const capture = () => {
      result.push(sample())
      resting = lens.dataset.motionState === 'settled' && lens.dataset.travelTarget === '96' ? resting + 1 : 0
      if (resting <= 3 && result.length <= 150) requestAnimationFrame(capture)
    }
    requestAnimationFrame(capture)
  })
  await page.clock.runFor(2400)
  const frames = await page.evaluate(() => (window as unknown as { drawerGeometryFrames: GeometryFrame[] }).drawerGeometryFrames)
  await info.attach('geometry-frames', { body: JSON.stringify(frames, null, 2), contentType: 'application/json' })
  expect(frames.every(frame => frame.same)).toBe(true)
  const start = frames[0].y, end = frames.at(-1)!.y
  expect(end - start).toBeCloseTo(96, 0)
  const moving = frames.filter(frame => frame.y > start + 1 && frame.y < end - 1)
  expect(moving.length).toBeGreaterThan(3)
  expect(moving.some(frame => frame.labels[0].scale > 1 && frame.labels[0].scale < 1.043)).toBe(true)
  expect(moving.some(frame => frame.labels[2].scale > 1 && frame.labels[2].scale < 1.043)).toBe(true)
  const beforeContact = moving.filter(frame => frame.y + frame.height < frame.labels[2].top - 1)
  expect(beforeContact.length).toBeGreaterThan(1)
  expect(beforeContact.every(frame => frame.labels[2].scale === 1)).toBe(true)
  expect(frames.at(-1)!.labels[0].scale).toBe(1)
  expect(frames.at(-1)!.labels[2].scale).toBeCloseTo(1.043, 4)
})

test('pilot stays within five viewports and short-height anchor flips above the trigger', async ({ page }, info) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 600 })
    await page.getByTestId('navigation-drawer-trigger').click()
    const panel = page.getByRole('dialog')
    await expect(panel.locator('[data-motion="travel"]')).toHaveCount(1)
    await page.waitForTimeout(250)
    const box = (await panel.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(15)
    expect(box.x + box.width).toBeLessThanOrEqual(width - 15)
    expect(box.y + box.height).toBeLessThanOrEqual(585)
    await page.screenshot({ path: `output/playwright/fe11-pilot/${info.project.name}-${width}.png`, fullPage: true })
    await page.keyboard.press('Escape')
    await expect(panel).toHaveCount(0)
  }
  await page.getByTestId('navigation-drawer-trigger').evaluate(el => Object.assign(el.style, { position: 'fixed', top: '540px', left: '16px' }))
  await page.getByTestId('navigation-drawer-trigger').click()
  await page.waitForTimeout(250)
  expect((await page.getByRole('dialog').boundingBox())!.y).toBeLessThan(540 - 200)
})

test('touch selects without sticky preview and reopened popup follows selection', async ({ page }, info) => {
  test.skip(info.project.use.hasTouch !== true, 'Requires touch project')
  await page.getByTestId('navigation-drawer-trigger').tap()
  await page.getByTestId('sidebar-nav-support').tap()
  await expect(page.getByRole('dialog').getByTestId('sidebar-nav-support')).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('dialog').getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'settled')
  await page.getByTestId('navigation-drawer-scrim').tap({ position: { x: 3, y: 500 } })
  await page.getByTestId('navigation-drawer-trigger').tap()
  await expect(page.getByRole('dialog').getByTestId('sidebar-nav-support')).toHaveAttribute('aria-current', 'page')
})

test('real Client and Manager shells show the pilot beneath their hamburger', async ({ page }, info) => {
  for (const role of ['client', 'manager']) {
    await page.setViewportSize({ width: 390, height: 600 })
    await page.goto('/?view=' + role + '-orders')
    await page.getByTestId('navigation-drawer-trigger').click()
    const panel = page.getByRole('dialog')
    await expect(panel).toBeVisible()
    await expect(panel).toHaveAttribute('data-sidebar-material', 'true')
    if (info.project.use.hasTouch !== true) {
      await panel.getByTestId('sidebar-nav-support').hover()
      await expect(panel.getByTestId('sidebar-selected-lens')).toHaveAttribute('data-motion-state', 'settled')
    }
    await page.screenshot({ path: `output/playwright/fe11-pilot/${info.project.name}-${role}-real.png` })
    await page.keyboard.press('Escape')
    await expect(page.locator('#root')).not.toHaveAttribute('inert', '')
  }
})
