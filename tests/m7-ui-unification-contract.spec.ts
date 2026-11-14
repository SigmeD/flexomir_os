import { test, expect, type Page } from '@playwright/test'

const widths = [1440, 1024, 768, 390, 320]
const routes = ['client-orders', 'client-layouts', 'client-support']
test.use({ video: 'on' })

async function ready(page: Page) {
  await page.locator('h1:visible').waitFor()
  await page.evaluate(() => document.fonts.ready)
}

async function anchors(page: Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => {
      const node = Array.from(document.querySelectorAll<HTMLElement>(selector)).find(n => n.getClientRects().length)
      if (!node) return null
      const r = node.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    }
    const main = Array.from(document.querySelectorAll<HTMLElement>('main')).find(n => n.getClientRects().length)!
    return { h1: rect('h1'), header: rect('.fos-page-header'), actions: rect('.fos-page-header__actions'),
      breadcrumbs: rect('.fos-breadcrumbs'), sidebar: rect('.fos-app-shell__aside'),
      main: rect('.fos-orders-page__main'), padding: getComputedStyle(main).padding,
      scrollY, innerWidth, clientWidth: document.documentElement.clientWidth,
      dpr: devicePixelRatio, zoom: visualViewport?.scale, fontReady: document.fonts.check('16px Manrope') }
  })
}

async function section(page: Page, id: string) {
  if (page.viewportSize()!.width < 1024) {
    await page.getByTestId('navigation-drawer-trigger').filter({ visible: true }).click()
    await page.getByRole('dialog').getByTestId('sidebar-nav-' + id).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  } else await page.getByRole('navigation', { name: 'Навигация клиента' }).getByTestId('sidebar-nav-' + id).click()
  await ready(page)
}

for (const width of widths) {
  test(`company title uses Card role and preserves metadata and hit area ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/?view=manager-companies')
    await ready(page)
    const row = page.getByTestId('company-row-company-01')
    const title = row.locator('.fos-cabinet__row-copy > :first-child')
    const meta = row.locator('small')
    await info.attach('computed', { body: JSON.stringify(await title.evaluate(n => {
      const s = getComputedStyle(n); return { font: s.font, color: s.color, rect: n.getBoundingClientRect().toJSON() }
    })), contentType: 'application/json' })
    await page.screenshot({ path: info.outputPath(`companies-${width}.png`), fullPage: true })
    expect.soft(await title.evaluate(n => {
      const s = getComputedStyle(n); return [s.fontSize, s.lineHeight, s.fontWeight]
    })).toEqual(['16px', '22px', '600'])
    await expect(meta).toHaveCSS('font-size', '12px')
    await expect(meta).toHaveCSS('line-height', '18px')
    expect((await row.boundingBox())!.height).toBe(80)
    // A long fixture mutation tests presentation only, never product state or IDs.
    await title.evaluate(n => { n.textContent = 'Очень длинное название компании '.repeat(12) })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(title).toHaveCSS('text-overflow', 'ellipsis')
    await row.focus(); await page.keyboard.press('Enter')
    await expect(page.getByTestId('company-order-DEMO-003')).toBeVisible()
    await page.goBack(); await expect(row).toBeFocused()
  })

  test(`client list anchors share Orders geometry ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 })
    const samples = []
    for (const route of routes) {
      await page.goto('/?view=' + route); await ready(page)
      samples.push({ route, ...await anchors(page) })
      await page.screenshot({ path: info.outputPath(`${route}-${width}.png`), fullPage: true })
    }
    await info.attach('geometry', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' })
    for (const sample of samples.slice(1)) {
      for (const key of ['h1', 'actions', 'breadcrumbs', 'sidebar', 'main'] as const) {
        const actual = sample[key], baseline = samples[0][key]
        if (!actual || !baseline) { expect.soft(actual).toEqual(baseline); continue }
        for (const axis of ['x', 'y'] as const) expect.soft(Math.abs(actual[axis] - baseline[axis]), `${sample.route} ${key}.${axis}`).toBeLessThanOrEqual(1)
      }
    }
  })
}

for (const width of widths) test(`live section transitions keep anchors on every rendered frame and retain filter ${width}`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 })
  await page.goto('/?view=client-orders'); await ready(page)
  await page.getByTestId('glass-pill-done').click()
  // Collect all visible headers on each animation frame, including the first route commit.
  await page.evaluate(() => {
    const samples: { title: string; anchors: Record<string, { x: number; y: number }>; scroll: number }[] = []
    Object.assign(window, { unificationFrames: samples, stopUnificationFrames: false })
    const sample = () => {
      const h1 = Array.from(document.querySelectorAll('h1')).find(n => n.getClientRects().length)
      if (h1) {
        const anchors: Record<string, { x: number; y: number }> = {}
        for (const selector of ['h1', '.fos-page-header__actions', '.fos-breadcrumbs', '.fos-app-shell__aside']) {
          const n = Array.from(document.querySelectorAll(selector)).find(n => n.getClientRects().length)
          if (n) { const r = n.getBoundingClientRect(); anchors[selector] = { x: r.x, y: r.y } }
        }
        samples.push({ title: h1.textContent!, anchors, scroll: scrollY })
      }
      if (!(window as unknown as { stopUnificationFrames: boolean }).stopUnificationFrames) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  for (const id of ['artworks', 'support', 'orders', 'support', 'artworks', 'orders']) await section(page, id)
  const frames = await page.evaluate(() => {
    const w = window as unknown as { stopUnificationFrames: boolean; unificationFrames: { title: string; anchors: Record<string, { x: number; y: number }>; scroll: number }[] }
    w.stopUnificationFrames = true; return w.unificationFrames
  })
  await info.attach('frames', { body: JSON.stringify(frames), contentType: 'application/json' })
  expect(new Set(frames.map(f => f.title)).size).toBe(3)
  for (const key of Object.keys(frames[0].anchors)) {
    for (const axis of ['x', 'y'] as const) {
      const values = frames.map(f => f.anchors[key]?.[axis]).filter((v): v is number => v !== undefined)
      expect(Math.max(...values) - Math.min(...values), key + '.' + axis).toBeLessThanOrEqual(1)
    }
  }
  expect(frames.every(f => f.scroll === 0)).toBe(true)
  await expect(page.getByTestId('glass-pill-tabs').filter({ visible: true })).toBeVisible()
  await expect(page.getByTestId('glass-pill-done').filter({ visible: true })).toHaveAttribute('aria-pressed', 'true')
})

test('one type and color role propagates to row consumers without changing metadata or disabled actions', async ({ page }) => {
  const consumers = [
    ['manager-companies', '.fos-cabinet__row-copy > :first-child'],
    ['client-orders', '.fos-order-card__number'],
    ['client-layouts', '.fos-layout-row strong'],
    ['client-support', '.fos-support-row strong'],
    ['manager-support', '.fos-support-row strong'],
  ]
  for (const [route, selector] of consumers) {
    await page.goto('/?view=' + route); await ready(page)
    const title = page.locator(selector).first()
    const disabled = page.locator('.fos-more:disabled').first()
    const prior = await disabled.evaluate(n => ({ color: getComputedStyle(n).color, opacity: getComputedStyle(n).opacity }))
    const meta = page.locator('.fos-cabinet__row-copy > small, .fos-order-card__meta').first()
    const priorMeta = await meta.evaluate(n => getComputedStyle(n).color)
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--fos-type-row-title', '600 19px/26px var(--fos-font-family)')
      document.querySelector<HTMLElement>('.fos-orders-page')!.style.setProperty('--fos-color-row-title', 'rgb(20, 40, 60)')
    })
    await expect(title).toHaveCSS('font-size', '19px')
    await expect(title).toHaveCSS('line-height', '26px')
    expect.soft(await title.evaluate(n => getComputedStyle(n).color), route).toBe('rgb(20, 40, 60)')
    await expect(meta).toHaveCSS('font-size', '12px')
    await expect(meta).toHaveCSS('color', priorMeta)
    expect(await disabled.evaluate(n => ({ color: getComputedStyle(n).color, opacity: getComputedStyle(n).opacity }))).toEqual(prior)
    await page.evaluate(() => {
      document.documentElement.style.removeProperty('--fos-type-row-title')
      document.querySelector<HTMLElement>('.fos-orders-page')!.style.removeProperty('--fos-color-row-title')
    })
    await expect(title).toHaveCSS('font-size', '16px')
  }
})
