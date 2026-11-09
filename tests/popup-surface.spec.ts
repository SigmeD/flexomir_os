import { expect, test, type Locator } from '@playwright/test'

async function signature(surface: Locator) {
  return surface.evaluate(element => {
    const css = getComputedStyle(element)
    return {
      marked: element.hasAttribute('data-fos-popup-surface'),
      radius: css.borderRadius,
      fill: css.backgroundColor,
      blur: css.backdropFilter,
      shadow: css.boxShadow,
      font: css.fontFamily.replace(/\s*,\s*/g, ',').replace(/"/g, ''),
    }
  })
}

async function itemTypography(item: Locator) {
  return item.evaluate(element => {
    const css = getComputedStyle(element)
    return { family: css.fontFamily.replace(/\s*,\s*/g, ',').replace(/"/g, ''), size: css.fontSize, weight: css.fontWeight, lineHeight: css.lineHeight }
  })
}

test('navigation popup opens below and aligned to the hamburger trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=manager-orders')
  const trigger = page.getByTestId('navigation-drawer-trigger')
  const triggerBox = await trigger.boundingBox()
  const headerBox = await page.getByTestId('app-shell-mobile-header').boundingBox()
  await trigger.click()

  const panel = page.getByTestId('navigation-drawer-panel')
  await expect(panel).toBeVisible()
  await page.waitForTimeout(220)
  const panelBox = await panel.boundingBox()
  expect(panelBox?.x).toBeCloseTo(triggerBox?.x ?? -1, 1)
  expect(panelBox?.y).toBeCloseTo((headerBox?.y ?? 0) + (headerBox?.height ?? 0), 1)
})

test('approved Drawer, Account and Select share one Liquid Glass surface; Order More remains excluded', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=manager-orders')
  await page.getByTestId('navigation-drawer-trigger').click()
  const drawerSurface = page.getByTestId('navigation-drawer-panel')
  await expect(drawerSurface).toBeVisible()
  const expected = await signature(drawerSurface)

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/?view=client-orders')
  await page.getByTestId('account-menu-trigger').click()
  const accountSurface = page.getByTestId('account-menu')
  await expect(accountSurface).toBeVisible()
  expect(await signature(accountSurface)).toEqual(expected)
  const menuTypography = { family: expected.font, size: '15px', weight: '500', lineHeight: '20px' }
  expect(await itemTypography(accountSurface.getByRole('menuitem', { name: 'Настройки профиля' }))).toEqual(menuTypography)

  await page.goto('/?view=client-orders&demoTools=1')
  await page.getByRole('button', { name: 'Добавить заказ' }).click()
  await page.getByRole('button', { name: 'Ещё' }).click()
  const moreSurface = page.locator('.fos-overflow')
  await expect(moreSurface).toBeVisible()
  await expect(moreSurface.locator('[data-motion-reference]')).toHaveCount(0)
  await expect(moreSurface).not.toHaveAttribute('data-sidebar-material', 'true')

  await page.goto('/?view=glass-filter-lab')
  await page.getByTestId('filter-control').getByRole('button').click()
  const selectSurface = page.locator('.glass-select-material')
  await expect(selectSurface).toBeVisible()
  expect(await signature(selectSurface)).toEqual(expected)
  expect(await itemTypography(page.getByRole('option', { name: 'Черновики' }))).toEqual(menuTypography)

  const canonicalFont = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--fos-font-family').trim().replace(/\s*,\s*/g, ',').replace(/"/g, ''))
  expect(expected).toEqual({
    marked: true,
    radius: '20px',
    fill: 'rgba(255, 255, 255, 0.72)',
    blur: 'blur(20px)',
    shadow: 'none',
    font: canonicalFont,
  })
})
