import { expect, test } from '@playwright/test'

for (const role of ['manager', 'client']) {
  test(`accepted status placement reaches ordinary ${role} order details and drafts`, async ({ page }, info) => {
    for (const width of [2048, 1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 })
      for (const view of ['detail', 'draft']) {
        await page.goto(`/?view=${role}-orders`)
        if (view === 'detail') await page.locator(`[data-order-open="${role === 'manager' ? 'DEMO-002' : 'DEMO-003'}"]`).click()
        else await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
        await page.evaluate(() => document.fonts.ready)
        const root = page.getByTestId(view === 'detail' ? 'order-detail' : 'order-composer')
        const geometry = await root.evaluate(root => {
          const title = root.querySelector('h1')!.getBoundingClientRect()
          const status = root.querySelector('.fos-page-header__subtitle')!.getBoundingClientRect()
          const body = root.querySelector('.fos-order-detail__body, .fos-order-composer__body')!.getBoundingClientRect()
          return { gap: status.top - title.bottom, bodyY: body.top + scrollY, statusY: status.top + scrollY, overflow: document.documentElement.scrollWidth - innerWidth }
        })
        await page.screenshot({ path: info.outputPath(`${role}-${view}-${width}.png`), fullPage: true })
        await info.attach(`${role}-${view}-${width}`, { body: JSON.stringify(geometry), contentType: 'application/json' })
        expect(geometry.gap).toBe(8)
        expect(geometry.overflow).toBe(0)
        if (width >= 1024) {
          expect(geometry.statusY).toBe(108)
          expect(geometry.bodyY).toBe(view === 'draft' ? 151 : role === 'manager' ? 150 : 152)
        }
        await expect(root.locator('.fos-page-header__subtitle')).toHaveCSS('font-size', width >= 1024 ? '14px' : '12px')
      }
    }
  })
}

test('secondary subtitles retain their composition and long order titles do not overlap actions', async ({ page }) => {
  await page.goto('/?view=client-layouts')
  await page.getByTestId('layout-row-demo-layout-01').click()
  await expect(page.locator('.fos-page-header__text')).toHaveCount(0)
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 960 })
    await page.goto('/?view=manager-orders')
    await page.locator('[data-order-open="DEMO-002"]').click()
    await page.locator('.fos-page-header h1').evaluate(node => { node.textContent = 'Заказ с очень длинным идентификатором и названием для проверки переноса заголовка' })
    const layout = await page.locator('.fos-page-header').evaluate(root => {
      const title = root.querySelector('h1')!.getBoundingClientRect(), status = root.querySelector('.fos-page-header__subtitle')!.getBoundingClientRect()
      const actions = root.querySelector('.fos-page-header__actions')!.getBoundingClientRect()
      return { gap: status.top - title.bottom, intersects: title.right > actions.left && title.left < actions.right && title.bottom > actions.top && title.top < actions.bottom, overflow: document.documentElement.scrollWidth - innerWidth }
    })
    expect(layout.gap).toBe(8)
    expect(layout.intersects).toBe(false)
    expect(layout.overflow).toBe(0)
  }
})
