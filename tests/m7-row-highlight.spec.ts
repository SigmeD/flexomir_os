import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { chooseMore } from './helpers/orders'

const rows = [
  ['client-orders', '[data-order-open="DEMO-003"]'],
  ['manager-orders', '[data-order-open="DEMO-003"]'],
  ['manager-companies', '[data-testid="company-row-company-01"]'],
  ['client-layouts', '[data-testid="layout-row-demo-layout-01"]'],
  ['client-support', '[data-testid="ticket-row-client-01"]'],
  ['manager-support', '[data-testid="ticket-row-manager-01"]'],
  ['client-orders', '.fos-signed-documents li button', 'signed-documents'],
  ['manager-orders', '.fos-signed-documents li button', 'signed-documents'],
] as const

async function openRow(page: import('@playwright/test').Page, route:string, selector:string, scenario?:string) {
  await page.goto('/?view=' + route)
  if (scenario === 'signed-documents') {
    await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
    await page.getByLabel('Выбрать подписной бланк',{exact:true}).setInputFiles({name:'synthetic.csv',mimeType:'text/csv',buffer:Buffer.from('id,value\n1,synthetic\n')})
  }
  await page.evaluate(() => document.fonts.ready)
  return page.locator(selector).filter({visible:true}).first()
}

for (const width of [1440, 1024, 768, 390, 320]) test(`all row highlights match the Orders reference ${width}`, async ({ page }, info) => {
  await page.setViewportSize({ width, height:900 })
  const samples = []
  for (const [route, selector, scenario] of rows) {
    const row = await openRow(page,route,selector,scenario)
    await expect(row).toBeVisible()
    // Tab can scroll the page to the next control below a document row.
    // Compare layout in document coordinates, so scrolling is not a layout shift.
    const bounds = () => row.evaluate(n => { const r=n.getBoundingClientRect(); return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height} })
    const before = await bounds()
    const styles = () => row.evaluate(n => {
      const s=getComputedStyle(n)
      return { background:s.backgroundColor, border:s.borderColor, shadow:s.boxShadow, outline:s.outlineStyle }
    })
    await row.hover()
    const hover = await styles()
    await row.screenshot({ path:info.outputPath(`${route}-${scenario ?? 'list'}-${width}-hover.png`) })
    await page.mouse.down()
    const pressed = await styles()
    // Release outside the row so this presentation test never navigates.
    await page.mouse.move(0,0); await page.mouse.up()
    await row.focus()
    await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab')
    await expect(row).toBeFocused()
    const focused = await styles()
    expect(await bounds(), route + ' state must not shift bounds').toEqual(before)
    samples.push({ route, hover, pressed, focused })
    if (samples.length > 1) {
      expect.soft(hover, route + ' hover').toEqual(samples[0].hover)
      expect.soft(pressed, route + ' pressed').toEqual(samples[0].pressed)
      expect.soft(focused, route + ' focus').toEqual(samples[0].focused)
    }
  }
  await info.attach('computed-highlights', { body:JSON.stringify(samples,null,2), contentType:'application/json' })
})

test('one hover role reaches all consumers and excludes disabled/static rows', async ({ page }) => {
  for (const [route, selector, scenario] of rows) {
    const row = await openRow(page,route,selector,scenario)
    await page.evaluate(() => document.documentElement.style.setProperty('--fos-row-hover-background','rgb(230, 240, 250)'))
    await row.hover()
    expect.soft(await row.evaluate(n => getComputedStyle(n).backgroundColor), route).toBe('rgb(230, 240, 250)')
    await row.evaluate(n => { (n as HTMLButtonElement).disabled = true })
    await expect(row).toHaveCSS('box-shadow','none')
    await expect(row).toHaveCSS('background-color','rgb(255, 255, 255)')
    await page.evaluate(() => document.documentElement.style.removeProperty('--fos-row-hover-background'))
  }
  await page.goto('/tests/fixtures/summary-row.html')
  const row = page.locator('[data-summary-row="static"]')
  await row.hover()
  await expect(row).toHaveCSS('box-shadow','none')
})

test('highlight has no second surface-specific implementation', () => {
  const css=readFileSync('src/components/ui/fos-summary-row.css','utf8')
  expect(css).not.toMatch(/data-row-surface[^{}]*:(?:hover|active|focus-visible)/)
  expect(css).not.toContain('--fos-row-card-hover-')
})

test('editable order item uses the shared row interaction while retaining article semantics', async ({ page }) => {
  for (const role of ['client', 'manager']) {
    await page.goto(`/?view=${role}-orders&fixture=item-actions-review&demoTools=1`)
    await page.evaluate(() => document.fonts.ready)
    const reference = page.locator('[data-order-open="DEMO-003"]')
    await reference.hover()
    const expected = await reference.evaluate(node => {
      const css = getComputedStyle(node)
      return { background: css.backgroundColor, border: css.borderColor, shadow: css.boxShadow }
    })
    await page.getByRole('button', { name: 'Открыть заказ DEMO-REVIEW-001' }).click()
    await chooseMore(page, 'Изменить')
    const row = page.locator('.fos-order-item-row').first()
    const button = row.getByRole('button', { name: 'Изменить позицию 1' })
    await expect(row.locator('article.fos-order-item-summary h3')).toBeVisible()
    await expect(button).toBeVisible()
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await button.evaluate(node => (node as HTMLElement).blur())
      await button.hover()
      const actual = await row.evaluate(node => {
        const css = getComputedStyle(node)
        return { background: css.backgroundColor, border: css.borderColor, shadow: css.boxShadow }
      })
      expect(actual, `${role} ${width}px hover`).toEqual(expected)
      await page.mouse.down()
      await expect(row).toHaveCSS('background-color', 'rgb(235, 240, 247)')
      await page.mouse.move(0, 0)
      await page.mouse.up()
      await button.focus()
      await page.keyboard.press('Tab')
      await page.keyboard.press('Shift+Tab')
      await expect(button).toBeFocused()
      await expect(row).toHaveCSS('box-shadow', 'rgb(31, 56, 97) 0px 0px 0px 1px inset')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${role} ${width}px fits`).toBe(true)
    }
    await button.evaluate(node => (node as HTMLElement).blur())
    await page.evaluate(() => document.documentElement.style.setProperty('--fos-row-hover-background', 'rgb(230, 240, 250)'))
    await button.hover()
    await expect(row).toHaveCSS('background-color', 'rgb(230, 240, 250)')
    await button.evaluate(node => (node as HTMLButtonElement).disabled = true)
    await expect(row).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(row).toHaveCSS('box-shadow', 'none')
    await button.evaluate(node => (node as HTMLButtonElement).disabled = false)
    await page.evaluate(() => document.documentElement.style.removeProperty('--fos-row-hover-background'))
    await button.click()
    await expect(page.getByRole('heading', { level: 1, name: /позици/i })).toBeVisible()
  }
})

test('signed document typography follows the shared row title, metadata and badge roles', async ({ page }) => {
  for (const role of ['client','manager']) {
    await page.goto('/?view=' + role + '-orders')
    await page.evaluate(() => document.fonts.ready)
    const reference = await page.locator('[data-order-open="DEMO-003"]').evaluate(row => {
      const style = (selector:string) => getComputedStyle(row.querySelector(selector)!)
      return {
        title: style('.fos-summary-row__title').font,
        meta: style('.fos-summary-row__meta').font,
        badge: style('.fos-artwork-thumbnail').font,
      }
    })
    await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
    const name = 'signed-document-' + 'very-long-name-'.repeat(12) + '.csv'
    await page.getByLabel('Выбрать подписной бланк',{exact:true}).setInputFiles({name,mimeType:'text/csv',buffer:Buffer.from('id,value\n1,test\n')})
    const row = page.locator('.fos-signed-documents li button').first()
    await expect(row).toBeVisible()
    for(const width of [1440,1024,768,390,320]){
      await page.setViewportSize({width,height:900})
      const actual = await row.evaluate(node => {
        const title = node.querySelector('.fos-summary-row__title')
        const meta = node.querySelector('.fos-summary-row__meta')
        const badge = node.querySelector('.fos-artwork-thumbnail')
        const font = (element:Element|null) => element ? getComputedStyle(element).font : null
        return {title:font(title),meta:font(meta),badge:font(badge),titleFits:title ? title.scrollWidth <= title.clientWidth + 1 : false,pageFits:document.documentElement.scrollWidth <= innerWidth}
      })
      expect(actual,`${role} ${width}px`).toEqual({...reference,titleFits:true,pageFits:true})
    }
    await expect(row).toHaveAccessibleName(new RegExp(name.replaceAll('.','\\.')))
  }
})

test('order section headings use one responsive typography role', async ({ page }) => {
  for (const width of [1440,768,390]) {
    await page.setViewportSize({width,height:900})
    await page.goto('/?view=client-orders')
    await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
    const styles = await page.evaluate(() => [
      '.fos-order-composer__products .fos-order-composer__section-heading h2',
      '.fos-order-composer__general > h2',
      '.fos-signed-documents h2',
      '.fos-order-conversation h2',
    ].map(selector => getComputedStyle(document.querySelector(selector)!).font))
    expect(styles, `section headings at ${width}px`).toEqual(Array(4).fill(styles[0]))
  }

  const sharedRole = '600 19px/27px Manrope, sans-serif'
  await page.goto('/?view=client-orders')
  await page.locator('[data-order-open="DEMO-003"]').click()
  await page.evaluate(value => document.documentElement.style.setProperty('--fos-type-section-heading',value), sharedRole)
  for (const selector of ['.fos-order-detail__products > h2','.fos-order-detail__general > h2','.fos-signed-documents h2','.fos-order-conversation h2']) {
    await expect(page.locator(selector)).toHaveCSS('font-size','19px')
    await expect(page.locator(selector)).toHaveCSS('line-height','27px')
  }
  await page.goto('/?view=client-orders')
  await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
  await page.getByRole('button',{name:'Добавить позицию',exact:true}).click()
  await page.evaluate(value => document.documentElement.style.setProperty('--fos-type-section-heading',value), sharedRole)
  await expect(page.locator('.fos-artwork-source > h2')).toHaveCSS('font-size','19px')
  await expect(page.locator('.fos-artwork-source > h2')).toHaveCSS('line-height','27px')
})
