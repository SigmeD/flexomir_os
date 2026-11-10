/* Read-only browser evidence for the FOS03 opt-in reference; no product fixtures added. */
const { chromium } = require('@playwright/test')
const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const { execFileSync } = require('node:child_process')

const output = path.resolve('output/playwright/fos03')
const baseURL = process.env.FOS03_BASE_URL || 'http://127.0.0.1:5173'
const productionURL = process.env.FOS03_PRODUCTION_URL
const widths = [1440, 1024, 768, 390, 320]
const captureWidths = process.env.FOS03_CAPTURE_WIDTH ? [Number(process.env.FOS03_CAPTURE_WIDTH)] : widths
const fail = message => { throw new Error(message) }
const sha256 = value => createHash('sha256').update(value).digest('hex')

async function choose(page, label, option) {
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
  await page.getByRole('listbox').waitFor({ state: 'detached' })
}

async function addItem(page, number) {
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await page.getByLabel('Наименование продукции', { exact: true }).fill('Продукция DEMO ' + number)
  await page.getByLabel('Количество', { exact: true }).fill('500')
  await page.getByLabel('Флексопечать', { exact: true }).check()
  await choose(page, 'Форма', 'Прямоугольная')
  await page.getByLabel('Ширина, мм', { exact: true }).fill('100')
  await page.getByLabel('Высота, мм', { exact: true }).fill('150')
  await choose(page, 'Материал', 'Бумага')
  await page.getByLabel('Нужна помощь с макетом', { exact: true }).check()
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await page.getByTestId('order-item-form').waitFor({ state: 'detached' })
}

async function metrics(page) {
  return page.getByTestId('order-composer').evaluate(root => {
    const box = selector => root.querySelector(selector).getBoundingClientRect()
    const company = box('.fos-order-composer__company'), products = box('.fos-order-composer__products')
    const general = box('.fos-order-composer__general'), title = box('.fos-order-composer__general > h2')
    const dates = box('.fos-order-composer__dates'), note = box('.fos-order-composer__general > .fos-field')
    return { companyGap: products.y-company.bottom, sectionGap:general.y-products.bottom,
      headingGap:dates.y-title.bottom, noteGap:note.y-dates.bottom, commentBottom:note.bottom,
      dateHeight: root.querySelector('input[type=date]').getBoundingClientRect().height,
      dateWidth: root.querySelector('input[type=date]').getBoundingClientRect().width,
      overflow: document.documentElement.scrollWidth-innerWidth, pilot:root.dataset.composeSpacing??null }
  })
}

function gallery(rows) {
  const cards = widths.map(width => [0,1,2].map(count => {
    const before = rows.find(row=>row.width===width&&row.count===count&&row.mode==='baseline')
    const after = rows.find(row=>row.width===width&&row.count===count&&row.mode==='pilot')
    const ref = width===1440?'reference/manager-d.png':width===768?'reference/manager-t.png':width===390?'reference/manager-m.png':null
    return `<section><h2>${width}px · ${count} позиций</h2><p>Промежутки Company / General / heading / comment: ${before.companyGap}/${before.sectionGap}/${before.headingGap}/${before.noteGap} → ${after.companyGap}/${after.sectionGap}/${after.headingGap}/${after.noteGap}px</p><div class="columns"><figure><figcaption>Текущий React</figcaption><img loading="lazy" src="${before.file}" alt="Текущая композиция ${width}px, ${count} позиций"></figure><figure><figcaption>DEV pilot · OWNER OPEN</figcaption><img loading="lazy" src="${after.file}" alt="Пилот композиции ${width}px, ${count} позиций"></figure>${ref&&count===0?`<figure><figcaption>Figma CURRENT · export с внешними полями, без resize</figcaption><img loading="lazy" src="${ref}" alt="Figma Manager New"></figure>`:''}</div></section>`
  }).join('')).join('')
  return `<!doctype html><html lang="ru"><meta charset="utf-8"><title>FOS03 — сравнение композиции</title><style>body{font:16px/1.5 system-ui;margin:24px;color:#20252c;background:#f4f5f7}h1{font-size:26px}.columns{display:flex;gap:20px;overflow:auto;align-items:flex-start}figure{margin:0;flex:none}figcaption{margin-bottom:8px;font-weight:600}img{display:block;max-width:none}section{padding:20px;margin:24px 0;background:white;border:1px solid #d6d9e0}nav a{margin-right:16px}</style><h1>FOS03 — Manager New Order</h1><p>Один opt-in reference. Owner visual acceptance OPEN. Figma содержит другие утверждённые/открытые состояния: agreed date и публикация здесь не добавлены. Исходные PNG показаны в собственных размерах; горизонтальная прокрутка сравнения не относится к приложению.</p><nav><a href="${baseURL}/?view=manager-orders&amp;composeSpacing=pilot">Открыть пилот · нажать «Добавить заказ»</a><a href="${baseURL}/?view=manager-orders">Текущая композиция</a><a href="observations.json">Измерения и source hashes</a></nav>${cards}</html>`
}

async function main() {
  fs.mkdirSync(path.join(output,'captures'),{recursive:true})
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport:{width:1440,height:960} })
  const errors = [], rows = []
  let currentCapture = null
  page.on('pageerror', error=>errors.push(error.message))
  await page.context().tracing.start({ screenshots: true, snapshots: true })
  try {
    for(const width of captureWidths) for(const mode of ['baseline','pilot']) {
      await page.setViewportSize({width,height:960})
      await page.goto(`${baseURL}/?view=manager-orders${mode==='pilot'?'&composeSpacing=pilot':''}`)
      await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
      await page.evaluate(()=>document.fonts.ready)
      for(const count of [0,1,2]) {
        currentCapture = { width, mode, count }
        if(count===1)await choose(page,'Компания','Компания 01')
        if(count>0)await addItem(page,count)
        await page.evaluate(()=>window.scrollTo(0,0))
        const file=`captures/${mode}-${width}-${count}.png`
        const measured=await metrics(page)
        if(measured.overflow!==0)fail('Horizontal overflow '+JSON.stringify({width,mode,count,measured}))
        await page.screenshot({path:path.join(output,file),fullPage:true})
        rows.push({width,mode,count,file,...measured})
      }
    }
    let production = {status:'NOT RUN',reason:'Set FOS03_PRODUCTION_URL to a running built preview.'}
    if(productionURL) {
      await page.goto(productionURL+'/?view=manager-orders&composeSpacing=pilot')
      await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
      const measured=await metrics(page)
      if(measured.pilot!==null||measured.companyGap!==0)fail('Production must not enable Owner-open pilot: '+JSON.stringify(measured))
      production={status:'PASS',url:productionURL,...measured}
    }
    if(errors.length)fail('Browser errors '+JSON.stringify(errors))
    const sourceFiles=['src/components/orders/OrderComposer.tsx','src/components/orders/order-compose.css','src/components/orders/order-date-fields.css']
    const sourceHashes=Object.fromEntries(sourceFiles.map(file=>[file,sha256(fs.readFileSync(file,'utf8').replaceAll('\r\n','\n'))]))
    const result={headAtCapture:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceHashes,rows,production,errors}
    fs.writeFileSync(path.join(output,'observations.json'),JSON.stringify(result,null,2))
    if(captureWidths.length===widths.length)fs.writeFileSync(path.join(output,'index.html'),gallery(rows))
    await page.context().tracing.stop()
    console.log(JSON.stringify({screenshots:rows.length,production,errors,sourceHashes}))
  } catch(error) {
    await page.screenshot({path:path.join(output,'capture-error.png'),fullPage:true})
    fs.writeFileSync(path.join(output,'capture-error.json'),JSON.stringify({currentCapture,url:page.url(),text:await page.locator('body').innerText(),error:String(error)},null,2))
    await page.context().tracing.stop({path:path.join(output,'capture-error-trace.zip')})
    throw error
  } finally { await browser.close() }
}
main().catch(error=>{console.error(error.stack);process.exitCode=1})
