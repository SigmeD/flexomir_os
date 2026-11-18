import { expect, test, type Locator } from '@playwright/test'

async function color(row: Locator) {
  return row.evaluate(element => getComputedStyle(element).color)
}

for (const role of ['client', 'manager'] as const) {
  test(`${role} Account, More and form options use the selected Sidebar text color`, async ({ page }) => {
    await page.goto(`/?view=${role}-orders`)
    const selected = page.locator('.fos-sidebar-nav--persistent .fos-sidebar-nav__item[aria-current="page"]')
    const brand = await color(selected)
    expect(brand).toBe('rgb(31, 56, 97)')

    await page.getByTestId('account-menu-trigger').click()
    const account = page.getByTestId('account-menu')
    const profile = account.getByRole('menuitem', { name: 'Настройки профиля' })
    expect(await color(profile)).toBe(brand)
    await profile.hover()
    expect(await color(profile)).toBe(brand)
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
    await page.getByRole('button', { name: 'Ещё', exact: true }).click()
    const more = page.getByRole('menu', { name: 'Ещё' }).getByRole('menuitem').first()
    expect(await color(more)).toBe(brand)
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: 'Добавить позицию', exact: true }).click()
    await page.getByRole('combobox', { name: 'Форма', exact: true }).click()
    expect(await color(page.getByRole('listbox').getByRole('option').first())).toBe(brand)
  })

  test(`${role} mobile Drawer keeps the Sidebar selected and secondary colors`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/?view=${role}-orders`)
    await page.getByTestId('navigation-drawer-trigger').click()
    const drawer = page.getByTestId('navigation-drawer-panel')
    await expect(drawer.locator('[data-popup-item][aria-current="page"]')).toHaveCSS('color', 'rgb(31, 56, 97)')
    await expect(drawer.locator('[data-popup-item]:not([aria-current])').first()).toHaveCSS('color', 'rgb(115, 119, 129)')
  })
}

test('GlassSelect light options use Sidebar color while dark options keep light contrast', async ({ page }) => {
  await page.goto('/?view=glass-filter-lab')
  const trigger = page.getByTestId('filter-control').locator('button')
  await trigger.click()
  const option = page.getByRole('option', { name: 'Черновики', exact: true })
  expect(await color(option)).toBe('rgb(31, 56, 97)')
  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    document.documentElement.className = ''
    document.documentElement.dataset.theme = 'dark'
  })
  await trigger.click()
  await expect(option).toHaveCSS('color', 'rgb(238, 246, 250)')
})
