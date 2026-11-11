/* Static native-input evidence and runtime samples. Owner requested no videos. */
const { chromium, firefox, webkit, devices } = require('@playwright/test')
const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const out = path.resolve(process.env.PLUS_MOTION_OUT || 'output/playwright/plus-motion/static')
const base = process.env.PLUS_MOTION_URL || 'http://127.0.0.1:5173'
const owned = new Set()
async function launch(engine) {
  const browser = await ({ chromium, firefox, webkit }[engine]).launch()
  owned.add(browser)
  return browser
}
const hash = file => createHash('sha256').update(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n')).digest('hex')
function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.posix.join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(file) : /\.(tsx?|css)$/.test(file) ? [file] : []
  })
}
const sources = sourceFiles('src').sort()
async function capture(engine, { touch = false, native = false, zoom = false } = {}) {
  const name = `${engine}-${native ? 'native' : touch ? 'touch' : zoom ? 'inspect4' : 'actual1'}`
  const browser = await launch(engine)
  const context = await browser.newContext({ viewport: touch ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: touch, isMobile: touch, reducedMotion: 'no-preference', ...(native ? { userAgent: devices['Desktop Chrome'].userAgent } : {}) })
  const page = await context.newPage(), states = [], errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    const original = requestAnimationFrame.bind(window), cancel = cancelAnimationFrame.bind(window), pending = new Set()
    window.__actionRaf = { pending, scheduled: 0 }
    window.requestAnimationFrame = callback => { window.__actionRaf.scheduled++; const id = original(t => { pending.delete(id); callback(t) }); pending.add(id); return id }
    window.cancelAnimationFrame = id => { pending.delete(id); cancel(id) }
  })
  await page.goto(`${base}/?view=plus-motion${zoom ? '&inspect=4' : ''}`)
  await page.evaluate(() => document.fonts.ready)
  const button = page.getByTestId('surface-plus'), material = button.locator('[data-fos-glass-material]')
  await page.waitForSelector('[data-testid="surface-plus"] [data-material-ready="true"]')
  await button.evaluate(node => node.removeAttribute('title'))
  async function snapshot(label, target = material) {
    const state = await target.evaluate(node => {
      const caption = node.closest('.fos-ha')?.querySelector('.fos-ha__caption')
      return { mode: node.dataset.opticsMode || node.dataset.actionSurface || 'content', transform: getComputedStyle(node).transform, shadow: getComputedStyle(node).boxShadow, box: node.getBoundingClientRect().toJSON(), border: getComputedStyle(node).borderTopWidth,
        ...(caption ? { caption: { box: caption.getBoundingClientRect().toJSON(), transform: getComputedStyle(caption).transform, font: getComputedStyle(caption).font, color: getComputedStyle(caption).color } } : {}) }
    })
    const filename = `${name}-${label}.png`
    await page.screenshot({ path: path.join(out, filename), fullPage: true })
    states.push({ label, filename, ...state })
  }
  await snapshot('default')
  const hit = await button.boundingBox()
  await page.evaluate(() => {
    const root = document.querySelector('[data-testid="surface-plus"] .fos-glass-material')
    const stats = window.__actionStats = { layouts: 0, mapMutations: 0, longTaskSupported: PerformanceObserver.supportedEntryTypes.includes('longtask'), longTasks: [] }
    new ResizeObserver(() => stats.layouts++).observe(root)
    new MutationObserver(records => stats.mapMutations += records.length).observe(root.querySelector('.fos-glass-optics'), { attributes: true, childList: true, subtree: true })
    if (stats.longTaskSupported) new PerformanceObserver(list => stats.longTasks.push(...list.getEntries().map(entry => entry.duration))).observe({ type: 'longtask' })
  })
  if (!touch) {
    await page.mouse.move(hit.x + hit.width * .6, hit.y + hit.height * .5)
    await button.waitFor({ state: 'visible' })
    await page.waitForFunction(() => document.querySelector('[data-testid="surface-plus"]').dataset.surfaceActive === 'false')
    await snapshot('hover')
  }
  const sampling = page.evaluate(async () => {
    const root = document.querySelector('[data-testid="surface-plus"] .fos-glass-material'), rows = [], start = performance.now()
    await new Promise(resolve => {
      const sample = stamp => {
        const value = getComputedStyle(root).transform
        rows.push({ stamp, scaleY: value === 'none' ? 1 : new DOMMatrixReadOnly(value).m22 })
        if (stamp - start < 1600) requestAnimationFrame(sample); else resolve()
      }
      requestAnimationFrame(sample)
    })
    return rows
  })
  const cdp = touch ? await context.newCDPSession(page) : null
  if (cdp) await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: hit.x + 22, y: hit.y + 22 }] })
  else await page.mouse.down()
  await page.waitForTimeout(650) // sample a real held input, not data-pressed alone
  await snapshot('pressed')
  if (cdp) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  else { await page.mouse.up(); await page.mouse.move(0, 0) }
  await page.waitForFunction(() => document.querySelector('[data-testid="surface-plus"]').dataset.surfaceActive === 'false')
  await snapshot('released')
  const samples = await sampling
  const before = await page.evaluate(() => window.__actionRaf.scheduled)
  await page.waitForTimeout(300)
  const metrics = await page.evaluate(before => ({ ...window.__actionStats, idleScheduled: window.__actionRaf.scheduled - before, idlePending: window.__actionRaf.pending.size }), before)
  const intervals = samples.slice(1).map((row, i) => row.stamp - samples[i].stamp).sort((a, b) => a - b)
  metrics.medianFrameMs = intervals[Math.floor(intervals.length / 2)]
  metrics.p95FrameMs = intervals[Math.floor(intervals.length * .95)]
  metrics.minScaleY = Math.min(...samples.map(row => row.scaleY))
  if (errors.length || metrics.idlePending || metrics.idleScheduled || metrics.mapMutations || metrics.layouts !== 1) throw new Error(JSON.stringify({ name, errors, metrics }))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await button.focus(); await page.keyboard.down(' '); await snapshot('reduced-pressed'); await page.keyboard.up(' ')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await button.evaluate(node => node.blur()) // next sample is hover, not lingering keyboard focus
  const secondary = page.getByTestId('surface-secondary')
  await secondary.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  const secondaryMaterial = secondary.locator('[data-fos-glass-material]')
  await snapshot('secondary-default', secondaryMaterial)
  await secondary.hover()
  await page.waitForFunction(() => document.querySelector('[data-testid="surface-secondary"]').dataset.surfaceActive === 'false')
  await snapshot('secondary-hover', secondaryMaterial)
  await secondary.focus(); await page.keyboard.down(' ')
  await page.waitForTimeout(650)
  await snapshot('secondary-pressed', secondaryMaterial)
  await page.keyboard.up(' '); await page.mouse.move(0, 0)
  await page.waitForFunction(() => document.querySelector('[data-testid="surface-secondary"]').dataset.surfaceActive === 'false')
  await snapshot('secondary-released', secondaryMaterial)
  if (!touch) {
    await page.goto(`${base}/?view=neutral-actions`)
    const current = page.getByTestId('neutral-paper').getByTestId('neutral-plus')
    await current.hover()
    await page.waitForFunction(() => document.querySelector('[data-testid="neutral-paper"] [data-testid="neutral-plus"]').dataset.surfaceActive === 'false')
    const shadow = await current.evaluate(node => getComputedStyle(node).boxShadow)
    if (shadow !== 'none') throw new Error(`Extra hover shadow: ${shadow}`)
    const filename = `${name}-current-plus-hover.png`
    await page.screenshot({ path: path.join(out, filename), fullPage: true })
    states.push({ label: 'current-plus-hover', filename, mode: await current.locator('[data-fos-glass-material]').getAttribute('data-optics-mode'), targetShadow: shadow })
    for (const role of ['header', 'primary', 'icon']) {
      const action = page.getByTestId('neutral-paper').getByTestId('neutral-' + role)
      const surface = action.locator(role === 'icon' ? '[data-action-content]' : '[data-action-surface]')
      await action.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0)
      await snapshot(role + '-default', surface)
      await action.hover()
      await page.waitForFunction(role => document.querySelector('[data-testid="neutral-paper"] [data-testid="neutral-' + role + '"]').dataset.surfaceActive === 'false', role)
      await snapshot(role + '-hover', surface)
      const hit = await (role === 'header' ? action.locator('.fos-ha__circle') : action).boundingBox()
      await page.mouse.move(hit.x + hit.width / 2, hit.y + hit.height / 2); await page.mouse.down()
      await page.waitForTimeout(250)
      await snapshot(role + '-pressed', surface)
      await page.mouse.up(); await page.mouse.move(0, 0)
      await page.waitForFunction(role => document.querySelector('[data-testid="neutral-paper"] [data-testid="neutral-' + role + '"]').dataset.surfaceActive === 'false', role)
      await snapshot(role + '-released', surface)
    }
  }
  const result = { name, engine, nativeUA: native, userAgent: await page.evaluate(() => navigator.userAgent), touch, zoom, states, metrics, samples, errors }
  await browser.close()
  return result
}
async function main() {
  fs.mkdirSync(out, { recursive: true })
  const source = Object.fromEntries(sources.map(file => [file, hash(file)]))
  const frozen = JSON.parse(fs.readFileSync('docs/FE11_MOTION_FROZEN_V0_2.json')).normalized_engine_sha256
  for (const [file, expected] of Object.entries(frozen)) if (hash(file).toUpperCase() !== expected) throw new Error(`Frozen changed: ${file}`)
  const cases = []
  for (const [engine, options] of [['chromium', {}], ['chromium', { native: true }], ['chromium', { zoom: true }], ['firefox', {}], ['webkit', {}], ['chromium', { touch: true }]]) cases.push(await capture(engine, options))
  const browser = await launch('chromium'), context = await browser.newContext(), page = await context.newPage()
  await page.goto(`${base}/?view=plus-motion`)
  const AxeBuilder = require('@axe-core/playwright').default
  const accessibility = await new AxeBuilder({ page }).analyze()
  const serious = accessibility.violations.filter(row => ['serious', 'critical'].includes(row.impact))
  if (serious.length) throw new Error(JSON.stringify(serious))
  const production = [], prod = process.env.PLUS_PRODUCTION_URL || 'http://127.0.0.1:5185'
  for (const query of ['?view=plus-motion', '?view=neutral-actions', '?view=client-orders', '?view=manager-orders']) {
    await page.goto(`${prod}/${query}`)
    const isOrder = /client-orders|manager-orders/.test(query)
    if (isOrder) await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    const labNodes = await page.locator('[data-testid="plus-motion-lab"], [data-testid="neutral-actions-lab"]').count()
    const unrooted = await page.locator('button:not([data-fos-button])').count()
    const neutralActions = await page.locator('button[data-fos-button="action"][data-action-palette="neutral"]').count()
    if (labNodes || unrooted || isOrder && neutralActions < 2) throw new Error(JSON.stringify({ query, labNodes, unrooted, neutralActions }))
    const filename = isOrder ? 'built-' + (query.includes('client') ? 'client' : 'manager') + '-new.png' : undefined
    if (filename) await page.screenshot({ path: path.join(out, filename), fullPage: true })
    production.push({ query, labNodes, unrooted, neutralActions, filename })
  }
  await browser.close()
  for (const [file, expected] of Object.entries(source)) if (hash(file) !== expected) throw new Error(`Source changed: ${file}`)
  fs.writeFileSync(path.join(out, 'observations.json'), JSON.stringify({ source, frozen, cases, production, accessibility: { violations: accessibility.violations.map(row => ({ id: row.id, impact: row.impact })), serious: serious.length } }, null, 2))
  fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><meta charset="utf-8"><title>Quiet Action preset · Owner OPEN</title><style>body{font:15px/1.5 system-ui;background:#f5f5f5;margin:24px;color:#222}img{max-width:100%;height:auto}details{margin-block:20px}</style><h1>Plus + Secondary + Header · единая ActionSurface</h1><p>Единое семейство в обеих ролях. Визуальная приёмка Owner OPEN. Стенд только DEV; обычный build использует общий preset. Без роликов.</p><p><a href="${base}/?view=plus-motion">Живой стенд 1:1</a> · <a href="${base}/?view=plus-motion&inspect=4">Живой DOM ×4</a>. Статичные PNG без resize. inspect4 явно использует CSS scale живого компонента.</p><p>${production.filter(row => row.filename).map(row => `<a href="${row.filename}">${row.query.includes('client') ? 'Client' : 'Manager'} · кадр сборки</a>`).join(' · ')}</p><p>native — Chromium с явным desktop-UA fixture: существующий GlassLens SVG filter. Обычный HeadlessChrome, Firefox и WebKit — frosted; исходный UA classifier не изменён. Long Tasks оцениваются только при longTaskSupported=true; frame timing относится к этой машине.</p>${cases.map(item => `<details open><summary>${item.name} · ${item.states[0].mode} · p95 ${item.metrics.p95FrameMs.toFixed(2)} ms · idle RAF ${item.metrics.idlePending}</summary>${item.states.map(state => `<figure><figcaption>${state.label} · ${state.mode}</figcaption><img loading="lazy" src="${state.filename}" alt="${item.name} ${state.label}"></figure>`).join('')}</details>`).join('')}`)
  console.log(JSON.stringify({ cases: cases.map(item => ({ name: item.name, mode: item.states[0].mode, metrics: item.metrics })), production, sourceCount: sources.length }, null, 2))
}
main().catch(async error => { console.error(error); await Promise.allSettled([...owned].map(browser => browser.close())); process.exitCode = 1 })
