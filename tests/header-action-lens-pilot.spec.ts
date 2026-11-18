import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/header-action-lens-pilot.html')
  await page.evaluate(() => document.fonts.ready)
})

test('DEV pilot keeps the shared Send geometry, icon and original material', async ({ page }) => {
  const original = page.getByTestId('lens-original-light')
  const candidate = page.getByTestId('lens-candidate-light')
  await expect(original).toHaveAccessibleName('Отправить, исходная кнопка')
  await expect(candidate).toHaveAccessibleName('Отправить, кандидат')
  await expect(original).not.toHaveClass(/lens-pilot/)
  await expect(candidate).toHaveAttribute('data-surface-motion', 'pressure')
  await expect(candidate.locator('[data-material-preset]')).toHaveAttribute('data-material-preset', 'header-action')
  await expect(candidate.locator('[data-action-surface]')).toHaveCount(1)
  expect(await candidate.evaluate(() => document.fonts.check('600 12px Manrope'))).toBe(true)

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    const circle = candidate.locator('.fos-ha__circle')
    const icon = candidate.locator('.fos-ha__glyph-mask')
    const circleBox = await circle.boundingBox()
    const iconBox = await icon.boundingBox()
    const buttonBox = await candidate.boundingBox()
    expect(circleBox).toMatchObject({ width: 48, height: 48 })
    expect(iconBox).toMatchObject({ width: 24, height: 24 })
    expect(buttonBox).toMatchObject({ width: width >= 1024 ? 68 : 48, height: width >= 1024 ? 68 : 48 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }

  const coat = await candidate.locator('.fos-ha__circle').evaluate(node => {
    const core = getComputedStyle(node, '::before')
    const icon = node.querySelector<HTMLElement>('.fos-ha__glyph-mask')!
    return { coreColor: core.backgroundColor, coreInset: core.inset, coreDisplay: core.display, iconColor: getComputedStyle(icon).backgroundColor }
  })
  expect(coat.coreColor).toBe('rgb(2, 53, 127)')
  expect(coat.coreInset).toBe('4px')
  expect(coat.coreDisplay).not.toBe('none')
  expect(coat.iconColor).toBe('rgb(255, 255, 255)')
})

test('candidate keeps native click, keyboard and disabled behavior', async ({ page }) => {
  const candidate = page.getByTestId('lens-candidate-light')
  const disabled = page.getByTestId('lens-candidate-disabled-light')
  await expect(disabled).toBeDisabled()
  await disabled.dispatchEvent('click')
  await expect(page.getByRole('status')).toHaveText('Нажатий: Original 0 · Candidate 0')

  await candidate.click()
  await candidate.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(page.getByRole('status')).toHaveText('Нажатий: Original 0 · Candidate 3')
  await expect(candidate).toHaveAttribute('data-pressed', 'false')
})

test('a short click shows press and release feedback, then restores the accepted core', async ({ page }) => {
  const candidate = page.getByTestId('lens-candidate-light')
  const core = candidate.locator('.fos-ha__circle')
  const box = await core.boundingBox()
  if (!box) throw new Error('Candidate circle is missing')

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await expect(candidate).toHaveAttribute('data-pressed', 'true')
  await expect.poll(() => core.evaluate(node => getComputedStyle(node, '::before').backgroundColor)).toBe('rgb(1, 38, 92)')
  await page.mouse.up()
  await expect(candidate).toHaveAttribute('data-feedback', 'true')
  await expect.poll(() => core.evaluate(node => getComputedStyle(node, '::before').backgroundColor)).toBe('rgb(6, 66, 140)')
  await expect(candidate).not.toHaveAttribute('data-feedback', 'true')
  await expect.poll(() => core.evaluate(node => getComputedStyle(node, '::before').backgroundColor)).toBe('rgb(2, 53, 127)')

  await candidate.click()
  await expect(candidate).toHaveAttribute('data-feedback', 'true')
})

test('pilot has an accessible forced-colors fallback and reduced-motion state', async ({ page }) => {
  const candidate = page.getByTestId('lens-candidate-light')
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' })
  const circle = candidate.locator('.fos-ha__circle')
  await expect(circle).toHaveCSS('width', '48px')
  expect(await circle.evaluate(node => getComputedStyle(node, '::before').display)).toBe('none')
  await candidate.click()
  await expect(page.getByRole('status')).toHaveText('Нажатий: Original 0 · Candidate 1')
})

test('keyboard focus is distinct from the glass rim on light and dark backgrounds', async ({ page }) => {
  const light = page.getByTestId('lens-candidate-light')
  const dark = page.getByTestId('lens-candidate-dark')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(light).toBeFocused()
  await expect(light).toHaveCSS('outline-color', 'rgb(27, 94, 169)')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(dark).toBeFocused()
  await expect(dark).toHaveCSS('outline-color', 'rgb(215, 241, 255)')
})

test('touch activates the candidate once and leaves its pressure state settled', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
  const page = await context.newPage()
  try {
    await page.goto('/tests/fixtures/header-action-lens-pilot.html')
    const candidate = page.getByTestId('lens-candidate-light')
    await candidate.tap()
    await expect(page.getByRole('status')).toHaveText('Нажатий: Original 0 · Candidate 1')
    await expect(candidate).toHaveAttribute('data-pressed', 'false')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  } finally {
    await context.close()
  }
})
