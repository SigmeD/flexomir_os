import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'

function changedPixels(before: PNG, after: PNG, rect: {x:number;y:number;width:number;height:number}) {
  let count = 0
  for (let y = Math.floor(rect.y); y < rect.y + rect.height; y++) {
    for (let x = Math.floor(rect.x); x < rect.x + rect.width; x++) {
      const i = (y * before.width + x) * 4
      const delta = Math.abs(before.data[i] - after.data[i]) + Math.abs(before.data[i + 1] - after.data[i + 1]) + Math.abs(before.data[i + 2] - after.data[i + 2])
      if (delta > 3) count++
    }
  }
  return count
}

test('Pilot refracts the real FOSInput border at both sides of the document popup', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'SVG backdrop refraction is Chromium only')
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/tests/fixtures/document-glass-pilot.html?pattern=fields&documentGlass=pilot')
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
  const viewport = (await page.locator('.fos-document-viewport').boundingBox())!
  const results = []
  for (const side of ['left', 'right'] as const) {
    const input = page.locator(`[data-dgp=edge-${side}]`)
    const box = (await input.boundingBox())!
    const rect = side === 'left'
      ? { x: box.x - 2, y: box.y - 3, width: viewport.x - box.x + 4, height: box.height + 6 }
      : { x: viewport.x + viewport.width - 2, y: box.y - 3, width: box.x + box.width - viewport.x - viewport.width + 4, height: box.height + 6 }
    const before = PNG.sync.read(await page.screenshot({ path: info.outputPath(`line-${side}.png`) }))
    await input.evaluate(node => { node.style.borderColor = 'transparent' })
    const after = PNG.sync.read(await page.screenshot())
    await input.evaluate(node => { node.style.borderColor = '' })
    const changed = changedPixels(before, after, rect)
    results.push({ side, changed, rect })
    expect(changed, `${side} thin border should contribute visible pixels in the glass rim`).toBeGreaterThan(5)
  }
  await info.attach('line-trial-pixels', { body: JSON.stringify(results), contentType: 'application/json' })
})

test('Pilot carries date and signed-document row borders through the real order screen', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'SVG backdrop refraction is Chromium only')
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/?view=client-orders&documentGlass=pilot')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByLabel('Выбрать подписной бланк', { exact: true }).setInputFiles({ name: 'synthetic.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') })
  await page.getByRole('button', { name: /Открыть документ Файл synthetic/ }).click()
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
  const shell = (await page.locator('.fos-document-shell').boundingBox())!
  const viewport = (await page.locator('.fos-document-viewport').boundingBox())!
  const results = []
  for (const [label, locator, side] of [
    ['date', page.getByLabel('Согласованный срок', { exact: true }).first(), 'right'],
    ['row', page.locator('.fos-document-row').first(), 'left'],
    ['row', page.locator('.fos-document-row').first(), 'right'],
  ] as const) {
    const box = (await locator.boundingBox())!
    const rect = side === 'left'
      ? { x: shell.x + 2, y: box.y - 2, width: viewport.x - shell.x - 2, height: box.height + 4 }
      : { x: viewport.x + viewport.width, y: box.y - 2, width: shell.x + shell.width - viewport.x - viewport.width - 2, height: box.height + 4 }
    const before = PNG.sync.read(await page.screenshot())
    await locator.evaluate(node => { node.style.borderColor = 'transparent' })
    const after = PNG.sync.read(await page.screenshot())
    await locator.evaluate(node => { node.style.borderColor = '' })
    const changed = changedPixels(before, after, rect)
    results.push({ label, side, changed })
    expect(changed, `${label} ${side} border under the rim`).toBeGreaterThan(5)
  }
  await info.attach('real-order-line-pixels', { body: JSON.stringify(results), contentType: 'application/json' })
})

test('Latest carries the normal grey FOSInput background through both glass rims', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'SVG backdrop refraction is Chromium only')
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/tests/fixtures/document-glass-pilot.html?pattern=fields&documentGlass=latest')
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
  const shell = (await page.locator('.fos-document-shell').boundingBox())!
  const viewport = (await page.locator('.fos-document-viewport').boundingBox())!
  const results = []
  for (const side of ['left', 'right'] as const) {
    const input = page.locator(`[data-dgp=edge-${side}]`)
    const box = (await input.boundingBox())!
    const rect = side === 'left'
      ? { x: shell.x + 2, y: box.y + 5, width: viewport.x - shell.x - 2, height: box.height - 10 }
      : { x: viewport.x + viewport.width, y: box.y + 5, width: shell.x + shell.width - viewport.x - viewport.width - 2, height: box.height - 10 }
    await expect(input).toHaveCSS('background-color', 'rgb(246, 247, 249)')
    const grey = PNG.sync.read(await page.screenshot({ path: info.outputPath(`fill-${side}.png`) }))
    await input.evaluate(node => { node.style.backgroundColor = 'white' })
    const white = PNG.sync.read(await page.screenshot())
    await input.evaluate(node => { node.style.backgroundColor = '' })
    const changed = changedPixels(grey, white, rect)
    results.push({ side, changed })
    expect(changed, `${side} normal grey fill should affect the visible glass rim`).toBeGreaterThan(100)
  }
  await info.attach('fill-trial-pixels', { body: JSON.stringify(results), contentType: 'application/json' })
})

test('Latest shows the real order date fill and border through its rim', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'SVG backdrop refraction is Chromium only')
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { value: navigator.userAgent.replace('HeadlessChrome', 'Chrome') }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/?view=client-orders&documentGlass=latest')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByLabel('Выбрать подписной бланк', { exact: true }).setInputFiles({ name: 'synthetic.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') })
  await page.getByRole('button', { name: /Открыть документ Файл synthetic/ }).click()
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready', 'true')
  await page.evaluate(() => document.fonts.ready)
  const date = page.getByLabel('Согласованный срок', { exact: true }).first()
  const shell = (await page.locator('.fos-document-shell').boundingBox())!
  const viewport = (await page.locator('.fos-document-viewport').boundingBox())!
  const dateBox = (await date.boundingBox())!
  const fillRect = { x: viewport.x + viewport.width, y: dateBox.y + 5, width: shell.x + shell.width - viewport.x - viewport.width - 2, height: dateBox.height - 10 }
  await expect(date).toHaveCSS('background-color', 'rgb(246, 247, 249)')
  await expect(page.locator('.fos-document-viewport')).toHaveCSS('background-color', 'rgba(250, 251, 252, 0.88)')
  const baseline = PNG.sync.read(await page.screenshot({ path: info.outputPath('real-order-fill.png') }))
  await date.evaluate(node => { node.style.backgroundColor = 'white' })
  const withoutGrey = PNG.sync.read(await page.screenshot())
  await date.evaluate(node => { node.style.backgroundColor = '' })
  const fillPixels = changedPixels(baseline, withoutGrey, fillRect)
  expect(fillPixels, 'real grey date field must affect the visible right rim').toBeGreaterThan(100)
  await date.evaluate(node => { node.style.borderColor = 'transparent' })
  const withoutBorder = PNG.sync.read(await page.screenshot())
  await date.evaluate(node => { node.style.borderColor = '' })
  const borderPixels = changedPixels(baseline, withoutBorder, { ...fillRect, y: dateBox.y - 2, height: dateBox.height + 4 })
  expect(borderPixels, 'real date field border remains visible').toBeGreaterThan(5)
  await info.attach('real-order-fill-pixels', { body: JSON.stringify({ fillPixels, borderPixels }), contentType: 'application/json' })
})
