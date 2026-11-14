import {test,expect,type Page} from '@playwright/test'
import {syntheticPdf} from './helpers/synthetic-pdf'
import {readFile} from 'node:fs/promises'

async function openPreview(page:Page,pilot:boolean,width:number) {
  await page.setViewportSize({width,height:1000})
  await page.goto(`/?view=client-orders&documentGlass=${pilot?'pilot':'original'}`)
  await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
  await page.getByLabel('Выбрать подписной бланк',{exact:true}).setInputFiles({name:'synthetic.csv',mimeType:'text/csv',buffer:Buffer.from('id,value\n1,synthetic\n')})
  const opener=page.getByRole('button',{name:/Открыть документ Файл synthetic/})
  await opener.click()
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready','true')
  return opener
}

test('glass comparison fixture keeps the shared signed-row typography behind the dialog',async({page})=>{
  await page.goto('/tests/fixtures/document-glass-pilot.html?documentGlass=pilot')
  await page.getByRole('button',{name:'Закрыть',exact:true}).click()
  const rows=page.locator('.fos-document-row')
  await expect(rows).toHaveCount(2)
  for(const row of await rows.all()){
    const badge=row.locator('.fos-artwork-thumbnail')
    await expect(badge).toHaveCSS('width','60px')
    await expect(badge).toHaveCSS('height','60px')
    await expect(badge).toHaveCSS('font-size','10px')
    await expect(row.locator('.fos-summary-row__title')).toHaveCSS('font-size','16px')
    await expect(row.locator('.fos-summary-row__meta')).toHaveCSS('line-height','18px')
  }
})

test('pilot adapter keeps document geometry and actions while expanding its clipped SVG region',async({page,browserName},info)=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  for(const width of [1440,768,390,320]){
    const samples=[]
    for(const pilot of [false,true]){
      const opener=await openPreview(page,pilot,width)
      const shell=page.locator('.fos-document-shell'),dialog=page.getByRole('dialog')
      await expect(dialog).toHaveAttribute('data-document-glass',pilot?'pilot':'original')
      await expect(shell.locator('.fos-glass-optics')).toHaveCount(1)
      samples.push(await shell.evaluate(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return {rect:r.toJSON(),strength:n.getAttribute('data-strength'),motion:n.getAttribute('data-motion'),rim:s.getPropertyValue('--fos-rim-width'),opacity:s.getPropertyValue('--fos-center-opacity'),content:n.querySelector('.fos-document-content')!.getBoundingClientRect().toJSON()}}))
      if(browserName==='chromium'){
        const filter=shell.locator('filter')
        if(pilot)expect(Number.parseFloat((await filter.getAttribute('x'))!)).toBeLessThan(0)
        else await expect(filter).toHaveAttribute('x','0')
      }else await expect(shell.locator('filter')).toHaveCount(0)
      const download=page.waitForEvent('download');await dialog.getByRole('link',{name:'Скачать',exact:true}).click()
      expect((await download).suggestedFilename()).toBe('synthetic.csv')
      await page.screenshot({path:info.outputPath(`${pilot?'pilot':'original'}-${width}.png`)})
      await page.keyboard.press('Escape');await expect(opener).toBeFocused()
    }
    expect(samples[1],`same geometry and optical props ${width}`).toEqual(samples[0])
  }
})

test('pilot keeps actual PDF rendering original bytes and modal actions on short mobile height',async({page})=>{
  await page.setViewportSize({width:320,height:390})
  await page.goto('/?view=client-orders&documentGlass=pilot')
  await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
  const bytes=syntheticPdf(2)
  await page.getByLabel('Выбрать подписной бланк',{exact:true}).setInputFiles({name:'pilot.pdf',mimeType:'application/pdf',buffer:bytes})
  const opener=page.getByRole('button',{name:/Открыть документ PDF pilot/})
  await opener.click()
  const dialog=page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('data-document-glass','pilot')
  await expect(dialog.locator('canvas')).toHaveCount(2)
  await expect(dialog.getByRole('button',{name:'Закрыть',exact:true})).toBeInViewport()
  await expect(dialog.getByRole('link',{name:'Скачать',exact:true})).toBeInViewport()
  const downloading=page.waitForEvent('download');await dialog.getByRole('link',{name:'Скачать',exact:true}).click()
  expect(await readFile((await (await downloading).path())!)).toEqual(bytes)
  await page.keyboard.press('Escape');await expect(opener).toBeFocused()
  await opener.click();await dialog.getByRole('button',{name:'Удалить документ',exact:true}).click()
  await expect(dialog).toHaveCount(0)
  await expect(page.locator('.fos-file-dropzone')).toBeVisible()
  await expect(page.getByRole('button',{name:'Добавить подписной бланк',exact:true})).toBeFocused()
})
