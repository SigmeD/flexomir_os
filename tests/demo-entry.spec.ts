import { expect, test } from '@playwright/test'

test('root opens the real Client My Orders cabinet with no technical lab', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('client-orders-screen')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Мои заказы' })).toBeVisible()
  await expect(page.locator('.filter-card')).toHaveCount(0)
  await expect(page.getByTestId('demo-presentation-controls')).toBeVisible()
  await expect(page.getByTestId('demo-technical-controls')).toHaveCount(0)
})

test('unknown view safely opens Client and explains the fallback', async ({ page }) => {
  await page.goto('/?view=not-a-real-screen')

  await expect(page.getByTestId('client-orders-screen')).toBeVisible()
  await expect(page.getByTestId('demo-route-diagnostic')).toContainText('not-a-real-screen')
  await expect(page.locator('.filter-card')).toHaveCount(0)
})

test('legacy GlassFilterDemo is available only through its explicit technical route', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  await expect(page.locator('.filter-card')).toBeVisible()
  await expect(page.getByTestId('demo-presentation-controls')).toHaveCount(0)
  await expect(page.getByTestId('client-orders-screen')).toHaveCount(0)
})

test('direct cabinet and candidate routes remain available', async ({ page }) => {
  const routes = [
    ['/?view=client-orders', '[data-testid="client-orders-screen"]'],
    ['/?view=manager-orders', '[data-testid="manager-orders-screen"]'],
    ['/?view=client-layouts', '[data-testid="layout-browser"]'],
    ['/?view=manager-companies', '[data-testid="manager-clients-screen"]'],
    ['/?view=client-support', '[data-testid="client-support-screen"]'],
    ['/?view=manager-support', '[data-testid="manager-support-screen"]'],
    ['/?view=auth', '[data-testid="auth-candidate"]'],
  ] as const

  for (const [url, selector] of routes) {
    await page.goto(url)
    await expect(page.locator(selector), url).toBeVisible()
    await expect(page.locator('.filter-card'), url).toHaveCount(0)
  }
})

test('direct empty and imported fixtures remain attached to their existing screens', async ({ page }) => {
  await page.goto('/?view=client-orders&fixture=empty')
  await expect(page.getByTestId('client-order-count')).toHaveText('0 из 0')

  await page.goto('/?view=manager-orders&fixture=imported-1c')
  await expect(page.getByRole('button', { name: 'Открыть заказ DEMO-1C-001' })).toContainText('Демо-фикстура, без синхронизации')
})
