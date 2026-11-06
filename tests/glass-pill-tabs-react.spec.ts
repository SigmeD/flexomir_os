import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=glass-pill-tabs')
})

test('one accepted shared FosGlassMaterial, neutral glass and five controlled UI filters', async ({ page }) => {
  const group = page.getByTestId('glass-pill-tabs')
  await expect(group.getByRole('group', { name: 'Фильтр заказов по статусу' })).toBeVisible()
  await expect(group.locator('[data-fos-glass-material]')).toHaveCount(1)
  await expect(group.getByTestId('glass-pill-lens')).toHaveAttribute('data-tone', 'neutral')
  await expect(group.getByRole('button')).toHaveCount(5)
  await expect(group.locator('[aria-pressed="true"]')).toHaveCount(1)
  await expect(group.locator('select')).toHaveCount(0)
  await expect(group.getByTestId('glass-pill-work')).toHaveText('В работе')
  const buttons = group.getByRole('button')
  for (const button of await buttons.all()) await expect(button).toHaveCSS('height', '44px')
  await expect(group.getByTestId('glass-pill-lens-frame')).toHaveCSS('height', '38px')
  await expect(group.getByTestId('glass-pill-lens')).toHaveAttribute('data-optics-mode', /refraction|frosted|neutral/)
})

test('hover changes only color; click moves one lens horizontally and adapts width', async ({ page }) => {
  const group = page.getByTestId('glass-pill-tabs')
  const lens = group.getByTestId('glass-pill-lens-frame')
  const all = group.getByTestId('glass-pill-all')
  const review = group.getByTestId('glass-pill-review')
  // Measure hover only after the real bundled font and its resize-driven spring settle.
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(async () => Math.abs((await lens.boundingBox())!.width - await all.evaluate(element => (element as HTMLElement).offsetWidth))).toBeLessThan(.1)
  await expect(lens).toHaveAttribute('data-motion-state', 'settled')
  const oldBox = await lens.boundingBox()
  const before = await lens.evaluate(el => getComputedStyle(el).transform)
  await review.hover()
  await expect(all).toHaveAttribute('aria-pressed', 'true')
  // Playwright may horizontally SCROLL the rail to reveal the hovered
  // offscreen button on 390px. That shifts absolute screen coordinates but
  // does NOT move the spring lens relative to its own track.
  const after = await lens.evaluate(el => getComputedStyle(el).transform)
  expect(after).toBe(before)
  const afterBox = await lens.boundingBox()
  expect(afterBox?.width).toBeCloseTo(oldBox?.width ?? 0, 0)
  // The transform belongs to the lens, not to the horizontally scrolling track.

  await review.click()
  await expect(review).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('pill-selected-label')).toHaveText('На рассмотрении')
  await expect(page.getByTestId('pill-order-count')).toContainText('1 из 6')
  await expect(lens).toHaveAttribute('data-motion-state', 'settled', { timeout: 5000 })
  const boxes = await Promise.all([lens.boundingBox(), review.boundingBox()])
  expect(Math.abs((boxes[0]?.x ?? 0) - (boxes[1]?.x ?? 0))).toBeLessThan(1.5)
  expect(Math.abs((boxes[0]?.width ?? 0) - (boxes[1]?.width ?? 0))).toBeLessThan(1.5)
  expect(boxes[0]?.width).toBeGreaterThan(oldBox?.width ?? 0)
})

test('selected optical +4.3% text scale follows lens; hover does not enlarge inactive', async ({ page }) => {
  const group = page.getByTestId('glass-pill-tabs')
  const work = group.getByTestId('glass-pill-work')
  await work.click()
  await expect(group.getByTestId('glass-pill-lens-frame')).toHaveAttribute('data-motion-state', 'settled', { timeout: 5000 })
  const selectedScale = await work.locator('.fos-glass-pill-tabs__label').evaluate(
    el => getComputedStyle(el).transform,
  )
  expect(selectedScale).not.toBe('none')
  const other = group.getByTestId('glass-pill-review')
  await other.hover()
  await expect(other).toHaveAttribute('aria-pressed', 'false')
  const otherScale = await other.locator('.fos-glass-pill-tabs__label').evaluate(
    el => getComputedStyle(el).transform,
  )
  expect(otherScale).toBe('matrix(1, 0, 0, 1, 0, 0)')
})

test('D1440/L1024/T768/M390/M320 responsive and no document horizontal overflow', async ({ page }, testInfo) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const scrollable = await page.getByTestId('glass-pill-scroll').evaluate(el => el.scrollWidth > el.clientWidth)
    if (width <= 390) expect(scrollable).toBe(true)
    await expect(page.getByTestId('glass-pill-lens')).toHaveCount(1)
    await page.screenshot({
      path: testInfo.outputPath('gl03-react-' + width + '.png'),
      fullPage: false,
      animations: 'disabled',
    })
  }
})

test('filters can be added/removed, selected removed falls back to All (lab only)', async ({ page }) => {
  for (let n = 0; n < 7; n++) await page.getByTestId('pill-add').click()
  await expect(page.getByTestId('pill-filter-count')).toContainText('12 фильтров')
  await expect(page.getByTestId('pill-add')).toBeDisabled()
  const last = page.getByTestId('glass-pill-extra-7')
  await last.click()
  await expect(page.getByTestId('pill-selected-label')).toHaveText('Демо-этап 7')
  await expect.poll(() => page.getByTestId('glass-pill-scroll').evaluate(el => {
    const active = el.querySelector('[aria-pressed="true"]') as HTMLElement
    return active.offsetLeft + active.offsetWidth <= el.scrollLeft + el.clientWidth + 2
  }), { timeout: 5000 }).toBe(true)
  await page.getByTestId('pill-remove').click()
  await expect(page.getByTestId('pill-selected-label')).toHaveText('Все заказы')
  await expect(page.getByTestId('glass-pill-all')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('glass-pill-lens')).toHaveCount(1)
  await page.getByTestId('pill-reset').click()
  await expect(page.getByTestId('glass-pill-tabs').getByRole('button')).toHaveCount(5)
})

test('keyboard arrows/Home/End only move focus; Enter/Space selects', async ({ page }) => {
  const group = page.getByTestId('glass-pill-tabs')
  const all = group.getByTestId('glass-pill-all')
  await all.focus()
  await page.keyboard.press('ArrowRight')
  const draft = group.getByTestId('glass-pill-draft')
  await expect(draft).toBeFocused()
  await expect(all).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('End')
  await expect(group.getByTestId('glass-pill-done')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(group.getByTestId('glass-pill-done')).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Home')
  await expect(all).toBeFocused()
  await page.keyboard.press('Space')
  await expect(all).toHaveAttribute('aria-pressed', 'true')
})

test('rapid retarget retains one lens and one shared optical material', async ({ page }) => {
  const group = page.getByTestId('glass-pill-tabs')
  await group.getByTestId('glass-pill-review').click()
  await group.getByTestId('glass-pill-done').click()
  await expect(group.getByTestId('glass-pill-done')).toHaveAttribute('aria-pressed', 'true')
  await expect(group.getByTestId('glass-pill-lens-frame')).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  const boxes = await Promise.all([
    group.getByTestId('glass-pill-lens-frame').boundingBox(),
    group.getByTestId('glass-pill-done').boundingBox(),
  ])
  expect(Math.abs((boxes[0]?.x ?? 0) - (boxes[1]?.x ?? 0))).toBeLessThan(1.5)
  await expect(group.locator('[data-fos-glass-material]')).toHaveCount(1)
})

test('reduced-motion and forced-colors retain choice and disable optical movement', async ({ page }) => {
  const group = page.getByTestId('glass-pill-tabs')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await group.getByTestId('glass-pill-work').click()
  await expect(group.getByTestId('glass-pill-work')).toHaveAttribute('aria-pressed', 'true')
  await expect(group.getByTestId('glass-pill-lens-frame')).toHaveAttribute('data-motion-state', 'off')
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await group.getByTestId('glass-pill-draft').click()
  await expect(group.getByTestId('glass-pill-draft')).toHaveAttribute('aria-pressed', 'true')
  await expect(group.getByTestId('glass-pill-lens-frame')).toBeHidden()
})

test('real mobile touch swipe scrolls without selecting a filter', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  try {
    await page.goto('/?view=glass-pill-tabs')
    const rail = page.getByTestId('glass-pill-scroll')
    const box = await rail.boundingBox()
    if (!box) throw new Error('Filter rail not mounted')
    const cdp = await context.newCDPSession(page)
    const x1 = box.x + box.width - 25, x2 = box.x + 30, y = box.y + box.height / 2
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y, id: 1 }] })
    for (let i = 1; i <= 14; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove', touchPoints: [{ x: x1 + (x2 - x1) * i / 14, y, id: 1 }],
      })
      await page.waitForTimeout(19)
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(80)
    await expect(page.getByTestId('glass-pill-all')).toHaveAttribute('aria-pressed', 'true')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  } finally {
    await context.close()
  }
})


test('Pill uses accepted material optics and spring with no extra shadow or coat', async ({ page }, testInfo) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width >= 1000 ? 900 : 844 })
    const group = page.getByTestId('glass-pill-tabs')
    const rail = group.locator('.fos-glass-pill-tabs__track')
    const material = group.getByTestId('glass-pill-lens')
    const nativeLens = material.locator(':scope > .fos-glass-optics')
    const coat = nativeLens.locator(':scope > div[aria-hidden]')
    const frame = group.getByTestId('glass-pill-lens-frame')

    // Same original optics; not a separate shadow token or painted copy.
    await expect(group.locator('[data-fos-glass-material]')).toHaveCount(1)
    await expect(nativeLens).toHaveCount(1)
    await expect(material).toHaveAttribute('data-tone', 'neutral')
    await expect(material).toHaveAttribute('data-optics-mode', /refraction|frosted|neutral/)
    await expect(material).toHaveCSS('overflow', 'visible')
    await expect(frame).toHaveCSS('box-shadow', 'none')
    await expect(frame).toHaveCSS('outline-style', 'none')
    const nativeShadow = await nativeLens.evaluate(el => getComputedStyle(el).boxShadow)
    expect(nativeShadow).not.toBe('none')
    const coatBackground = await coat.evaluate(el => getComputedStyle(el).backgroundImage)
    expect(coatBackground).toContain('radial-gradient(')
    expect(coatBackground).toContain('linear-gradient(')
    await expect(coat).toHaveCSS('border-top-width', '1px')
    await expect(rail).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    await group.getByTestId('glass-pill-review').click()
    await expect(frame).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
    const [frameBox, selectedBox] = await Promise.all([
      frame.boundingBox(), group.getByTestId('glass-pill-review').boundingBox(),
    ])
    expect(Math.abs((frameBox?.x ?? 0) - (selectedBox?.x ?? 0))).toBeLessThan(1.5)
    expect(Math.abs((frameBox?.width ?? 0) - (selectedBox?.width ?? 0))).toBeLessThan(1.5)
    await page.screenshot({
      path: testInfo.outputPath('gl03-shared-material-' + width + '.png'),
      fullPage: false,
      animations: 'disabled',
    })
    await group.getByTestId('glass-pill-all').click()
    await expect(frame).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  }
})

test('Pill neutral coat and native material shadow match accepted SidebarNav exactly', async ({ page }) => {
  await page.goto('/?view=sidebar-nav')
  const sidebar = page.getByTestId('sidebar-lab-client').getByTestId('sidebar-selected-lens')
  await expect(sidebar).toHaveAttribute('data-tone', 'neutral')
  const original = await sidebar.evaluate(el => {
    const optics = el.querySelector<HTMLElement>('.fos-glass-optics')!
    const coat = optics.querySelector<HTMLElement>('div[aria-hidden]')!
    return {
      shadow: getComputedStyle(optics).boxShadow,
      coat: getComputedStyle(coat).backgroundImage,
      rim: getComputedStyle(coat).borderTopColor,
    }
  })
  await page.goto('/?view=glass-pill-tabs')
  const pill = page.getByTestId('glass-pill-lens')
  await expect(pill).toHaveAttribute('data-tone', 'neutral')
  const current = await pill.evaluate(el => {
    const optics = el.querySelector<HTMLElement>('.fos-glass-optics')!
    const coat = optics.querySelector<HTMLElement>('div[aria-hidden]')!
    return {
      shadow: getComputedStyle(optics).boxShadow,
      coat: getComputedStyle(coat).backgroundImage,
      rim: getComputedStyle(coat).borderTopColor,
    }
  })
  expect(current).toEqual(original)
})

test('scrollport clearance protects the accepted shared glass shadow at responsive widths', async ({ page }, testInfo) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
    const group = page.getByTestId('glass-pill-tabs')
    const scroller = group.getByTestId('glass-pill-scroll')
    const frame = group.getByTestId('glass-pill-lens-frame')
    const material = group.getByTestId('glass-pill-lens')

    await expect(scroller).toHaveCSS('overflow-x', 'auto')
    await expect(scroller).toHaveCSS('padding-top', '7px')
    await expect(scroller).toHaveCSS('padding-bottom', '12px')
    await expect(frame).toHaveCSS('height', '38px')
    await expect(group.getByTestId('glass-pill-all')).toHaveCSS('height', '44px')
    await expect(group.locator('[data-fos-glass-material]')).toHaveCount(1)
    await expect(material.locator('.fos-glass-optics')).toHaveCount(1)

    // The scrollport is the clipping boundary (overflow-x:auto). The lens
    // must be inset from it so BOTH diffuse shadow lobes survive.
    const clearances = await group.evaluate(root => {
      const scroll = root.querySelector<HTMLElement>('[data-testid="glass-pill-scroll"]')!
      const frame = root.querySelector<HTMLElement>('[data-testid="glass-pill-lens-frame"]')!
      const sc = scroll.getBoundingClientRect()
      const lc = frame.getBoundingClientRect()
      const native = root.querySelector<HTMLElement>('.fos-glass-optics')!
      return {
        top: lc.top - sc.top,
        bottom: sc.bottom - lc.bottom,
        shadow: getComputedStyle(native).boxShadow,
        frameShadow: getComputedStyle(frame).boxShadow,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      }
    })
    expect(clearances.top).toBeGreaterThanOrEqual(12)
    expect(clearances.bottom).toBeGreaterThanOrEqual(16)
    expect(clearances.shadow).not.toBe('none')
    expect(clearances.frameShadow).toBe('none')
    expect(clearances.horizontalOverflow).toBe(false)

    await group.getByTestId('glass-pill-done').click()
    await expect(frame).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
    const after = await Promise.all([scroller.boundingBox(), frame.boundingBox()])
    expect((after[1]?.y ?? 0) - (after[0]?.y ?? 0)).toBeGreaterThanOrEqual(12)
    expect(((after[0]?.y ?? 0) + (after[0]?.height ?? 0)) -
      ((after[1]?.y ?? 0) + (after[1]?.height ?? 0))).toBeGreaterThanOrEqual(16)
    await page.screenshot({
      path: testInfo.outputPath('gl03-shared-shadow-safe-' + width + '.png'),
      fullPage: false,
      animations: 'disabled',
    })
    await group.getByTestId('glass-pill-all').click()
    await expect(frame).toHaveAttribute('data-motion-state', 'settled', { timeout: 6000 })
  }
})
