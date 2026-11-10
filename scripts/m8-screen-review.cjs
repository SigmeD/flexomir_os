// Fresh review artifacts, never an automatic visual-acceptance score.
// First download the CURRENT Figma frames listed in --manifest via the Figma MCP.
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { chromium, firefox, webkit } = require('playwright')
const { PNG } = require('pngjs')

const arg = (name, fallback) => {
  const i = process.argv.indexOf('--' + name)
  return i < 0 ? fallback : process.argv[i + 1]
}
const root = path.resolve(arg('output', 'output/m8-final'))
const manifest = JSON.parse(fs.readFileSync(arg('manifest', path.join(__dirname, 'm8-screen-manifest.json')), 'utf8'))
const browserName = arg('browser', 'chromium')
const only = arg('only', '').split(',').filter(Boolean)
const baseURL = process.env.M8_BASE_URL || 'http://127.0.0.1:5173'
const screenDir = path.join(root, browserName)
fs.mkdirSync(screenDir, { recursive: true })
fs.mkdirSync(path.join(root, 'compare'), { recursive: true })

async function openState(page, family) {
  const role = family.startsWith('manager-') || ['companies', 'company-orders'].includes(family) ? 'manager' : 'client'
  const picker = family.startsWith('layouts-select')
  const view = family.includes('support') ? role + '-support'
    : ['companies', 'company-orders'].includes(family) ? 'manager-companies'
    : family.startsWith('layouts-') && !picker ? 'client-layouts' : role + '-orders'
  await page.goto(baseURL + '/?view=' + view)
  await page.getByRole('heading', { level: 1 }).waitFor()
  if (family === 'company-orders') await page.getByTestId('company-row-company-01').click()
  if (family.endsWith('support-new')) await page.getByRole('button', { name: 'Добавить обращение', exact: true }).click()
  if (family.endsWith('support-detail')) await page.getByTestId('ticket-row-' + role + '-01').click()
  if (family === 'layouts-detail') await page.getByTestId('layout-row-demo-layout-01').click()
  if (family === 'layouts-upload') await page.getByRole('button', { name: 'Добавить макет', exact: true }).click()
  if (family === 'client-detail' || family === 'manager-detail') await page.getByRole('button', { name: 'Открыть заказ DEMO-003' }).click()
  if (family === 'client-completed') await page.getByRole('button', { name: 'Открыть заказ DEMO-007' }).click()
  if (['client-new', 'client-item', 'manager-draft', 'manager-item'].includes(family) || picker) {
    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    if (family.endsWith('-item') || picker) await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  }
  if (picker) {
    await page.getByRole('button', { name: 'Мои макеты', exact: true }).click()
    if (family === 'layouts-selection-detail') await page.getByTestId('layout-row-demo-layout-01').click()
    if (family === 'layouts-select-upload') await page.getByRole('button', { name: 'Добавить макет', exact: true }).click()
  }
  await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0) })
  await page.mouse.move(0, 0)
  await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)))
}

function referenceFor(item) {
  const name = item.family + '-' + item.size
  const rawPath = path.join(root, 'figma', name + '.png')
  const raw = PNG.sync.read(fs.readFileSync(rawPath))
  if (raw.width === item.width && raw.height === item.height) return rawPath
  // Export offsets come from this exact node's absoluteBoundingBox/renderBounds.
  // Existing frames have different shadow/overflow extents; never assume or resize.
  const bounds = item.exportBounds
  if (!bounds || Math.abs(raw.width - bounds.width) > 1 || Math.abs(raw.height - bounds.height) > 1
    || bounds.left < 0 || bounds.top < 0 || bounds.left + item.width > raw.width || bounds.top + item.height > raw.height) {
    throw new Error(`Unrecognised Figma export bounds for ${name}: ${raw.width}x${raw.height}; frame ${item.width}x${item.height}`)
  }
  const cropped = new PNG({ width: item.width, height: item.height })
  PNG.bitblt(raw, cropped, bounds.left, bounds.top, item.width, item.height, 0, 0)
  const target = path.join(root, 'compare', 'figma-' + name + '.png')
  fs.writeFileSync(target, PNG.sync.write(cropped))
  return target
}

async function run() {
  const engine = { chromium, firefox, webkit }[browserName]
  if (!engine) throw new Error('Unknown browser ' + browserName)
  const browser = await engine.launch()
  const results = []
  try {
    for (const item of manifest.filter(row => !only.length || only.includes(row.family))) {
      const name = item.family + '-' + item.size
      const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      try {
        await openState(page, item.family)
        const actual = path.join(screenDir, 'react-' + name + '.png')
        await page.screenshot({ path: actual, animations: 'disabled' })
        const facts = await page.evaluate(() => ({
          title: document.title,
          heading: document.querySelector('h1')?.textContent,
          horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
          contentHeight: document.documentElement.scrollHeight,
          main: (() => { const r = document.querySelector('main')?.getBoundingClientRect(); return r ? { x: r.x, y: r.y, width: r.width } : null })(),
          unloadedImages: Array.from(document.images).filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src')),
        }))
        const reference = referenceFor(item)
        const pair = path.join(root, 'compare', browserName + '-' + name + '.png')
        execFileSync(process.execPath, [path.join(__dirname, 'orders-figma-comparison.cjs'), reference, actual, pair], { stdio: 'pipe' })
        results.push({ ...item, url: page.url(), browser: browserName, facts, errors, reference, actual, pair, visualStatus: 'REVIEW_REQUIRED' })
        console.log(`${name}: captured; overflow=${facts.horizontalOverflow}; errors=${errors.length}`)
      } catch (error) {
        results.push({ ...item, browser: browserName, captureError: String(error), visualStatus: 'NOT_RUN' })
        console.error(name + ': ' + error)
      } finally { await page.close() }
    }
  } finally { await browser.close() }
  fs.writeFileSync(path.join(root, browserName + '-manifest.json'), JSON.stringify(results, null, 2))
  const relative = value => path.relative(root, value).split(path.sep).join('/')
  const html = '<!doctype html><html lang="ru"><meta charset="utf-8"><title>M8 — Figma / React</title>'
    + '<style>body{font:16px system-ui;background:#edf0f3;color:#182331;margin:24px}section{margin:40px 0}figure{margin:0;overflow:auto}img{display:block;max-width:none}h2{margin:0 0 8px}p{max-width:1000px}</style>'
    + '<h1>M8: свежая Figma слева, React справа</h1><p>Рендеры в исходных размерах. Синтетические данные, утверждённые более поздние Owner решения и кандидаты проверяются отдельно. Эти пары не являются автоматической визуальной приёмкой.</p>'
    + results.map(item => `<section><h2>${item.family} / ${item.size} · ${item.nodeId}</h2><p>${item.referenceStatus}; ${item.width}×${item.height}; ${item.captureError || 'REVIEW REQUIRED'}</p>${item.pair ? `<figure><img loading="lazy" src="${relative(item.pair)}" alt="Figma и React: ${item.family} ${item.size}"></figure>` : ''}</section>`).join('') + '</html>'
  fs.writeFileSync(path.join(root, browserName + '-index.html'), html)
  const failed = results.filter(item => item.captureError || item.errors.length || item.facts.horizontalOverflow > 0 || item.facts.unloadedImages.length)
  console.log(JSON.stringify({ captures: results.length, failed: failed.map(item => item.family + '-' + item.size), index: path.join(root, browserName + '-index.html') }))
  if (failed.length) process.exitCode = 1
}
run().catch(error => { console.error(error); process.exitCode = 1 })
