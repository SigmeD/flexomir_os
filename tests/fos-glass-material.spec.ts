import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('standalone optics has one lens above real orders and a true zero mode', async ({ page, browserName }) => {
  await page.goto('/?view=material&phase=optics&strength=0')
  const material = page.locator('[data-fos-glass-material]')
  await expect(material).toHaveAttribute('data-material-ready', 'true')
  await expect(material).toHaveCount(1)
  await expect(page.locator('[data-material-orders] [data-order-id]')).toHaveCount(5)
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(material).toHaveAttribute('data-optics-mode', 'neutral')
  expect(await material.locator('.fos-glass-optics').evaluate(el => getComputedStyle(el).backdropFilter)).not.toContain('url(')
  if (browserName !== 'chromium') expect(await material.locator('.fos-glass-optics').evaluate(el => getComputedStyle(el).backdropFilter)).toBe('blur(6px) saturate(1.5)')
  await page.goto('/?view=material&phase=optics&strength=0.6')
  await expect(material).toHaveAttribute('data-optics-mode', browserName === 'chromium' ? 'refraction' : 'frosted')
  if (browserName === 'chromium') {
    await expect(material.locator('feDisplacementMap')).toHaveCount(1)
    await expect.poll(() => material.locator('.fos-glass-optics').evaluate(el => getComputedStyle(el).backdropFilter)).toContain('url(')
  } else {
    await expect(material.locator('feDisplacementMap')).toHaveCount(0)
    expect(await material.locator('.fos-glass-optics').evaluate(el => getComputedStyle(el).backdropFilter)).toContain('blur(')
  }
})

test('Select reuses the verified material with accessible keyboard and browser fallback', async ({ page, browserName }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/?view=glass-filter-lab&glass=matte')
  const trigger = page.getByTestId('filter-control').locator('button')
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  const popup = page.getByRole('listbox')
  const shell = popup.locator('.fos-popup-surface__shell[data-fos-glass-material]')
  const selectionLens = popup.locator('.fos-popup-rows__lens[data-fos-glass-material]')
  await expect(shell).toHaveCount(1)
  await expect(selectionLens).toHaveCount(1)
  for (const material of [shell, selectionLens]) {
    await expect(material).toHaveAttribute('data-material-ready', 'true')
    await expect(material).toHaveAttribute('data-optics-mode', browserName === 'chromium' ? 'refraction' : 'frosted')
  }
  await expect(page.getByRole('option', { name: 'Все заказы', exact: true })).toBeFocused()
  await testInfo.attach('select-shared-material', { body: await page.screenshot(), contentType: 'image/png' })
  const axe = await new AxeBuilder({ page }).include('[data-testid="filter-control"]').include('[role="listbox"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(axe.violations).toEqual([])
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(trigger).toContainText('Черновики')
  await expect(page.locator('.order-row')).toHaveCount(2)
  await expect(trigger).toBeFocused()
  expect(errors).toEqual([])
})

test('forced colors replaces optics with an accessible system surface', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Chromium forced-colors emulation')
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/?view=glass-filter-lab&glass=matte')
  await page.getByTestId('filter-control').locator('button').click()
  const popup = page.getByRole('listbox')
  const shell = popup.locator('.fos-popup-surface__shell[data-fos-glass-material]')
  const selectionLens = popup.locator('.fos-popup-rows__lens[data-fos-glass-material]')
  await expect(shell).toHaveCount(1)
  await expect(selectionLens).toHaveCount(1)
  for (const material of [shell, selectionLens]) {
    await expect(material).toHaveAttribute('data-optics-mode', 'high-contrast')
    await expect(material.locator('.fos-glass-optics')).toHaveCount(0)
  }
  await expect(shell).toHaveCSS('border-top-style', 'solid')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('filter-control').locator('button')).toBeFocused()
})

test('the optical background stays live when an underlying order changes', async ({ page, browserName }) => {
  await page.goto('/?view=material&phase=optics&strength=0.6')
  const material = page.locator('[data-fos-glass-material]')
  await expect(material).toHaveAttribute('data-optics-mode', browserName === 'chromium' ? 'refraction' : 'frosted')
  await expect(material).toHaveAttribute('data-material-ready', 'true')
  const map = browserName === 'chromium' ? await material.locator('feImage').getAttribute('href') : null
  const box = (await material.boundingBox())!
  // Every sampled pixel is inside the lens, over the second order's real label.
  const clip = { x: box.x + 20, y: box.y + 24, width: 100, height: 16 }
  const before = await page.screenshot({ clip, animations: 'disabled' })
  await page.locator('[data-order-id]').nth(1).locator('[data-material-text]').evaluate(el => { el.textContent = 'LIVE-002' })
  const after = await page.screenshot({ clip, animations: 'disabled' })
  expect(before.equals(after)).toBe(false)
  if (map) expect(await material.locator('feImage').getAttribute('href')).toBe(map)
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('one native lens follows responsive HTML geometry after resizing', async ({ page }) => {
  await page.goto('/?view=material&phase=optics&strength=.6')
  const material = page.locator('[data-fos-glass-material]')
  await expect(material).toHaveAttribute('data-material-ready', 'true')
  await page.setViewportSize({ width: 340, height: 844 })
  await expect.poll(() => material.evaluate(el => {
    const lens = el.querySelector('.fos-glass-optics') as HTMLElement
    return lens.offsetWidth === el.clientWidth && lens.offsetHeight === el.clientHeight
  })).toBe(true)
  await expect(material.locator('.fos-glass-optics')).toHaveCount(1)
  expect((await material.boundingBox())!.width).toBeLessThan(300)
})

test('retarget preserves travel momentum', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-03T00:00:00Z') })
  await page.goto('/?view=material')
  await page.locator('.fos-glass-optics').waitFor()
  await page.clock.pauseAt(new Date('2026-11-03T00:01:00Z'))
  const material = page.locator('[data-fos-glass-material]')
  const readY = () => material.evaluate(el => parseFloat((el as HTMLElement).style.getPropertyValue('--fos-travel')) || 0)
  const advance = page.getByRole('button', { name: 'Сместить линзу ниже' })
  await advance.dispatchEvent('click')
  await expect(material).toHaveAttribute('data-travel-target', '76')
  await page.clock.runFor(96)
  const previous = await readY()
  await page.clock.runFor(16)
  const current = await readY()
  await advance.dispatchEvent('click')
  await expect(material).toHaveAttribute('data-travel-target', '152')
  await page.clock.runFor(16)
  const next = await readY()
  const dt = .016, velocity = (current - previous) / dt
  const acceleration = 265 * (152 - current) - 2 * Math.sqrt(265) * .93 * velocity
  expect(current - previous).toBeGreaterThan(4)
  expect(Math.abs((next - current) - (velocity + acceleration * dt) * dt)).toBeLessThan(.05)
})

test('reference material uses left light and settles after native spring travel', async ({ page }) => {
  await page.goto('/?view=material')
  const material = page.locator('[data-fos-glass-material]')
  await expect(material).toHaveAttribute('data-lighting', 'sidebar')
  await expect(material).toHaveCSS('border-top-left-radius', '18px')
  expect(await material.evaluate(el => getComputedStyle(el).getPropertyValue('--fos-key-x').trim())).toBe('17%')
  const before = await material.boundingBox()
  await page.getByRole('button', { name: 'Сместить линзу ниже' }).click()
  await expect(material).toHaveAttribute('data-motion-state', 'settled')
  await expect.poll(async () => Math.round((await material.boundingBox())!.y - before!.y)).toBe(76)
  await expect(page.locator('[data-fos-glass-material]')).toHaveCount(1)
})

test('reduced motion moves directly to target without travel or tilt animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?view=material')
  const material = page.locator('[data-fos-glass-material]')
  const before = await material.boundingBox()
  await page.getByRole('button', { name: 'Сместить линзу ниже' }).click()
  await expect(material).toHaveAttribute('data-motion-state', 'off')
  expect(Math.round((await material.boundingBox())!.y - before!.y)).toBe(76)
  expect(await material.evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--fos-tilt')))).toBe(0)
})
