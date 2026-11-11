const fs = require('node:fs')
const crypto = require('node:crypto')
const { chromium, expect } = require('@playwright/test')

const output = process.env.FOS_REVIEW_OUTPUT || 'output/playwright/accepted-rollout/artwork-review'
const base = process.env.FOS_REVIEW_URL || 'http://127.0.0.1:5173'
const pilot = '/?view=client-orders'
const rows = [], errors = []
fs.mkdirSync(output, { recursive: true })
const artwork = page => page.locator('.fos-artwork-source')

async function newItem(page, url) {
  await page.goto(base + url)
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await page.evaluate(() => document.fonts.ready)
}

async function capture(page, width, state) {
  const source = artwork(page)
  await source.evaluate(node => node.scrollIntoView({ block: 'center' }))
  await page.mouse.move(0, 0)
  for (const action of await source.locator('[data-surface-motion="pressure"]').all()) {
    await expect(action).toHaveAttribute('data-surface-active', 'false')
  }
  const geometry = await source.evaluate(root => {
    const rect = node => { if (!node) return null; const box = node.getBoundingClientRect(); return { x: box.x, y: box.y + scrollY, width: box.width, height: box.height } }
    const panel = root.querySelector('.fos-artwork-source__dropzone')
    const action = panel?.querySelector('button')
    const icon = action?.querySelector('img')
    const text = panel?.querySelector('p')
    return {
      state: root.getAttribute('data-artwork-state'), source: rect(root), panel: rect(panel), action: rect(action),
      options: rect(root.querySelector('.fos-artwork-source__options')), note: rect(document.querySelector('.fos-item-form__note')),
      message: text?.textContent, font: text ? getComputedStyle(text).font : null,
      icon: icon ? { width: icon.getBoundingClientRect().width, height: icon.getBoundingClientRect().height, loaded: icon.complete && icon.naturalWidth > 0 } : null,
      overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    }
  })
  if (geometry.overflow) throw Error(`Overflow ${width}/${state}`)
  if (geometry.icon && (!geometry.icon.loaded || geometry.icon.width !== 20 || geometry.icon.height !== 20)) throw Error(`Upload asset mismatch ${width}/${state}`)
  const file = `${width}-${state}`
  await page.screenshot({ path: `${output}/${file}-viewport.png` })
  await source.screenshot({ path: `${output}/${file}-component.png` })
  rows.push({ width, ...geometry, state, file })
  return geometry
}

async function main() {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
    page.on('pageerror', error => errors.push(String(error)))
    if (process.argv.includes('--production')) {
      for (const role of ['client', 'manager']) for (const formerFlag of [false, true]) {
        const url = `/?view=${role}-orders${formerFlag ? '&artworkStates=pilot' : ''}`
        await newItem(page, url)
        await artwork(page).getByRole('button', { name: 'Мои макеты', exact: true }).click()
        await page.getByTestId('layout-row-demo-layout-01').click()
        await page.getByRole('button', { name: 'Выбрать макет', exact: true }).click()
        await expect(artwork(page)).toHaveAttribute('data-artwork-presentation', 'states')
        await expect(artwork(page).getByRole('button', { name: 'Заменить макет', exact: true })).toBeVisible()
        await expect(artwork(page)).toContainText('Выбран из библиотеки: Этикетка 100×150')
        await page.goto(base + url)
        await page.locator(`[data-order-open="${role === 'manager' ? 'DEMO-002' : 'DEMO-003'}"]`).click()
        const gap = await page.locator('.fos-page-header').evaluate(root => root.querySelector('.fos-page-header__subtitle').getBoundingClientRect().top - root.querySelector('h1').getBoundingClientRect().bottom)
        expect(gap).toBe(8)
        await page.screenshot({ path: `${output}/production-${role}-${formerFlag ? 'former-flag' : 'ordinary'}.png`, fullPage: true })
        rows.push({ role, formerFlag, acceptedSource: true, statusGap: gap })
      }
      if (errors.length) throw Error(errors.join('\n'))
      fs.writeFileSync(`${output}/production.json`, JSON.stringify({ rows, errors }, null, 2))
      console.log(JSON.stringify({ productionRoutes: rows.length, acceptedSource: true, pageErrors: errors.length }))
      return
    }
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 })
      await newItem(page, '/?view=client-orders')
      const baseline = await capture(page, width, 'ordinary-empty-pass1')
      await newItem(page, pilot)
      const empty = await capture(page, width, 'empty')
      for (const field of ['source', 'panel', 'action', 'options', 'note']) {
        expect(empty[field], `${width} empty ${field}`).toEqual(baseline[field])
      }
      await page.getByLabel('Выбрать файл макета', { exact: true }).setInputFiles({ name: 'Синтетический_макет_для_проверки_длинного_названия.pdf', mimeType: 'application/pdf', buffer: Buffer.from('synthetic only') })
      await capture(page, width, 'local')
      await artwork(page).getByRole('button', { name: 'Мои макеты', exact: true }).click()
      await page.getByTestId('layout-row-demo-layout-01').click()
      await page.getByRole('button', { name: 'Выбрать макет', exact: true }).click()
      await expect(artwork(page)).toHaveAttribute('data-artwork-state', 'library')
      await capture(page, width, 'library')
      await page.getByLabel('Нужна помощь с макетом', { exact: true }).check()
      await capture(page, width, 'help')
      await page.goto(base + pilot)
      await page.locator('[data-order-open="DEMO-007"]').click()
      await page.getByRole('button', { name: 'Ещё', exact: true }).click()
      await page.getByRole('menuitem', { name: 'Дублировать заказ', exact: true }).click()
      await page.getByRole('button', { name: 'Изменить позицию 1' }).click()
      await page.evaluate(() => document.fonts.ready)
      await capture(page, width, 'unavailable')
    }
    if (errors.length) throw Error(errors.join('\n'))
    const sources = ['src/components/orders/ArtworkSource.tsx', 'src/components/orders/OrderItemForm.tsx', 'src/components/orders/OrderComposer.tsx']
    const hashes = Object.fromEntries(sources.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex')]))
    fs.writeFileSync(`${output}/observations.json`, JSON.stringify({ rows, errors, hashes }, null, 2))
    const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
    const sections = [1440, 1024, 768, 390, 320].map(width => `<section><h2>${width}px</h2><div class="grid">${rows.filter(row => row.width === width).map(row => `<figure><figcaption>${escape(row.state)}</figcaption><a href="${row.file}-viewport.png"><img src="${row.file}-component.png" alt="${escape(row.state)} · ${width}px"></a><a href="${row.file}-viewport.png">Контекст экрана</a></figure>`).join('')}</div></section>`).join('')
    fs.writeFileSync(`${output}/index.html`, `<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FOS12 — принятые состояния макета</title><style>body{font:15px/1.5 system-ui;margin:24px;color:#1f2228}h1{font-size:28px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}figure{margin:0;padding:12px;border:1px solid #d6d9e0}figcaption{font-weight:600;margin-bottom:12px}img{display:block;max-width:100%;height:auto}a{color:#1f3861}section{margin-top:32px}</style><h1>FOS12 — состояния макета позиции</h1><p>Принятые состояния подключены на обычных экранах Client и Manager. Raw PNG не изменены; ссылка под каждым кадром открывает контекст экрана с намеренным положением прокрутки.</p><p><a href="https://www.figma.com/design/7rvIYc6yj3OA7gxmf1xJbv/flexomir-OS?node-id=634-445">CURRENT Figma master634:445 — empty</a> · <a href="observations.json">Геометрия и SHA-256</a> · <a href="${base}${pilot}">Открыть обычный экран</a></p>${sections}</html>`)
    console.log(JSON.stringify({ captures: rows.length * 2, pageErrors: errors.length, overflow: 0, repeatGeometryMatches: 5, gallery: `${output}/index.html` }))
  } finally { await browser.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
