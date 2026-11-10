import { expect, test } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

test('accepted Account and More are enabled on ordinary routes without a pilot flag', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByTestId('account-menu-trigger').click()
  const account = page.getByTestId('account-menu')
  await expect(account).toHaveAttribute('data-fos-popup', 'actions')
  await expect(account.getByRole('separator')).toHaveCount(0)
  await expect(account.locator('[data-motion="travel"]')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  await page.getByRole('button', { name: 'Ещё', exact: true }).click()
  await expect(page.getByRole('menu', { name: 'Ещё' })).toHaveAttribute('data-fos-popup', 'actions')
})

test('Drawer and existing GlassSelect use the same public composition and preserve real selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=client-orders')
  await page.getByTestId('navigation-drawer-trigger').click()
  await expect(page.getByTestId('navigation-drawer-panel')).toHaveAttribute('data-fos-popup', 'navigation')
  await expect(page.getByTestId('navigation-drawer-panel').getByTestId('sidebar-selected-lens')).toHaveCount(1)
  await page.goto('/?view=glass-filter-lab')
  await page.locator('[data-glass-select-trigger]').click()
  const list = page.getByRole('listbox')
  await expect(list.locator('[data-fos-popup="listbox"]')).toHaveCount(1)
  await expect(page.getByRole('option', { name: 'Все заказы', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(list.locator('[data-motion="travel"]')).toHaveCount(1)
})

test('Manager company select uses the accepted form adapter and updates the real draft value', async ({ page }) => {
  await page.goto('/?view=manager-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const company = page.getByRole('combobox', { name: 'Компания', exact: true })
  await expect(company).toHaveJSProperty('tagName', 'BUTTON')
  await company.click()
  await page.getByRole('option', { name: 'Компания 01', exact: true }).click()
  await expect(company).toContainText('Компания 01')
  await expect(page.locator('.fos-order-composer__company select')).toHaveValue('company-01')
})

test('only FosPopup composes popup Surface and Rows; no legacy hover driver remains', () => {
  const files = readdirSync('src/components', { recursive: true }).filter(file => typeof file === 'string' && file.endsWith('.tsx')) as string[]
  const offenders = files.filter(file => !['ui/fos-popup.tsx', 'ui/fos-popup-surface.tsx', 'ui/fos-popup-rows.tsx'].includes(file.replaceAll('\\', '/')))
    .filter(file => /import[^\n]+(?:FosPopupSurface|FosPopupRows)/.test(readFileSync(join('src/components', file), 'utf8')))
  expect(offenders).toEqual([])
  expect(readFileSync('src/components/ui/fos-popup-surface.tsx', 'utf8')).not.toMatch(/\b(?:Track|spring|hoverLens)\b/)
})

test('company filters retain All-status semantics and disabled sorting with an explanatory title', async ({ page }) => {
  await page.goto('/?view=manager-companies')
  await page.getByTestId('company-row-company-01').click()
  const status = page.getByRole('combobox', { name: 'Статус', exact: true })
  await expect(status).toHaveJSProperty('tagName', 'BUTTON')
  await expect(status).toHaveText('Все статусы')
  await expect(status).not.toHaveAttribute('data-empty')
  const sorting = page.getByRole('combobox', { name: 'Сортировка', exact: true })
  await expect(sorting).toBeDisabled()
  await expect(sorting).toHaveAttribute('title', 'Порядок задаётся демонстрационными данными')
  await status.click()
  await page.getByRole('option', { name: 'В работе', exact: true }).click()
  await expect(page.getByTestId('company-order-DEMO-003')).toBeVisible()
  await expect(page.getByTestId('company-order-DEMO-001')).toHaveCount(0)
  await expect(status).toHaveAttribute('aria-expanded', 'false')
  await status.click()
  await page.getByRole('option', { name: 'Все статусы', exact: true }).click()
  await expect(status).toHaveText('Все статусы')
})
