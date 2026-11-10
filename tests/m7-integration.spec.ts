import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { setDemoRole } from './helpers/orders'

async function section(page: Page, id: string) {
  if ((page.viewportSize()?.width ?? 1440) < 1024) {
    await page.getByTestId('navigation-drawer-trigger').filter({ visible: true }).click()
    await page.getByRole('dialog').getByTestId('sidebar-nav-' + id).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  } else await page.getByRole('navigation', { name: /Навигация (клиента|менеджера)/ }).getByTestId('sidebar-nav-' + id).click()
}

for (const width of [1440, 1024, 768, 390, 320]) test(`D cabinet navigation preserves own support and company context ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 960 })
  await page.goto('/?view=client-orders&demoTools=1')
  await section(page, 'support')
  await page.getByRole('button', { name: 'Добавить обращение', exact: true }).click()
  await page.getByLabel('Тема', { exact: true }).fill('Только клиентский автор')
  await page.getByLabel('Описание', { exact: true }).fill('Ввод сохраняется между разделами')
  await section(page, 'artworks')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Мои макеты')
  await section(page, 'support')
  await expect(page.getByLabel('Тема', { exact: true })).toHaveValue('Только клиентский автор')
  await page.getByRole('button', { name: 'Отправить обращение', exact: true }).click()
  await setDemoRole(page, 'manager')
  await section(page, 'support')
  await expect(page.getByText('Только клиентский автор', { exact: true }).filter({ visible: true })).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Мои обращения')
  await section(page, 'clients')
  await page.getByLabel('Поиск компании', { exact: true }).fill('Компания 01')
  await page.getByTestId('company-row-company-01').click()
  await section(page, 'orders')
  await section(page, 'clients')
  await expect(page.getByLabel('Компания', { exact: true })).toHaveValue('Компания 01')
  await page.goBack()
  await expect(page.getByLabel('Поиск компании', { exact: true })).toHaveValue('Компания 01')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('D touch/reduced-motion Drawer switch and no external product requests', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const requests: string[] = []
  page.on('request', request => { if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') requests.push(request.url()) })
  await page.goto('/?view=client-layouts')
  await page.getByTestId('layout-row-demo-layout-01').tap()
  await page.goBack()
  await page.getByTestId('navigation-drawer-trigger').tap()
  await page.getByRole('dialog').getByTestId('sidebar-nav-support').tap()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Мои обращения')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(requests).toEqual([])
  await context.close()
})
