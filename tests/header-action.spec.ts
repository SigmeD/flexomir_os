import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=header-action')
})

test('one shared HeaderAction, 48px circle and breakpoint-specific caption', async ({ page }) => {
  const manager = page.getByTestId('header-action-add')
  const client = page.getByTestId('header-action-client')
  await expect(manager).toHaveAccessibleName('Добавить')
  await expect(client).toHaveAccessibleName('Новый заказ')

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    const circle = manager.locator('.fos-ha__circle')
    const box = await circle.boundingBox()
    expect(box?.width).toBe(48)
    expect(box?.height).toBe(48)
    const wrapper = await manager.boundingBox()
    const expected = width >= 1024 ? 68 : 48
    expect(wrapper?.width).toBe(expected)
    expect(wrapper?.height).toBe(expected)
    if (width >= 1024) {
      await expect(manager.locator('.fos-ha__caption')).toBeVisible()
    } else {
      await expect(manager.locator('.fos-ha__caption')).toBeHidden()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  }
})

test('pointer press from all sides, transient light and native click', async ({ page }) => {
  const button = page.getByTestId('header-action-add')
  const circle = button.locator('.fos-ha__circle')
  const b = await circle.boundingBox()
  expect(b).toBeTruthy()
  const points = [[.5, .5], [.14, .5], [.86, .5], [.5, .14], [.5, .86]]
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    await page.mouse.move(b!.x + b!.width * x, b!.y + b!.height * y)
    await page.mouse.down()
    await expect(button).toHaveAttribute('data-pressed', 'true')
    await page.waitForTimeout(150)
    await page.mouse.up()
    await expect(button).toHaveAttribute('data-pressed', 'false')
    await expect(page.getByTestId('header-action-count')).toHaveText('Нажатий: ' + (i + 1))
    await page.waitForTimeout(850)
    await expect.poll(async () => circle.evaluate(el => (el as HTMLElement).style.getPropertyValue('--ha-shift-x'))).toBe('0px')
    expect(await circle.evaluate(el => (el as HTMLElement).style.getPropertyValue('--ha-light-x'))).toBe('')
  }
})

test('disabled means no click, no press motion', async ({ page }) => {
  const disabled = page.getByTestId('header-action-disabled')
  await expect(disabled).toBeDisabled()
  await disabled.dispatchEvent('click')
  await expect(page.getByTestId('header-action-count')).toHaveText('Нажатий: 0')
  await expect(disabled).toHaveAttribute('data-pressed', 'false')
})

test('keyboard Enter and Space activate once each', async ({ page }) => {
  const button = page.getByTestId('header-action-add')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('header-action-count')).toHaveText('Нажатий: 1')
  await page.keyboard.press('Space')
  await expect(page.getByTestId('header-action-count')).toHaveText('Нажатий: 2')
})

test('reduced motion and forced colors leave action accessible', async ({ page }) => {
  const button = page.getByTestId('header-action-add')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await button.click()
  await expect(page.getByTestId('header-action-count')).toHaveText('Нажатий: 1')
  await expect(button.locator('.fos-ha__circle')).toHaveCSS('width', '48px')
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await button.focus()
  await expect(button).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('header-action-count')).toHaveText('Нажатий: 2')
})

test('touch activation and no page overflow at 390px', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  try {
    await page.goto('/?view=header-action')
    const button = page.getByTestId('header-action-add')
    await button.tap()
    await expect(page.getByTestId('header-action-count')).toHaveText('Нажатий: 1')
    await expect(button).toHaveAttribute('data-pressed', 'false')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  } finally {
    await context.close()
  }
})

test('visual review captures for Desktop and Mobile', async ({ page }, testInfo) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 })
    await page.screenshot({
      path: testInfo.outputPath('header-action-' + width + '-idle.png'),
      fullPage: true,
      animations: 'disabled',
    })
    const circle = page.getByTestId('header-action-add').locator('.fos-ha__circle')
    const rect = await circle.boundingBox()
    expect(rect).toBeTruthy()
    await page.mouse.move(rect!.x + 8, rect!.y + 8)
    await page.mouse.down()
    await page.waitForTimeout(180)
    await page.screenshot({
      path: testInfo.outputPath('header-action-' + width + '-pressed.png'),
      fullPage: true,
      animations: 'disabled',
    })
    await page.mouse.up()
    await page.waitForTimeout(800)
  }
})
