import {test,expect,type Page} from '@playwright/test'
import {PNG} from 'pngjs'

type Rect={x:number;y:number;width:number;height:number}
function overlap(a:Rect,b:Rect):Rect {
  const x=Math.max(a.x,b.x),y=Math.max(a.y,b.y)
  return {x,y,width:Math.max(0,Math.min(a.x+a.width,b.x+b.width)-x),height:Math.max(0,Math.min(a.y+a.height,b.y+b.height)-y)}
}
function changedPixels(first:PNG,second:PNG,rect:Rect):number {
  let count=0
  for(let y=Math.ceil(rect.y);y<rect.y+rect.height;y++)for(let x=Math.ceil(rect.x);x<rect.x+rect.width;x++){
    const i=(y*first.width+x)*4
    const delta=Math.abs(first.data[i]-second.data[i])+Math.abs(first.data[i+1]-second.data[i+1])+Math.abs(first.data[i+2]-second.data[i+2])
    if(delta>3)count++
  }
  return count
}
async function openFixture(page:Page,pilot:boolean,width:number) {
  await page.setViewportSize({width,height:1000})
  await page.goto(`/tests/fixtures/document-glass-pilot.html?pattern=fields&documentGlass=${pilot?'pilot':'original'}`)
  await expect(page.getByRole('dialog')).toHaveAttribute('data-document-glass',pilot?'pilot':'original')
  await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready','true')
  await page.evaluate(()=>document.fonts.ready)
}

test('actual order field boundaries sit under the solid preview or outside the popup',async({page,browserName},info)=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  await page.setViewportSize({width:1440,height:1000})
  await page.goto('/?view=client-orders&documentGlass=pilot')
  await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
  await page.getByLabel('Выбрать подписной бланк',{exact:true}).setInputFiles({name:'synthetic.csv',mimeType:'text/csv',buffer:Buffer.from('a,b\n1,2\n')})
  await page.getByRole('button',{name:/Открыть документ Файл synthetic/}).click()
  const shell=(await page.locator('.fos-document-shell').boundingBox())!
  const viewport=(await page.locator('.fos-document-viewport').boundingBox())!
  const field=(await page.getByLabel('Согласованный срок',{exact:true}).first().boundingBox())!
  await expect(page.locator('.fos-document-viewport')).toHaveCSS('background-color','rgb(250, 251, 252)')
  expect(field.x).toBeGreaterThan(viewport.x)
  expect(field.x).toBeLessThan(viewport.x+viewport.width)
  expect(field.x+field.width).toBeGreaterThan(shell.x+shell.width)
  expect(overlap(field,{x:viewport.x+viewport.width,y:viewport.y,width:shell.x+shell.width-viewport.x-viewport.width,height:viewport.height}).width).toBeGreaterThan(0)
  await info.attach('real-order-geometry',{body:JSON.stringify({shell,viewport,field}),contentType:'application/json'})
})

test('real FOSInput pixels reach both glass edges while the solid viewport masks inner fields',async({page,browserName},info)=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  const results=[]
  for(const width of [1440,1024,768,390,320]){
    await openFixture(page,true,width)
    const shell=(await page.locator('.fos-document-shell').boundingBox())!
    const viewport=(await page.locator('.fos-document-viewport').boundingBox())!
    const left=(await page.locator('[data-dgp=edge-left]').boundingBox())!
    const right=(await page.locator('[data-dgp=edge-right]').boundingBox())!
    const inner=(await page.locator('[data-dgp=inner-left]').boundingBox())!
    const leftBand=overlap(left,{x:shell.x+2,y:viewport.y,width:viewport.x-shell.x-2,height:viewport.height})
    const rightBand=overlap(right,{x:viewport.x+viewport.width,y:viewport.y,width:shell.x+shell.width-viewport.x-viewport.width-2,height:viewport.height})
    expect(leftBand.width,`left border intersects glass at ${width}`).toBeGreaterThan(0)
    expect(rightBand.width,`right border intersects glass at ${width}`).toBeGreaterThan(0)
    expect(overlap(inner,viewport).width,`inner field lies under viewport at ${width}`).toBeGreaterThan(0)
    await page.locator('[data-dgp]').evaluateAll(nodes=>nodes.forEach(node=>{node.style.background='#164f82';node.style.border='3px solid #1c2630';node.style.color='#fff'}))
    const visible=PNG.sync.read(await page.screenshot({path:info.outputPath(`${browserName}-${width}-field-visible.png`)}))
    await page.locator('.dgp-probe').evaluateAll(nodes=>nodes.forEach(node=>node.style.visibility='hidden'))
    const hidden=PNG.sync.read(await page.screenshot())
    const leftChanged=changedPixels(visible,hidden,leftBand),rightChanged=changedPixels(visible,hidden,rightBand)
    const innerChanged=changedPixels(visible,hidden,overlap(inner,viewport))
    expect(leftChanged,`left actual input affects glass at ${width}`).toBeGreaterThan(10)
    expect(rightChanged,`right actual input affects glass at ${width}`).toBeGreaterThan(10)
    expect(Math.max(leftChanged,rightChanged)/Math.min(leftChanged,rightChanged),`comparable field visibility at ${width}`).toBeLessThan(1.5)
    expect(innerChanged,`opaque viewport masks input at ${width}`).toBe(0)
    results.push({width,leftChanged,rightChanged,innerChanged,bandWidths:[leftBand.width,rightBand.width]})
  }
  await info.attach('real-input-pixel-intersections',{body:JSON.stringify(results),contentType:'application/json'})
})

test('transparent viewport diagnostic exposes actual FOSInput underneath',async({page,browserName},info)=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  await openFixture(page,true,1440)
  const viewport=(await page.locator('.fos-document-viewport').boundingBox())!
  const inner=(await page.locator('[data-dgp=inner-left]').boundingBox())!
  const area=overlap(inner,viewport)
  const solid=PNG.sync.read(await page.screenshot())
  await page.locator('.dgp-probe').evaluateAll(nodes=>nodes.forEach(node=>node.style.visibility='hidden'))
  const solidHidden=PNG.sync.read(await page.screenshot())
  expect(changedPixels(solid,solidHidden,area)).toBe(0)
  await page.locator('.dgp-probe').evaluateAll(nodes=>nodes.forEach(node=>node.style.visibility=''))
  await page.locator('.fos-document-viewport').evaluate(node=>node.style.background='transparent')
  const clear=PNG.sync.read(await page.screenshot({path:info.outputPath(`${browserName}-viewport-diagnostic.png`)}))
  await page.locator('.dgp-probe').evaluateAll(nodes=>nodes.forEach(node=>node.style.visibility='hidden'))
  const clearHidden=PNG.sync.read(await page.screenshot())
  const changed=changedPixels(clear,clearHidden,area)
  expect(changed).toBeGreaterThan(100)
  await info.attach('viewport-diagnostic',{body:JSON.stringify({changed,area}),contentType:'application/json'})
})

test('actual FOSInput background border and corner pixels each reach the lens',async({page,browserName},info)=>{
  if(browserName==='chromium')await page.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  await openFixture(page,true,1440)
  const shell=(await page.locator('.fos-document-shell').boundingBox())!
  const viewport=(await page.locator('.fos-document-viewport').boundingBox())!
  const measurements=[]
  for(const side of ['left','right'] as const){
    const control=page.locator(`[data-dgp=edge-${side}]`)
    const field=(await control.boundingBox())!
    const band=overlap(field,side==='left'
      ?{x:shell.x+2,y:viewport.y,width:viewport.x-shell.x-2,height:viewport.height}
      :{x:viewport.x+viewport.width,y:viewport.y,width:shell.x+shell.width-viewport.x-viewport.width-2,height:viewport.height})
    await control.evaluate(node=>{node.style.background='#164f82';node.style.border='3px solid #1c2630';node.style.borderRadius='8px'})
    const base=PNG.sync.read(await page.screenshot())
    await control.evaluate(node=>node.style.background='#e66831')
    const background=PNG.sync.read(await page.screenshot())
    await control.evaluate(node=>node.style.background='#164f82')
    await control.evaluate(node=>node.style.borderColor='#f5d91b')
    const border=PNG.sync.read(await page.screenshot())
    await control.evaluate(node=>node.style.borderColor='#1c2630')
    await control.evaluate(node=>node.style.borderRadius='0')
    const square=PNG.sync.read(await page.screenshot())
    const corner=side==='left'
      ?{x:band.x,y:field.y,width:Math.min(12,band.width),height:12}
      :{x:Math.max(band.x,field.x+field.width-12),y:field.y,width:Math.min(12,band.width),height:12}
    const values={side,background:changedPixels(base,background,band),border:changedPixels(base,border,band),corner:changedPixels(base,square,corner)}
    measurements.push(values)
    expect(values.background,`${side} actual input background`).toBeGreaterThan(10)
    expect(values.border,`${side} actual input border`).toBeGreaterThan(10)
    expect(values.corner,`${side} actual input corner`).toBeGreaterThan(0)
    await control.evaluate(node=>{node.style.background='';node.style.border='';node.style.borderRadius=''})
  }
  await info.attach('actual-input-layer-contributions',{body:JSON.stringify(measurements),contentType:'application/json'})
})

test('200% layout zoom proxy keeps DocumentPreview actions and focus accessible',async({browser,browserName},info)=>{
  const context=await browser.newContext({viewport:{width:720,height:500},deviceScaleFactor:2})
  if(browserName==='chromium')await context.addInitScript(()=>Object.defineProperty(navigator,'userAgent',{value:navigator.userAgent.replace('HeadlessChrome','Chrome')}))
  const page=await context.newPage()
  try{
    await page.goto('/?view=client-orders&documentGlass=pilot')
    await page.getByRole('button',{name:'Добавить заказ',exact:true}).click()
    await page.getByLabel('Выбрать подписной бланк',{exact:true}).setInputFiles({name:'synthetic.csv',mimeType:'text/csv',buffer:Buffer.from('a,b\n1,2\n')})
    const opener=page.getByRole('button',{name:/Открыть документ Файл synthetic/})
    await opener.click()
    await expect(page.locator('.fos-document-shell')).toHaveAttribute('data-material-ready','true')
    const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,dialog:document.querySelector('.fos-document-dialog')!.getBoundingClientRect().toJSON()}))
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width)
    expect(geometry.dialog.left).toBeGreaterThanOrEqual(0)
    expect(geometry.dialog.right).toBeLessThanOrEqual(geometry.width)
    await expect(page.getByRole('button',{name:'Закрыть',exact:true})).toBeInViewport()
    await expect(page.getByRole('link',{name:'Скачать',exact:true})).toBeInViewport()
    await page.screenshot({path:info.outputPath(`${browserName}-zoom-proxy.png`)})
    await page.keyboard.press('Escape')
    await expect(opener).toBeFocused()
    await info.attach('zoom-proxy-geometry',{body:JSON.stringify(geometry),contentType:'application/json'})
  }finally{await context.close()}
})
