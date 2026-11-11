import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`neutral action pilot preserves geometry and one material at ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 960 })
    await page.goto('/?view=neutral-actions')
    await expect(page.getByTestId('neutral-actions-lab')).toBeVisible()
    const paper = page.getByTestId('neutral-paper')
    const plus = paper.getByTestId('neutral-plus')
    await expect(plus).toHaveCSS('width', '44px')
    await expect(plus).toHaveCSS('height', '44px')
    await expect(plus.locator('.fos-glass-material')).toHaveCount(1)
    await expect(plus.locator('.fos-glass-material')).toHaveCSS('width', '34px')
    await expect(plus.locator('.fos-glass-material')).toHaveCSS('--fos-center-rgb', '255 255 255')
    await expect(plus.locator('img')).toHaveCount(0)
    const header = paper.getByTestId('neutral-header')
    await expect(header).toHaveCSS('width', width >= 1024 ? '68px' : '48px')
    await expect(header.locator('.fos-ha__circle')).toHaveCSS('width', '48px')
    await expect(header.locator('.fos-glass-material')).toHaveCount(1)
    await expect(header.locator('.fos-ha__glyph-mask')).toHaveCSS('mask-image', /url\(/)
    await expect(paper.getByTestId('neutral-primary').locator('.fos-action__solid')).toHaveCSS('background-color', 'rgb(44, 44, 44)')
    await expect(paper.getByTestId('neutral-primary').locator('[data-fos-glass-material]')).toHaveCount(0)
    await expect(paper.getByTestId('neutral-secondary').locator('.fos-glass-material')).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: info.outputPath(`neutral-${width}.png`), fullPage: true })
  })
}

test('neutral commands share pointer/keyboard press and native disabled semantics', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?view=neutral-actions')
  const paper = page.getByTestId('neutral-paper')
  const plus = paper.getByTestId('neutral-plus'), count = paper.getByTestId('neutral-count')
  if (info.project.use.hasTouch) await plus.tap()
  else await plus.click()
  await plus.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(count).toHaveText('Нажатий: 3')
  const box = (await plus.boundingBox())!
  // A 44px round target excludes its square corners in Firefox/WebKit hit testing.
  expect(await plus.evaluate(node => {
    const rect = node.getBoundingClientRect()
    return node.contains(document.elementFromPoint(rect.x + 12, rect.y + 12))
  })).toBe(true)
  await page.mouse.move(box.x + 12, box.y + 12)
  await page.mouse.down()
  await expect(plus).toHaveAttribute('data-pressed', 'true')
  // Press shrinks relative to the slightly enlarged hover state.
  await expect.poll(() => plus.locator('.fos-action__glass').evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m22)).toBeLessThan(.99)
  expect(await plus.boundingBox()).toEqual(box)
  await paper.screenshot({ path: info.outputPath('neutral-pressed.png') })
  await page.mouse.up()
  await expect(plus).toHaveAttribute('data-pressed', 'false')
  let clicks = 4
  for (const id of ['neutral-header', 'neutral-primary', 'neutral-secondary']) {
    const button = paper.getByTestId(id)
    await button.click()
    await button.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Space')
    clicks += 3
    await expect(count).toHaveText(`Нажатий: ${clicks}`)
  }
  const disabled = paper.getByTestId('neutral-disabled')
  await expect(disabled).toBeDisabled()
  const before = await count.textContent()
  await disabled.evaluate(node => (node as HTMLButtonElement).click())
  await expect(count).toHaveText(before!)
  await expect(disabled).toHaveAttribute('data-pressed', 'false')
})

test('neutral pilot supports reduced motion, forced colors, narrow height and axe', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?view=neutral-actions')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' })
  const plus = page.getByTestId('neutral-paper').getByTestId('neutral-plus')
  await expect(plus).toHaveCSS('border-width', '1px')
  await expect(plus.locator('.fos-section-add__glyph')).toHaveCSS('color', await plus.evaluate(node => getComputedStyle(node).color))
  await plus.click()
  await expect(page.getByTestId('neutral-paper').getByTestId('neutral-count')).toHaveText('Нажатий: 1')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('shared press ends on keyboard blur, pointer cancel and lost capture', async ({ page }) => {
  await page.goto('/?view=neutral-actions')
  const button = page.getByTestId('neutral-paper').getByTestId('neutral-plus')
  await button.evaluate(node => node.addEventListener('pointerdown', event => { node.dataset.testPointerId = String((event as PointerEvent).pointerId) }))
  await button.focus()
  await page.keyboard.down('Space')
  await expect(button).toHaveAttribute('data-pressed', 'true')
  await page.keyboard.press('Tab')
  await expect(button).toHaveAttribute('data-pressed', 'false')
  await page.keyboard.up('Space')
  for (const mode of ['cancel', 'lost-capture']) {
    await button.scrollIntoViewIfNeeded()
    const box = (await button.boundingBox())!
    await page.mouse.move(box.x + 22, box.y + 22)
    await page.mouse.down()
    await expect(button).toHaveAttribute('data-pressed', 'true')
    const id = Number(await button.getAttribute('data-test-pointer-id'))
    if (mode === 'cancel') await button.dispatchEvent('pointercancel', { pointerId: id, pointerType: 'mouse' })
    else {
      // Flush pending capture first; releasing before gotpointercapture emits no loss.
      await page.mouse.move(box.x + 23, box.y + 23)
      await button.evaluate((node, pointerId) => node.releasePointerCapture(pointerId), id)
      await page.mouse.move(box.x + 24, box.y + 24)
    }
    await expect(button).toHaveAttribute('data-pressed', 'false')
    await page.mouse.up()
  }
})

test('Client and Manager use the same Plus and open the item editor immediately', async ({ page }) => {
  for (const role of ['client', 'manager']) {
    await page.goto(`/?view=${role}-orders`)
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    const plus = page.getByRole('button', { name: 'Добавить позицию', exact: true })
    await expect(plus.locator('.fos-glass-material')).toHaveCount(1)
    await expect(plus.locator('img')).toHaveCount(0)
    await plus.click()
    await expect(page.getByTestId('order-item-form')).toBeVisible()
  }
})


test('signed-file add pilot reuses the same neutral 44px Liquid Glass action with an SVG icon', async ({ page }) => {
  await page.goto('/?view=neutral-actions')
  const paper = page.getByTestId('neutral-paper')
  const original = paper.getByTestId('neutral-plus')
  const file = paper.getByTestId('neutral-file-add')
  const count = paper.getByTestId('neutral-count')

  await expect(original).toHaveAttribute('aria-label', 'Добавить позицию')
  await expect(file).toHaveAttribute('aria-label', 'Добавить подписной бланк')
  await expect(file).toHaveCSS('width', '44px')
  await expect(file).toHaveCSS('height', '44px')
  await expect(file.locator('.fos-glass-material')).toHaveCount(1)
  await expect(file.locator('.fos-glass-material')).toHaveCSS('width', '34px')
  await expect(file.locator('.fos-section-add__file-icon')).toHaveCSS('width', '24px')
  await expect(file.locator('.fos-section-add__file-icon')).toHaveCSS('height', '24px')
  await expect(file.locator('.fos-section-add__file-icon')).toHaveCSS('mask-image', /url\\(/)
  await expect(file.locator('img')).toHaveCount(0)
  await expect(file).toHaveAttribute('data-pressed', 'false')

  await file.click()
  await expect(count).toHaveText('Нажатий: 1')
  await file.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  await expect(count).toHaveText('Нажатий: 3')

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(file).toBeVisible()
    await expect(file.locator('.fos-glass-material')).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
