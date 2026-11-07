const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright')
const { PNG } = require('pngjs')

// Fetch CURRENT node PNGs with Figma MCP into output/fe-s03/figma first.
// Export bounds include 24px horizontal and 16px top shadow overflow; node
// dimensions are export width/height minus 48px. Never resize either image.
const root = path.resolve('output/fe-s03')
const out = path.join(root, 'comparison')
fs.mkdirSync(out, { recursive: true })
const families = ['companies', 'support-list', 'support-detail', 'layouts-list', 'layouts-detail', 'layouts-upload', 'layouts-select', 'layouts-selection-detail', 'layouts-select-upload']
const widths = { d: 1440, t: 768, m: 390 }

async function run() {
  const browser = await chromium.launch()
  const results = []
  try {
    for (const family of families) for (const [size, width] of Object.entries(widths)) {
      const name = family + '-' + size
      const refPath = path.join(root, 'figma', name + '.png')
      if (!fs.existsSync(refPath)) throw new Error('Missing CURRENT Figma reference ' + refPath)
      const exported = PNG.sync.read(fs.readFileSync(refPath))
      const reference = new PNG({ width: exported.width - 48, height: exported.height - 48 })
      PNG.bitblt(exported, reference, 24, 16, reference.width, reference.height, 0, 0)
      if (reference.width !== width) throw new Error('Unexpected Figma export bounds for ' + name)
      const page = await browser.newPage({ viewport: { width, height: reference.height }, reducedMotion: 'reduce' })
      try {
        const picker = family.startsWith('layouts-select')
        const view = picker ? 'client-orders' : family === 'companies' ? 'manager-companies' : family.startsWith('support') ? 'client-support' : 'client-layouts'
        await page.goto((process.env.M7_BASE_URL || 'http://127.0.0.1:5173') + '/?view=' + view)
        if (picker) {
          await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
          await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
          await page.getByRole('button', { name: 'Мои макеты', exact: true }).click()
          if (family === 'layouts-selection-detail') await page.getByTestId('layout-row-demo-layout-01').click()
          if (family === 'layouts-select-upload') await page.getByRole('button', { name: 'Добавить макет', exact: true }).click()
        }
        if (family === 'support-detail') await page.getByTestId('ticket-row-client-01').click()
        if (family === 'layouts-detail') await page.getByTestId('layout-row-demo-layout-01').click()
        if (family === 'layouts-upload') await page.getByRole('button', { name: 'Добавить макет', exact: true }).click()
        await page.evaluate(() => document.fonts.ready)
        // Remove pointer hover from a row before recording the reference state.
        await page.mouse.move(0, 0)
        await page.screenshot({ path: path.join(out, 'react-' + name + '.png'), fullPage: true, animations: 'disabled' })
        const actual = PNG.sync.read(fs.readFileSync(path.join(out, 'react-' + name + '.png')))
        const comparison = new PNG({ width: reference.width + actual.width + 24, height: Math.max(reference.height, actual.height), fill: true })
        comparison.data.fill(255)
        PNG.bitblt(reference, comparison, 0, 0, reference.width, reference.height, 0, 0)
        PNG.bitblt(actual, comparison, 0, 0, actual.width, actual.height, reference.width + 24, 0)
        fs.writeFileSync(path.join(out, 'figma-' + name + '.png'), PNG.sync.write(reference))
        fs.writeFileSync(path.join(out, 'compare-' + name + '.png'), PNG.sync.write(comparison))
        const assets = await page.locator('main img').evaluateAll(images => images.map(img => ({ source: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height })))
        if (assets.some(asset => !asset.loaded)) throw new Error('Unloaded asset at ' + name)
        results.push({ name, viewport: { width, height: reference.height }, assets, reference: 'Figma CURRENT', acceptance: 'AUTHOR_COMPARISON / OWNER_OPEN' })
      } finally { await page.close() }
    }
  } finally { await browser.close() }
  fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(results, null, 2))
  fs.writeFileSync(path.join(out, 'index.html'), '<!doctype html><meta charset="utf-8"><title>FE-S03 Figma / React</title><style>body{font:16px system-ui;margin:24px;background:#eee}section{margin:40px 0;overflow:auto}img{display:block;max-width:none}h2{position:sticky;left:0}</style><h1>FE-S03: CURRENT Figma слева, React справа</h1><p>Native pixels, no scaling. Synthetic copy, accepted Glass and explicitly disabled candidate actions differ. Owner acceptance OPEN.</p>' + results.map(item => '<section><h2>' + item.name + '</h2><img src="compare-' + item.name + '.png" alt="Figma слева, React справа: ' + item.name + '"></section>').join(''))
  console.log(JSON.stringify({ comparisons: results.length, directory: out, assetsLoaded: true }))
}
run().catch(error => { console.error(error); process.exitCode = 1 })
