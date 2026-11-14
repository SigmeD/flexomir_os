import {test,expect,type Page} from '@playwright/test'
import {PNG} from 'pngjs'
import {readFile} from 'node:fs/promises'
import {syntheticPdf} from './helpers/synthetic-pdf'

async function openOrderPreview(page:Page,kind:'csv'|'pdf',version:'pilot'|'latest'='latest',extraQuery='') {
  await page.goto(`/?view=client-orders&documentGlass=${version}${extraQuery}`)
  await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
  const bytes=kind==='pdf'?syntheticPdf(2):Buffer.from('a,b\n1,2\n')
  await page.getByLabel('Выбрать подписной бланк',{exact:true}).setInputFiles({name:kind==='pdf'?'pilot.pdf':'synthetic.csv',mimeType:kind==='pdf'?'application/pdf':'text/csv',buffer:bytes})
  const opener=page.getByRole('button',{name:kind==='pdf'?/Открыть документ PDF pilot/:/Открыть документ Файл synthetic/})
  await opener.click()
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready','true')
  if(kind==='pdf')await expect(page.locator('.fos-document-viewport canvas')).toHaveCount(2)
  await page.evaluate(()=>document.fonts.ready)
  return {bytes,opener}
}

function changedPixels(a:PNG,b:PNG,box:{x:number;y:number;width:number;height:number}) {
  let changed=0
  for(let y=Math.floor(box.y);y<box.y+box.height;y++)for(let x=Math.floor(box.x);x<box.x+box.width;x++){
    const i=(y*a.width+x)*4
    if(Math.abs(a.data[i]-b.data[i])+Math.abs(a.data[i+1]-b.data[i+1])+Math.abs(a.data[i+2]-b.data[i+2])>3)changed++
  }
  return changed
}

test('retired panel parameters do not create extra DEV variants',async({page,browserName})=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  await page.setViewportSize({width:1440,height:1000})
  for(const version of ['pilot','latest'] as const){
    await openOrderPreview(page,'csv',version,'&documentPanel=60&documentOptics=fill')
    const dialog=page.getByRole('dialog')
    await expect(dialog).toHaveAttribute('data-document-glass',version)
    await expect(dialog).not.toHaveAttribute('data-document-panel',/.+/)
    await expect(dialog.locator('.fos-document-viewport')).toHaveCSS('opacity','1')
    await dialog.getByRole('button',{name:'Закрыть',exact:true}).click()
  }
})

test('candidate preserves opaque PDF pages, actions and focus on a short mobile viewport',async({page,browserName},info)=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  await page.setViewportSize({width:320,height:390})
  const {bytes,opener}=await openOrderPreview(page,'pdf','latest')
  const dialog=page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('data-document-glass','latest')
  const canvas=dialog.locator('.fos-document-viewport canvas').first()
  await expect(canvas).toHaveCSS('background-color','rgb(255, 255, 255)')
  await expect(canvas).toHaveCSS('opacity','1')
  const pixel=await canvas.evaluate(node=>[...node.getContext('2d')!.getImageData(200,200,1,1).data])
  expect(pixel[3]).toBe(255)
  await expect(dialog.getByRole('button',{name:'Закрыть',exact:true})).toBeInViewport()
  await expect(dialog.getByRole('link',{name:'Скачать',exact:true})).toBeInViewport()
  await page.screenshot({path:info.outputPath(`candidate-pdf-mobile-${browserName}.png`)})
  const downloading=page.waitForEvent('download')
  await dialog.getByRole('link',{name:'Скачать',exact:true}).click()
  expect(await readFile((await (await downloading).path())!)).toEqual(bytes)
  await page.keyboard.press('Escape')
  await expect(opener).toBeFocused()
})

test('opaque PDF page still masks the real date border directly beneath it',async({page,browserName},info)=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  await page.setViewportSize({width:1440,height:1000})
  await openOrderPreview(page,'pdf','latest')
  const pageBox=(await page.locator('.fos-document-viewport canvas').first().boundingBox())!
  const field=page.getByLabel('Согласованный срок',{exact:true}).first()
  const fieldBox=(await field.boundingBox())!
  const leftBorder={x:fieldBox.x-5,y:fieldBox.y-5,width:25,height:fieldBox.height+10}
  expect(pageBox.x).toBeLessThan(leftBorder.x)
  expect(pageBox.x+pageBox.width).toBeGreaterThan(leftBorder.x+leftBorder.width)
  expect(pageBox.y).toBeLessThan(leftBorder.y)
  expect(pageBox.y+pageBox.height).toBeGreaterThan(leftBorder.y+leftBorder.height)
  const visible=PNG.sync.read(await page.screenshot({path:info.outputPath('opaque-pdf-over-real-field.png')}))
  await field.evaluate(n=>n.style.visibility='hidden')
  const hidden=PNG.sync.read(await page.screenshot())
  expect(changedPixels(visible,hidden,leftBorder)).toBe(0)
  await info.attach('page-field-overlap',{body:JSON.stringify({pageBox,fieldBox,leftBorder}),contentType:'application/json'})
})
