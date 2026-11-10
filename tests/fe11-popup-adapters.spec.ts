import { expect, test } from '@playwright/test'

test('Account rapid Escape and reopening never lets an exiting layer dismiss its trigger', async ({ page }) => {
  await page.goto('/?demoTools=1')
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    const trigger = page.locator('[data-testid="account-menu-trigger"]:visible')
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  }
})

test('Account adapter preserves role, identity, disabled actions, anchor and focus at five widths', async ({ page }, info) => {
  test.setTimeout(60000) // ten independent route/viewport flows, including Firefox
  for (const role of ['client', 'manager']) for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 600 })
    await page.goto('/?view=' + role + '-orders')
    const trigger = page.getByTestId('account-menu-trigger')
    await trigger.click()
    const menu = page.getByTestId('account-menu')
    await expect(menu).toHaveAttribute('role', 'menu')
    await expect(menu.locator('[data-motion-reference="FE11-v0.2"]')).toHaveCount(1)
    await expect(menu.locator('[data-motion="travel"]')).toHaveCount(1)
    await expect(menu.getByRole('menuitem', { name: 'Настройки компании' })).toHaveAttribute('aria-disabled', 'true')
    await menu.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)))
    const box = (await menu.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(15)
    expect(box.x + box.width).toBeLessThanOrEqual(width - 15)
    expect(box.y).toBeGreaterThanOrEqual(15)
    expect(box.y + box.height).toBeLessThanOrEqual(585)
    if (info.project.use.hasTouch !== true) {
      await menu.getByRole('menuitem', { name: 'Настройки компании' }).hover()
      await expect(menu.locator('[data-motion="travel"]')).toHaveAttribute('data-travel-target', '0')
    }
    if (width === 390) await page.screenshot({ path: `output/playwright/fe11-rollout/${info.project.name}-${role}-account.png` })
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await trigger.click()
    await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
    await expect(page.getByRole('heading', { name: 'Настройки профиля', level: 1 })).toBeVisible()
  }
})

test('Select adapter separates focus/hover from value and flips above a low anchor', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto('/?view=glass-filter-lab')
  const trigger = page.getByTestId('filter-control').getByRole('button')
  await trigger.click()
  const popup = page.getByRole('listbox')
  const lens = popup.locator('[data-motion="travel"]')
  await expect(popup.locator('[data-motion-reference="FE11-v0.2"]')).toHaveCount(1)
  const selected = await popup.getByRole('option', { selected: true }).textContent()
  const target = await lens.getAttribute('data-travel-target')
  if (info.project.use.hasTouch !== true) await page.getByRole('option', { name: 'Черновики' }).hover()
  await page.keyboard.press('ArrowDown')
  await expect(popup.getByRole('option', { selected: true })).toHaveText(selected!)
  await expect(lens).toHaveAttribute('data-travel-target', target!)
  await page.getByRole('option', { name: 'Черновики' }).focus()
  await page.keyboard.press('Enter')
  await expect(popup).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(trigger).toContainText('Черновики')
  await trigger.evaluate(el => Object.assign(el.style, { position: 'fixed', top: '540px', left: '200px', width: '180px' }))
  await trigger.click()
  await expect(popup).toBeVisible()
  await popup.evaluate(el => Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished)))
  const box = (await popup.boundingBox())!
  expect(box.y).toBeLessThan(540)
  expect(box.x + box.width).toBeLessThanOrEqual(375)
  await page.screenshot({ path: `output/playwright/fe11-rollout/${info.project.name}-select.png` })
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})
