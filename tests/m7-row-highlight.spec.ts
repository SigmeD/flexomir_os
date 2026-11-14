import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

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
