import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'

function changedPixels(before: PNG, after: PNG, rect: { x: number; y: number; width: number; height: number }) {
  let changed = 0
  for (let y = Math.floor(rect.y); y < rect.y + rect.height; y++) {
    for (let x = Math.floor(rect.x); x < rect.x + rect.width; x++) {
      const i = (y * before.width + x) * 4
      const delta = Math.abs(before.data[i] - after.data[i]) + Math.abs(before.data[i + 1] - after.data[i + 1]) + Math.abs(before.data[i + 2] - after.data[i + 2])
      if (delta > 3) changed++
    }
  }
  return changed
}

test('latest preview keeps its opaque viewport and masks fields beneath it', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'SVG backdrop refraction is Chromium only')
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/?view=client-orders&documentGlass=latest')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByLabel('Выбрать подписной бланк', { exact: true }).setInputFiles({ name: 'synthetic.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') })
  await page.getByRole('button', { name: /Открыть документ Файл synthetic/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('data-document-glass', 'latest')
  await expect(dialog).toHaveAttribute('data-document-kind', 'unsupported')
  await expect(dialog.locator('.fos-document-shell')).toHaveAttribute('data-material-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
  const viewport = dialog.locator('.fos-document-viewport')
  expect((await viewport.boundingBox())!.height).toBeGreaterThan(500)
  await expect(viewport).toHaveCSS('background-color', 'rgb(250, 251, 252)')
  await expect(viewport).toContainText('Предпросмотр этого формата недоступен')
  const field = page.getByLabel('Согласованный срок', { exact: true }).first()
  const box = (await field.boundingBox())!
  const before = PNG.sync.read(await page.screenshot({ path: info.outputPath('latest-real-order.png') }))
  await field.evaluate(node => { node.style.visibility = 'hidden' })
  const after = PNG.sync.read(await page.screenshot())
  await field.evaluate(node => { node.style.visibility = '' })
  const panel = (await viewport.boundingBox())!
  const overlap = {
    x: Math.max(box.x, panel.x), y: Math.max(box.y, panel.y),
    width: Math.min(box.x + box.width, panel.x + panel.width) - Math.max(box.x, panel.x),
    height: Math.min(box.y + box.height, panel.y + panel.height) - Math.max(box.y, panel.y),
  }
  expect(overlap.width).toBeGreaterThan(20)
  const visiblePixels = changedPixels(before, after, { ...overlap, x: overlap.x + 10, width: overlap.width - 20 })
  expect(visiblePixels, 'real date field must not show through the matte preview panel').toBe(0)
  await info.attach('field-masking', { body: JSON.stringify({ visiblePixels }), contentType: 'application/json' })
})

test('latest preview title backdrop grows with the visible filename', async ({ page, browserName }, info) => {
  if (browserName === 'chromium') await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  const widths = []
  for (const name of ['a.csv', 'very-long-signed-document-name-for-client-review.csv']) {
    await page.goto('/?view=client-orders&documentGlass=latest')
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await page.getByLabel('Выбрать подписной бланк', { exact: true }).setInputFiles({ name, mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') })
    await page.getByRole('button', { name: new RegExp(`Открыть документ Файл ${name.replace('.', '\\.')}`) }).click()
    const title = page.getByRole('dialog').locator('.fos-document-content h2')
    await expect(title).toHaveCSS('backdrop-filter', 'blur(5px)')
    widths.push((await title.boundingBox())!.width)
    await page.screenshot({ path: info.outputPath(`latest-title-${widths.length}.png`) })
  }
  expect(widths[1]).toBeGreaterThan(widths[0] + 100)
  await page.setViewportSize({ width: 320, height: 390 })
  const mobileTitle = page.getByRole('dialog').locator('.fos-document-content h2')
  const titleBox = (await mobileTitle.boundingBox())!
  const headerBox = (await page.getByRole('dialog').locator('.fos-document-content header > div').boundingBox())!
  expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(headerBox.x + headerBox.width + 1)
  await expect(page.getByRole('button', { name: 'Закрыть', exact: true })).toBeInViewport()
  await info.attach('filename-backdrop-width', { body: JSON.stringify(widths), contentType: 'application/json' })
})

test('latest preview lens bends inside its visible rim and tapers at the outside edge', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'SVG backdrop refraction is Chromium only')
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/tests/fixtures/document-glass-pilot.html?pattern=fields&documentGlass=latest')
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready', 'true')
  const href = await page.locator('.fos-document-shell .fos-glass-optics feImage').getAttribute('href')
  expect(href).toMatch(/^data:image\/png;base64,/)
  const map = PNG.sync.read(Buffer.from(href!.split(',')[1], 'base64'))
  const row = Math.floor(map.height / 2)
  const red = (x: number) => map.data[(row * map.width + x) * 4]
  const edge = Math.abs(red(0) - 128)
  const middle = Math.abs(red(2) - 128)
  const inner = Math.abs(red(7) - 128)
  expect(middle, 'bend should peak within the visible rim').toBeGreaterThan(edge + 20)
  expect(inner, 'bend should fade before the opaque viewport').toBeLessThan(8)
  expect(Math.abs(red(map.width - 3) - 128)).toBeGreaterThan(edge + 20)
})

test('latest preview lens refracts real input edges on both sides', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'SVG backdrop refraction is Chromium only')
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/tests/fixtures/document-glass-pilot.html?pattern=fields&documentGlass=latest')
  const shell = page.locator('.fos-document-shell')
  await expect(shell).toHaveAttribute('data-material-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
  const shellBox = (await shell.boundingBox())!
  const lens = shell.locator('.fos-glass-optics')
  const normal = PNG.sync.read(await page.screenshot({ path: info.outputPath('latest-refracted-fields.png') }))
  await lens.evaluate(node => { (node as HTMLElement).style.backdropFilter = 'blur(.5px) saturate(1.5)' })
  const flat = PNG.sync.read(await page.screenshot())
  const results = []
  for (const side of ['left', 'right'] as const) {
    const input = page.locator(`[data-dgp=edge-${side}]`)
    const field = (await input.boundingBox())!
    const rect = { x: side === 'left' ? shellBox.x + 2 : shellBox.x + shellBox.width - 18, y: field.y - 3, width: 16, height: field.height + 6 }
    const changed = changedPixels(normal, flat, rect)
    results.push({ side, changed })
    expect(changed, `${side} field edge must change when displacement is removed`).toBeGreaterThan(5)
  }
  await info.attach('real-field-refraction', { body: JSON.stringify(results), contentType: 'application/json' })
})

test('acceptance stand exposes only Pilot and latest real-order comparison', async ({ page }) => {
  await page.goto('/tests/fixtures/document-glass-review.html')
  await expect(page.locator('[data-review-version]')).toHaveCount(2)
  await expect(page.locator('[data-review-version="pilot"] h2')).toContainText('Pilot')
  await expect(page.locator('[data-review-version="latest"] h2')).toContainText('Последняя версия')
  const hrefs = await page.locator('article .actions a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
  expect(hrefs).toHaveLength(6)
  expect(hrefs.filter(href => href?.includes('documentGlass=pilot'))).toHaveLength(2)
  expect(hrefs.filter(href => href?.includes('documentGlass=latest'))).toHaveLength(2)
  expect(hrefs.some(href => href?.includes('documentPanel=') || href?.includes('documentOptics='))).toBe(false)
})
