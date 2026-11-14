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

test('latest DEV preview exposes real fields through a compact unsupported-format message', async ({ page, browserName }, info) => {
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
  expect((await viewport.boundingBox())!.height).toBeLessThan(80)
  await expect(viewport).toContainText('Предпросмотр этого формата недоступен')
  const field = page.getByLabel('Согласованный срок', { exact: true }).first()
  const box = (await field.boundingBox())!
  const before = PNG.sync.read(await page.screenshot({ path: info.outputPath('latest-real-order.png') }))
  await field.evaluate(node => { node.style.visibility = 'hidden' })
  const after = PNG.sync.read(await page.screenshot())
  await field.evaluate(node => { node.style.visibility = '' })
  const visiblePixels = changedPixels(before, after, { x: box.x, y: box.y, width: box.width, height: box.height })
  expect(visiblePixels, 'real date field must remain visible through the glass surface').toBeGreaterThan(100)
  await info.attach('field-visibility', { body: JSON.stringify({ visiblePixels }), contentType: 'application/json' })
})

test('latest DEV lens bends inside its visible rim and tapers at the outside edge', async ({ page, browserName }) => {
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

test('latest DEV lens visibly refracts real input edges on both sides', async ({ page, browserName }, info) => {
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
