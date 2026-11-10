/* Reproducible read-only Owner evidence; run after build with dev/preview servers. */
const { chromium } = require('@playwright/test')
const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const { execFileSync } = require('node:child_process')
const out = path.resolve('output/playwright/fos08-09')
const dev = process.env.FOS0809_BASE_URL || 'http://127.0.0.1:5173'
const prod = process.env.FOS0809_PRODUCTION_URL || 'http://127.0.0.1:5185'
const widths = [1440, 1024, 768, 390, 320]
const sha = file => createHash('sha256').update(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n')).digest('hex')
const assert = (condition, message) => { if (!condition) throw new Error(message) }

async function main() {
  fs.mkdirSync(path.join(out, 'final'), { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = [], layouts = [], production = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 960 })
      await page.goto(dev + '/?view=neutral-actions')
      await page.evaluate(() => document.fonts.ready)
      const box = await page.getByTestId('neutral-paper').getByTestId('neutral-plus').boundingBox()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      assert(box.width === 44 && box.height === 44 && overflow === 0, 'Invalid geometry at ' + width)
      layouts.push({ width, plus: box, overflow })
      await page.screenshot({ path: path.join(out, `final/lab-${width}.png`), fullPage: true })
    }
    await page.setViewportSize({ width: 1440, height: 960 })
    await page.goto(dev + '/?view=neutral-actions')
    const plus = page.getByTestId('neutral-paper').getByTestId('neutral-plus')
    await plus.focus()
    await page.keyboard.down('Space')
    await page.waitForFunction(() => parseFloat(document.querySelector('[data-testid="neutral-paper"] [data-testid="neutral-plus"] .fos-action__motion').style.getPropertyValue('--fos-action-scale')) < 1)
    await page.screenshot({ path: path.join(out, 'final/pressed.png'), fullPage: true })
    await page.keyboard.up('Space')
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
    const forced = await plus.evaluate(node => {
      const button = getComputedStyle(node), glyph = getComputedStyle(node.querySelector('.fos-section-add__glyph'), '::before')
      return { border: button.borderWidth, ink: button.color, stroke: glyph.backgroundColor }
    })
    assert(forced.border === '1px' && forced.ink === forced.stroke, 'Invisible forced-colors Plus')
    await page.screenshot({ path: path.join(out, 'final/forced.png'), fullPage: true })
    await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'no-preference' })
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] })
    const reduced = await plus.locator('.fos-glass-material').evaluate(node => ({ matches: matchMedia('(prefers-reduced-transparency: reduce)').matches, background: getComputedStyle(node).backgroundColor }))
    assert(reduced.matches && reduced.background === 'rgb(255, 255, 255)', 'Reduced-transparency backing missing')
    await page.screenshot({ path: path.join(out, 'final/reduced-transparency.png'), fullPage: true })
    await cdp.send('Emulation.setEmulatedMedia', { features: [] })
    await page.goto(prod + '/?view=neutral-actions')
    assert(await page.getByTestId('neutral-actions-lab').count() === 0, 'DEV lab exposed in production')
    for (const role of ['client', 'manager']) for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 960 })
      await page.goto(prod + `/?view=${role}-orders&actionPalette=neutral-pilot`)
      await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
      const add = page.getByRole('button', { name: 'Добавить позицию', exact: true })
      assert(await add.locator('img').count() === 1 && await add.locator('.fos-glass-material').count() === 0, 'Production Plus changed')
      assert(await page.locator('[data-action-palette="neutral-pilot"]').count() === 0, 'Palette exposed in production')
      const status = await page.locator('.fos-page-header__subtitle').evaluate(node => getComputedStyle(node).fontSize)
      assert(status === (width >= 1024 ? '14px' : '12px'), 'Approved status size changed')
      production.push({ role, width, palette: 'reference', status })
    }
    const manifest = JSON.parse(fs.readFileSync('docs/FE11_MOTION_FROZEN_V0_2.json', 'utf8'))
    const frozen = Object.entries(manifest.normalized_engine_sha256).every(([file, hash]) => sha(file).toUpperCase() === hash)
    assert(frozen && errors.length === 0, 'Frozen source or runtime error')
    const sourceFiles = ['src/App.tsx', 'src/NeutralActionsLab.tsx', 'src/NeutralActionsLab.css',
      'src/components/ui/action-palette.ts', 'src/components/ui/action-palette.css',
      'src/components/ui/header-action.tsx', 'src/components/ui/header-action.css',
      'src/components/ui/fos-controls.tsx', 'src/components/ui/fos-controls.css',
      'src/components/ui/use-directional-press.ts', 'src/components/orders/SectionAddItem.tsx',
      'src/components/orders/section-add-item.css', 'src/components/orders/OrderComposer.tsx', 'src/styles.css']
    const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, sha(file)]))
    const result = { headAtCapture: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), layouts, forced, reducedChromium: reduced, production, frozen, errors, sourceHashes }
    fs.writeFileSync(path.join(out, 'observations.json'), JSON.stringify(result, null, 2))
    fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><html lang="ru"><meta charset="utf-8"><title>FOS08/09 evidence</title><h1>DEV pilot · OWNER OPEN</h1><p><a href="${dev}/?view=neutral-actions">Интерактивный стенд</a> · <a href="observations.json">Измерения/source hashes</a></p>${[...widths.map(width => `lab-${width}`), 'pressed', 'forced', 'reduced-transparency'].map(name => `<h2>${name}</h2><div style="overflow:auto"><img src="final/${name}.png" alt="${name}" style="max-width:none"></div>`).join('')}</html>`)
    console.log(JSON.stringify({ screenshots: 8, production, frozen, errors, sourceFiles: sourceFiles.length }))
  } finally { await browser.close() }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1 })
