import { expect, test, type Locator, type Page } from '@playwright/test'
import { PNG } from 'pngjs'

async function open(page: Page) {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?view=plus-motion')
  await page.evaluate(() => document.fonts.ready)
  const button = page.getByTestId('surface-plus')
  // Remove native tooltip only in the optical measurement fixture.
  await button.evaluate(node => node.removeAttribute('title'))
  await expect(button.locator('.fos-glass-material')).toHaveAttribute('data-material-ready', 'true')
  return { button, material: button.locator('.fos-glass-material'), hit: (await button.boundingBox())! }
}

function rimDifference(a: Buffer, b: Buffer) {
  const left = PNG.sync.read(a), right = PNG.sync.read(b)
  let changed = 0
  for (let y = 0; y < left.height; y++) for (let x = 0; x < left.width; x++) {
    const distance = Math.hypot(x - left.width / 2, y - left.height / 2)
    if (distance < 13 || distance > 20) continue
    const offset = (y * left.width + x) * 4
    if ([0, 1, 2].some(channel => Math.abs(left.data[offset + channel] - right.data[offset + channel]) > 2)) changed++
  }
  return changed
}

async function scaleY(material: Locator) {
  return material.evaluate(node => {
    const value = getComputedStyle(node).transform
    return value === 'none' ? 1 : new DOMMatrixReadOnly(value).m22
  })
}

test('Plus pressure deforms actual material while its hit target stays fixed', async ({ page }) => {
  const { button, material, hit } = await open(page)
  await page.mouse.move(hit.x + 22, hit.y + 22)
  await page.mouse.down()
  await expect.poll(() => scaleY(material)).toBeLessThan(.985)
  expect(await button.boundingBox()).toEqual(hit)
  await expect(material).toHaveCSS('width', '34px')
  expect((await material.boundingBox())!.height).toBeLessThan(33.7)
  await page.mouse.up()
  expect(await scaleY(material)).toBeLessThan(.999)
  await page.mouse.move(0, 0)
  await expect.poll(async () => Math.abs(1 - await scaleY(material))).toBeLessThan(.001)
})

test('Quiet hover adds only slight scale and soft shadow without moving the target', async ({ page }, info) => {
  const { button, material, hit } = await open(page)
  const before = await page.screenshot({ clip: { x: hit.x - 2, y: hit.y - 2, width: 48, height: 48 } })
  await page.mouse.move(hit.x + 12, hit.y + 16)
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  const hoverScale = await scaleY(material)
  expect(hoverScale).toBeGreaterThan(1)
  expect(hoverScale).toBeLessThanOrEqual(1.02)
  const shadow = await material.evaluate(node => getComputedStyle(node).boxShadow)
  expect(shadow).not.toContain('inset')
  const hovered = await page.screenshot({ clip: { x: hit.x - 2, y: hit.y - 2, width: 48, height: 48 } })
  expect(rimDifference(before, hovered)).toBeGreaterThan(5)
  await page.mouse.move(hit.x + 32, hit.y + 28)
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  expect(await scaleY(material)).toBeCloseTo(hoverScale, 4)
  expect(await button.boundingBox()).toEqual(hit)
  await expect(button.locator('.fos-action__content')).toHaveCSS('transform', 'none')
  await info.attach('default', { body: before, contentType: 'image/png' })
  await info.attach('hover', { body: hovered, contentType: 'image/png' })
  const secondary = page.getByTestId('surface-secondary')
  await secondary.hover()
  await expect(secondary).toHaveAttribute('data-surface-active', 'false')
  expect(await scaleY(secondary.locator('[data-fos-glass-material]'))).toBeGreaterThan(1)
  expect(await scaleY(secondary.locator('[data-fos-glass-material]'))).toBeLessThanOrEqual(1.02)
})

test('Release has intermediate rendered deformation and settles; existing map/layout stay stable', async ({ page }, info) => {
  const { button, material, hit } = await open(page)
  await page.mouse.move(hit.x + 29, hit.y + 24)
  await page.evaluate(() => {
    const root = document.querySelector('[data-testid="surface-plus"] .fos-glass-material')!
    const stats = { layouts: 0, opticalMutations: 0, intervals: [] as number[], longTasks: [] as number[] }
    ;(window as any).__plusStats = stats
    new ResizeObserver(() => stats.layouts++).observe(root)
    new MutationObserver(records => stats.opticalMutations += records.length).observe(root.querySelector('.fos-glass-optics')!, { attributes: true, childList: true, subtree: true })
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) new PerformanceObserver(list => stats.longTasks.push(...list.getEntries().map(entry => entry.duration))).observe({ type: 'longtask' })
  })
  await page.mouse.down()
  await expect.poll(() => scaleY(material)).toBeLessThan(.975)
  const pressed = await page.screenshot({ clip: hit })
  await page.mouse.up()
  await page.mouse.move(0, 0)
  const samples = await material.evaluate(async node => {
    const values: number[] = [], times: number[] = []
    const start = performance.now()
    await new Promise<void>(resolve => {
      const sample = (stamp: number) => {
        const transform = getComputedStyle(node).transform
        values.push(transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).m22)
        times.push(stamp)
        if (stamp - start < 1000) requestAnimationFrame(sample); else resolve()
      }
      requestAnimationFrame(sample)
    })
    return { values, intervals: times.slice(1).map((time, i) => time - times[i]) }
  })
  expect(new Set(samples.values.map(value => value.toFixed(3))).size).toBeGreaterThan(5)
  await expect.poll(async () => Math.abs(1 - await scaleY(material))).toBeLessThan(.001)
  const released = await page.screenshot({ clip: hit })
  expect(rimDifference(pressed, released)).toBeGreaterThan(12)
  const stats = await page.evaluate(() => (window as any).__plusStats)
  expect(stats.layouts).toBe(1) // initial observation only; CSS transform never resizes the map
  expect(stats.opticalMutations).toBe(0)
  await info.attach('surface-samples', { body: JSON.stringify({ ...stats, ...samples }, null, 2), contentType: 'application/json' })
})

test('Quick tap and keyboard produce a surface impulse without hover', async ({ page, isMobile }) => {
  const { button, material, hit } = await open(page)
  if (isMobile) await page.touchscreen.tap(hit.x + 22, hit.y + 22)
  else { await button.focus(); await page.keyboard.press('Enter') }
  await expect(button).toHaveAttribute('data-pressed', 'false')
  await expect.poll(() => scaleY(material)).toBeLessThan(.988)
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  await button.focus()
  await page.keyboard.down(' ')
  await expect.poll(() => scaleY(material)).toBeLessThan(.97)
  await page.keyboard.up(' ')
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  await expect(page.getByRole('status')).toHaveText('Нажатий: 2')
})

test('Cancellation, focus loss, media change and disabled clear surface drivers', async ({ page }) => {
  const { button, material, hit } = await open(page)
  await button.focus()
  await page.keyboard.down(' ')
  await expect.poll(() => scaleY(material)).toBeLessThan(.98)
  await page.getByRole('link', { name: 'Оптический просмотр ×4', exact: true }).focus()
  await page.keyboard.up(' ')
  await expect.poll(() => scaleY(material)).toBe(1)
  await button.scrollIntoViewIfNeeded()
  const pointerHit = (await button.boundingBox())!
  await page.mouse.move(pointerHit.x + 22, pointerHit.y + 22)
  await button.evaluate(node => node.addEventListener('pointerdown', event => { (node as HTMLElement).dataset.testPointer = String((event as PointerEvent).pointerId) }, { once: true }))
  await page.mouse.down()
  await expect.poll(() => scaleY(material)).toBeLessThan(.98)
  await button.dispatchEvent('pointercancel', { pointerId: Number(await button.getAttribute('data-test-pointer')), pointerType: 'mouse' })
  await expect(button).toHaveAttribute('data-pressed', 'false')
  await expect.poll(() => scaleY(material)).toBe(1)
  await page.mouse.up()
  await button.focus()
  await page.keyboard.down(' ')
  await expect.poll(() => scaleY(material)).toBeLessThan(.98)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(() => scaleY(material)).toBe(1)
  await expect(button).toHaveAttribute('data-pressed', 'false')
  await page.keyboard.up(' ')
  await button.focus()
  await page.keyboard.down(' ')
  await expect(button).toHaveAttribute('data-pressed', 'true')
  expect(await scaleY(material)).toBe(1)
  await page.keyboard.up(' ')
  await page.getByRole('checkbox', { name: 'Disabled' }).check()
  await expect(button).toBeDisabled()
  await expect(button).toHaveAttribute('data-surface-active', 'false')
})

test('Reference stays explicit; default Client uses the unified surface', async ({ page }) => {
  const { button } = await open(page)
  await expect(button.locator('[data-fos-glass-material]')).toHaveCount(1)
  await expect(page.getByTestId('legacy-plus')).not.toHaveAttribute('data-surface-motion')
  await page.goto('/?view=neutral-actions')
  await expect(page.getByTestId('neutral-paper').getByTestId('neutral-header')).toHaveAttribute('data-surface-motion', 'pressure')
  await expect(page.locator('.fos-ha:not([data-action-palette])[data-surface-motion]')).toHaveCount(0)
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Добавить позицию', exact: true })).toHaveAttribute('data-surface-motion', 'pressure')
})

test('Neutral preset has one contour and one shadow, without the sidebar optical coat', async ({ page }) => {
  await page.goto('/?view=plus-motion')
  for (const id of ['surface-plus', 'surface-secondary']) {
    const button = page.getByTestId(id)
    const material = button.locator('[data-fos-glass-material]')
    await expect(material).toHaveAttribute('data-action-material', 'neutral-action')
    await expect(material).toHaveAttribute('data-lighting', 'native')
    await expect(button).toHaveCSS('border-top-width', '0px')
    await expect(button).toHaveCSS('box-shadow', 'none')
    await expect(material).toHaveCSS('border-top-width', '1px')
    const shadow = await material.evaluate(node => getComputedStyle(node).boxShadow)
    expect(shadow).not.toContain('inset')
    expect(shadow.split(/,(?![^()]*\))/)).toHaveLength(1)
    await expect(material.locator('.fos-glass-optics')).toHaveCSS('box-shadow', 'none')
    await expect(material.locator('.fos-glass-optics > div[aria-hidden]')).toHaveCSS('border-top-width', '0px')
  }
})

test('Native capture loss, window blur and forced colors leave no held surface', async ({ page }) => {
  const { button, material, hit } = await open(page)
  await button.evaluate(node => node.addEventListener('pointerdown', event => { (node as HTMLElement).dataset.testPointer = String((event as PointerEvent).pointerId) }, { once: true }))
  await page.mouse.move(hit.x + 22, hit.y + 22)
  await page.mouse.down()
  await page.mouse.move(hit.x + 23, hit.y + 22) // flush native gotpointercapture
  await expect.poll(() => scaleY(material)).toBeLessThan(.98)
  await button.evaluate(node => node.releasePointerCapture(Number((node as HTMLElement).dataset.testPointer)))
  await page.mouse.move(hit.x + 24, hit.y + 22) // deliver native lostpointercapture
  await expect(button).toHaveAttribute('data-pressed', 'false')
  await page.mouse.move(0, 0)
  await expect.poll(() => scaleY(material)).toBe(1)
  await page.mouse.up()
  await button.focus()
  await page.keyboard.down(' ')
  await expect.poll(() => scaleY(material)).toBeLessThan(.98)
  await page.evaluate(() => window.dispatchEvent(new Event('blur')))
  await expect(button).toHaveAttribute('data-pressed', 'false')
  await expect.poll(() => scaleY(material)).toBe(1)
  await page.keyboard.up(' ')
  await page.emulateMedia({ forcedColors: 'active' })
  await expect(material).toBeHidden()
  await expect(button).toHaveCSS('border-top-width', '1px')
  await expect(button).toHaveAttribute('data-surface-active', 'false')
})

test('Chromium desktop-UA fixture exercises the existing SVG refraction path', async ({ page, browser, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'Native refraction is Chromium-only; other engines use the existing fallback')
  const userAgent = (await page.evaluate(() => navigator.userAgent)).replace('HeadlessChrome/', 'Chrome/')
  const context = await browser.newContext({ viewport: { width: 1000, height: 800 }, userAgent, reducedMotion: 'no-preference' })
  try {
    const native = await context.newPage()
    const { button, material, hit } = await open(native)
    await expect(material).toHaveAttribute('data-optics-mode', 'refraction')
    await expect(material.locator('feDisplacementMap')).toHaveCount(1)
    await expect(material.locator('.fos-glass-optics')).toHaveCSS('backdrop-filter', /url\(/)
    await native.mouse.move(hit.x + 22, hit.y + 22)
    await native.mouse.down()
    await expect.poll(() => scaleY(material)).toBeLessThan(.98)
    await info.attach('native-refraction-pressed', { body: await native.screenshot(), contentType: 'image/png' })
    await native.mouse.up()
    await native.mouse.move(0, 0)
    await expect(button).toHaveAttribute('data-surface-active', 'false')
    await info.attach('native-refraction-fixture', { body: JSON.stringify({ userAgent, mode: 'refraction', reason: 'Existing UA predicate excludes HeadlessChrome; frozen primitive was not changed' }), contentType: 'application/json' })
  } finally { await context.close() }
})

test('Current neutral Plus hover has no second rim or shadow on the 44px target', async ({ page }) => {
  await page.goto('/?view=neutral-actions')
  const plus = page.getByTestId('neutral-paper').getByTestId('neutral-plus')
  await plus.hover()
  await expect(plus).toHaveCSS('box-shadow', 'none')
  await expect(plus).toHaveCSS('border-top-width', '0px')
  await expect(plus).toHaveCSS('outline-style', 'none')
  const material = plus.locator('[data-fos-glass-material]')
  await expect(material).toHaveAttribute('data-action-material', 'neutral-action')
  await expect(material).toHaveCSS('border-top-width', '1px')
})

test('Plus and Secondary share exactly the same hover geometry and content scale', async ({ page }) => {
  const { button: plus } = await open(page)
  const secondary = page.getByTestId('surface-secondary')
  async function hoverState(button: Locator) {
    await button.hover()
    await expect(button).toHaveAttribute('data-surface-active', 'false')
    return button.evaluate(node => {
      const matrix = (selector: string) => {
        const transform = getComputedStyle(node.querySelector(selector)!).transform
        const m = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform)
        return [m.m11, m.m22, m.m41, m.m42]
      }
      return { surface: matrix('.fos-glass-material'), content: matrix('.fos-action__motion'), shadow: getComputedStyle(node.querySelector('.fos-glass-material')!).boxShadow }
    })
  }
  const plusState = await hoverState(plus)
  const secondaryState = await hoverState(secondary)
  expect(plusState).toEqual(secondaryState)
  expect(plusState.surface[0]).toBeCloseTo(1.012, 4)
  expect(plusState.content[0]).toBeCloseTo(1.02, 4)
})


test('Manrope text Plus replaces both CSS strokes and keeps its centered box', async ({ page }, info) => {
  const { button, material, hit } = await open(page)
  const glyph = button.locator('.fos-section-add__glyph')
  await expect(glyph).toHaveText('+')
  await expect(glyph).toHaveCSS('font-size', '28px')
  await expect(glyph).toHaveCSS('font-weight', '500')
  expect(await glyph.evaluate(node => getComputedStyle(node).fontFamily)).toContain('Manrope')
  expect(await glyph.evaluate(node => [getComputedStyle(node, '::before').content, getComputedStyle(node, '::after').content])).toEqual(['none', 'none'])
  async function capture(state: string) {
    const box = (await glyph.boundingBox())!
    expect(Math.abs(box.x + box.width / 2 - hit.x - hit.width / 2)).toBeLessThan(1)
    expect(Math.abs(box.y + box.height / 2 - hit.y - hit.height / 2)).toBeLessThan(1)
    const bytes = await page.screenshot({ clip: hit })
    await info.attach(state, { body: bytes, contentType: 'image/png' })
    const png = PNG.sync.read(bytes)
    let mass = 0, weightedX = 0, weightedY = 0
    for (let y = 10; y < 34; y++) for (let x = 10; x < 34; x++) {
      const offset = (y * png.width + x) * 4
      const weight = Math.max(0, (190 - (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3) / 151)
      mass += weight; weightedX += (x + .5) * weight; weightedY += (y + .5) * weight
    }
    expect(mass).toBeGreaterThan(15)
    expect(Math.abs(weightedX / mass - 22)).toBeLessThan(1.25)
    expect(Math.abs(weightedY / mass - 22)).toBeLessThan(1.25)
  }
  await capture('default')
  await button.hover()
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  await capture('hover')
  await page.mouse.move(hit.x + 28, hit.y + 18); await page.mouse.down()
  await expect.poll(() => scaleY(material)).toBeLessThan(.98)
  await capture('pressed')
  await page.mouse.up(); await page.mouse.move(0, 0)
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  await capture('release')
})

test('Fast native clicks remain visible across the action family', async ({ page }, info) => {
  // The press envelope uses wall time, while the frozen spring caps each frame
  // at 32 ms. Test its amplitude at a fixed cadence, not CI/trace scheduling.
  await page.clock.install({ time: new Date('2026-11-11T12:00:00Z') })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?view=neutral-actions')
  await page.evaluate(() => document.fonts.ready)
  await page.clock.pauseAt(new Date('2026-11-11T13:00:00Z'))
  const paper = page.getByTestId('neutral-paper')
  const observations = []
  for (const [id, selector, surface] of [
    ['neutral-plus', '.fos-glass-material', true], ['neutral-secondary', '.fos-glass-material', true],
    ['neutral-header', '.fos-glass-material', true], ['neutral-primary', '.fos-action__solid', true],
    ['neutral-icon', '[data-action-content]', false],
    ['reference-header', '.fos-ha__glyph', false], ['reference-primary', '.fos-action__motion', false],
    ['reference-secondary', '.fos-action__motion', false], ['reference-plus', '.fos-section-add__glyph', false],
  ] as const) {
    const button = paper.getByTestId(id), target = button.locator(selector)
    const counter = paper.getByTestId(id.startsWith('neutral-') ? 'neutral-count' : 'reference-count')
    const previousCount = Number((await counter.innerText()).match(/\d+/)![0])
    const hit = (await button.boundingBox())!
    await page.mouse.move(hit.x + hit.width / 2, hit.y + hit.height / 2)
    await page.clock.runFor(1500)
    await expect(target).toBeVisible()
    if (await button.getAttribute('data-surface-motion') === 'pressure') await expect(button).toHaveAttribute('data-surface-active', 'false')
    const baseline = await scaleY(target)
    // Arm synchronously: no host-side actionability delay consumes the sample.
    await target.evaluate(node => {
      const button = node.closest('button')!
      const sample = { started: 0, released: 0, clicks: 0, rows: [] as { time: number; scale: number }[] }
      ;(window as any).__quickClickSample = sample
      button.addEventListener('click', () => sample.clicks++, { once: true })
      button.addEventListener('pointerup', () => { sample.released = performance.now() }, { once: true })
      button.addEventListener('pointerdown', () => {
        sample.started = performance.now()
        const frame = (stamp: number) => {
          const transform = getComputedStyle(node).transform
          sample.rows.push({ time: stamp - sample.started, scale: transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).m22 })
          if (stamp - sample.started < 500) requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
      }, { once: true })
    })
    // The unchanged hit target was checked above. Native mouse input avoids a
    // locator's stability wait needing animation frames while the clock pauses.
    await page.mouse.click(hit.x + hit.width / 2, hit.y + hit.height / 2, { delay: 0 })
    await page.clock.runFor(512)
    const sample = await page.evaluate(() => (window as any).__quickClickSample as { started: number; released: number; clicks: number; rows: { time: number; scale: number }[] })
    const { rows } = sample
    const minimum = Math.min(...rows.map(row => row.scale))
    observations.push({ id, baseline, minimum, ...sample })
    await info.attach(`quick-click-${id}`, { body: JSON.stringify(observations.at(-1)), contentType: 'application/json' })
    expect(sample.clicks, id).toBe(1)
    await expect(counter).toHaveText(`Нажатий: ${previousCount + 1}`)
    expect(sample.released - sample.started, id).toBe(0)
    expect(rows.length, id).toBeGreaterThanOrEqual(31)
    expect(baseline - minimum, id).toBeGreaterThan(surface ? .02 : .01)
  }
  await info.attach('quick-click-response', { body: JSON.stringify(observations), contentType: 'application/json' })
})

test('Header reuses Secondary material motion without moving its Save caption', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?view=neutral-actions')
  await page.evaluate(() => document.fonts.ready)
  const button = page.getByTestId('neutral-paper').getByTestId('neutral-header')
  const caption = button.locator('.fos-ha__caption'), circle = button.locator('.fos-ha__circle')
  const originalCaption = await caption.boundingBox(), originalStyle = await caption.evaluate(node => ({ font: getComputedStyle(node).font, transform: getComputedStyle(node).transform, color: getComputedStyle(node).color }))
  const captionPixels = await caption.screenshot()
  await expect(button).toHaveAttribute('data-surface-motion', 'pressure')
  const material = button.locator('[data-action-surface]')
  await expect(material).toHaveCount(1)
  await expect(button.locator('.fos-action__motion > .fos-action__content')).toHaveCount(1)
  await expect(button.locator('[data-action-content] .fos-ha__caption')).toHaveCount(0)
  await expect(material).toHaveCSS('border-radius', '24px')
  const treatment = (node: Element) => ({ border: getComputedStyle(node).border, background: getComputedStyle(node).backgroundColor, shadow: getComputedStyle(node).boxShadow, overflow: getComputedStyle(node).overflow, position: getComputedStyle(node).position, zIndex: getComputedStyle(node).zIndex, lighting: node.getAttribute('data-lighting'), strength: node.getAttribute('data-strength') })
  const secondaryMaterial = page.getByTestId('neutral-paper').getByTestId('neutral-secondary').locator('[data-action-surface]')
  expect(await material.evaluate(treatment)).toEqual(await secondaryMaterial.evaluate(treatment))
  const plusMaterial = page.getByTestId('neutral-paper').getByTestId('neutral-plus').locator('[data-action-surface]')
  expect(await material.evaluate(treatment)).toEqual(await plusMaterial.evaluate(treatment))
  await button.hover()
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  expect(await scaleY(material)).toBeCloseTo(1.012, 4)
  const hit = (await circle.boundingBox())!
  await page.mouse.move(hit.x + 24, hit.y + 24); await page.mouse.down()
  await expect.poll(() => scaleY(material)).toBeLessThan(.98)
  expect(await caption.boundingBox()).toEqual(originalCaption)
  expect(await caption.evaluate(node => ({ font: getComputedStyle(node).font, transform: getComputedStyle(node).transform, color: getComputedStyle(node).color }))).toEqual(originalStyle)
  const captionInk = (bytes: Buffer) => {
    const png = PNG.sync.read(bytes), ink: number[] = []
    for (let i = 0; i < png.data.length; i += 4) ink.push((png.data[i] + png.data[i + 1] + png.data[i + 2]) / 3 < 140 ? 1 : 0)
    return ink
  }
  // The circle's moving shadow changes the transparent background under the
  // caption. Compare the text foreground, not all background PNG bytes.
  const beforeInk = captionInk(captionPixels), pressedInk = captionInk(await caption.screenshot())
  const inkCount = beforeInk.reduce((sum, pixel) => sum + pixel, 0)
  expect(inkCount).toBeGreaterThan(20)
  expect(beforeInk.filter((pixel, i) => pixel !== pressedInk[i]).length / inkCount).toBeLessThan(.03)
  await page.mouse.up(); await page.mouse.move(0, 0)
  await expect(button).toHaveAttribute('data-surface-active', 'false')
  expect(await caption.boundingBox()).toEqual(originalCaption)
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
  await button.focus(); await page.keyboard.down(' ')
  await expect(material).toBeHidden()
  await expect(circle).toHaveCSS('border-top-width', '1px')
  await expect(circle).toHaveCSS('border-top-style', 'solid')
  await page.keyboard.up(' ')
})
