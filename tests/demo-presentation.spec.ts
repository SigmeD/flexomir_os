import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { commitItem, fillItem } from './helpers/orders'

test('presentation role switch keeps one workspace and preserves the complete Client→Manager→Client flow', async ({ page }) => {
  await page.goto('/?demoTools=1')
  const workspace = await page.locator('.fos-demo-workspace').elementHandle()
  const client = page.getByRole('button', { name: 'Демо: клиент', exact: true })
  const manager = page.getByRole('button', { name: 'Демо: менеджер', exact: true })
  await expect(client).toHaveAttribute('aria-pressed', 'true')
  await expect(manager).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByTestId('client-orders-screen')).toBeVisible()

  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const orderId = await page.getByTestId('order-composer').getAttribute('data-order-id')
  await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
  await fillItem(page)
  await commitItem(page)
  await page.getByRole('button', { name: 'Передать менеджеру (демо)' }).click()
  await manager.click()

  await expect(page).toHaveURL('/?demoTools=1')
  await expect(manager).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('manager-orders-screen')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Открыть заказ ' + orderId })).toBeVisible()
  await page.getByRole('button', { name: 'Открыть заказ ' + orderId }).click()
  await page.getByRole('button', { name: 'Демо-обработка завершена' }).click()
  await client.click()

  await expect(page).toHaveURL('/?demoTools=1')
  await expect(client).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('client-orders-screen')).toBeVisible()
  await page.getByRole('button', { name: 'Открыть заказ ' + orderId }).click()
  await expect(page.getByTestId('order-detail-status')).toHaveText('Демо-обработка завершена')
  expect(await workspace?.evaluate(element => element.isConnected)).toBe(true)
})

test('role switching and reset stay locked while a Client draft editor is open', async ({ page }) => {
  await page.goto('/?demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()

  await expect(page.getByRole('button', { name: 'Демо: менеджер', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Сбросить демо', exact: true })).toBeDisabled()
  await expect(page.getByText('Сохраните черновик и закройте редактор, чтобы переключить роль или сбросить демо.')).toBeVisible()

  const backToOrders = page.getByRole('button', { name: 'Заказы', exact: true }).first()
  const clientMenuTrigger = page.getByRole('button', { name: 'Открыть меню клиента' })
  if (await clientMenuTrigger.isVisible()) {
    await clientMenuTrigger.click()
    await page.getByRole('button', { name: 'Заказы', exact: true }).last().click()
  } else await backToOrders.click()
  await expect(page.getByRole('button', { name: 'Демо: менеджер', exact: true })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Сбросить демо', exact: true })).toBeEnabled()
  await expect(page.getByRole('button', { name: /Открыть заказ DEMO-NEW-/ })).toHaveCount(1)
})

test('role switching and reset stay locked while a Manager private draft editor is open', async ({ page }) => {
  await page.goto('/?demoTools=1')
  await page.getByRole('button', { name: 'Демо: менеджер', exact: true }).click()
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByLabel('Компания', { exact: true }).selectOption('company-01')

  await expect(page.getByRole('button', { name: 'Демо: клиент', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Сбросить демо', exact: true })).toBeDisabled()
  const managerMenuTrigger = page.getByRole('button', { name: 'Открыть меню менеджера' })
  if (await managerMenuTrigger.isVisible()) {
    await managerMenuTrigger.click()
    await page.getByRole('button', { name: 'Заказы', exact: true }).last().click()
  } else await page.getByRole('button', { name: 'Заказы', exact: true }).first().click()
  await expect(page.getByTestId('order-composer')).toBeVisible()

  await page.getByRole('button', { name: 'Сохранить черновик менеджера' }).click()
  await expect(page.getByRole('button', { name: 'Демо: клиент', exact: true })).toBeEnabled()
  if (await managerMenuTrigger.isVisible()) {
    await managerMenuTrigger.click()
    await page.getByRole('button', { name: 'Заказы', exact: true }).last().click()
  } else await page.getByRole('button', { name: 'Заказы', exact: true }).last().click()
  await expect(page.getByRole('button', { name: 'Демо: клиент', exact: true })).toBeEnabled()
  await expect(page.getByRole('button', { name: /Открыть заказ DEMO-NEW-/ })).toContainText('Компания 01')
  await page.getByRole('button', { name: 'Демо: клиент', exact: true }).click()
  await page.getByRole('button', { name: 'Демо: менеджер', exact: true }).click()
  await expect(page.getByRole('button', { name: /Открыть заказ DEMO-NEW-/ })).toContainText('Компания 01')
})

test('demoTools keeps QA reset separate from the presentation role selector', async ({ page }) => {
  await page.goto('/?view=client-orders&demoTools=1')
  const presentation = page.getByTestId('demo-presentation-controls')
  const technical = page.getByTestId('demo-technical-controls')
  await expect(presentation).toBeVisible()
  await expect(technical).toBeVisible()
  await expect(presentation.getByRole('button', { name: 'Демо: клиент', exact: true })).toBeVisible()
  await expect(presentation.getByRole('button', { name: 'Сбросить демо', exact: true })).toHaveCount(0)
  await expect(technical.getByRole('button', { name: 'Сбросить демо', exact: true })).toBeVisible()
})

test('presentation strip is keyboard accessible and fits all five review widths', async ({ page }, testInfo) => {
  await page.goto('/')
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 })
    await page.screenshot({ path: testInfo.outputPath('fe-debug-stand-client-' + width + '.png'), fullPage: true, animations: 'disabled' })
  }
  await page.setViewportSize({ width: 1440, height: 960 })
  const client = page.getByRole('button', { name: 'Демо: клиент', exact: true })
  const manager = page.getByRole('button', { name: 'Демо: менеджер', exact: true })

  await manager.focus()
  await page.keyboard.press('Enter')
  await expect(manager).toHaveAttribute('aria-pressed', 'true')
  await expect(manager).toBeFocused()

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 960 })
    await expect(page.getByTestId('demo-presentation-controls')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width}px`).toBe(true)
    const panel = await page.getByTestId('demo-presentation-controls').boundingBox()
    const shell = await page.locator('.fos-app-shell').boundingBox()
    expect(panel?.x).toBeGreaterThanOrEqual(0)
    expect((panel?.x ?? 0) + (panel?.width ?? width)).toBeLessThanOrEqual(width + 1)
    expect((panel?.y ?? 0) + (panel?.height ?? 0)).toBeLessThanOrEqual(shell?.y ?? 0)
  }

  await client.click()
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
})
