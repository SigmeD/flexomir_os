import { expect, test } from '@playwright/test'

const choices = [
  { label: 'Все заказы', ids: ['DEMO-001', 'DEMO-002', 'DEMO-003', 'DEMO-004', 'DEMO-005'] },
  { label: 'Черновики', ids: ['DEMO-001', 'DEMO-004'] },
  { label: 'На рассмотрении', ids: ['DEMO-002', 'DEMO-005'] },
  { label: 'На производстве', ids: ['DEMO-003'] },
  { label: 'Завершённые', ids: [] },
]

test('each Glass Select option filters the original orders and closes the list', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/?view=glass-filter-lab')
  const trigger = page.getByTestId('filter-control').locator('button')
  for (const choice of choices) {
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('listbox')).toBeVisible()
    await expect(page.getByRole('listbox')).toHaveCSS('opacity', '1')
    await expect(page.getByRole('option')).toHaveCount(5)
    await page.getByRole('option', { name: choice.label, exact: true }).click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('[role="listbox"]')).toHaveCSS('opacity', '0')
    await expect(page.locator('[role="listbox"]')).toHaveCSS('pointer-events', 'none')
    await expect(trigger).toContainText(choice.label)
    await expect(page.getByTestId('orders-list').locator('.order-row b')).toHaveText(choice.ids)
    await expect(page.locator('.orders-head small')).toContainText(`${choice.ids.length} из 5`)
  }
  await expect(page.locator('.no-orders')).toHaveText('По выбранному статусу заказов нет.')
  expect(errors).toEqual([])
})

test('Escape and outside click dismiss without changing the selection', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  const trigger = page.getByTestId('filter-control').locator('button')
  await trigger.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[role="listbox"]')).toHaveCSS('opacity', '0')
  await expect(trigger).toBeFocused()
  await trigger.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.getByRole('heading', { name: 'Мои заказы' }).click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[role="listbox"]')).toHaveCSS('opacity', '0')
  await expect(trigger).toContainText('Все заказы')
  await expect(page.locator('.order-row')).toHaveCount(5)
})

test('keyboard can open, navigate and select a status', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  const trigger = page.getByTestId('filter-control').locator('button')
  await expect(trigger).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[role="listbox"]')).toHaveCSS('opacity', '0')
  await expect(trigger).toContainText('Черновики')
  await expect(page.locator('.order-row')).toHaveCount(2)
})

test('open list overlays real order DOM without the experimental glass layers', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  await page.getByTestId('filter-control').locator('button').click()
  const list = page.getByRole('listbox')
  await expect(list).toBeVisible()
  await expect(list).toHaveCSS('opacity', '1')
  await expect(page.locator('.order-row')).toHaveCount(5)
  await expect(page.locator('.matte-reading-core, .moving-selection, .website-glass-shell, .synthetic-scene, .test-grid, .canvas-scene, canvas')).toHaveCount(0)
  const box = await list.boundingBox()
  const viewport = page.viewportSize()!
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width)
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height)
  await page.screenshot({ path: `output/playwright/glass-select/open-${test.info().project.name}.png`, fullPage: true })
})
