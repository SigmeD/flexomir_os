import { expect, test } from '@playwright/test'

test('Profile action keeps focus through popup exit and responds to Space', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto('/?demoTools=1')
  await page.getByTestId('account-menu-trigger').click()
  await page.getByRole('menuitem', { name: 'Настройки профиля' }).click()
  const upload = page.locator('button.fos-action').filter({ hasText: 'Загрузить фото' })
  await upload.focus()
  await upload.hover()
  await page.keyboard.down('Space')
  await expect(upload).toHaveAttribute('data-pressed', 'true')
  await expect(upload).toBeFocused()
  // Keep this focus/press regression independent of the OS file chooser.
  // Moving to another form field cancels the held button; photo selection has
  // its own existing integration tests.
  const name = page.getByLabel('Имя пользователя')
  await name.focus()
  await page.keyboard.up('Space')
  await expect(upload).toHaveAttribute('data-pressed', 'false')
  await expect(page.locator('.fos-account-menu')).toHaveCount(0)
  await expect(name).toBeFocused()
})

test('closed menu exits inert, reopens immediately and respects outside-field focus', async ({ page }) => {
  await page.goto('/?view=client-orders')
  await page.getByRole('button', { name: 'Добавить заказ', exact: true }).click()
  const trigger = page.getByRole('button', { name: 'Ещё', exact: true })
  for (let attempt = 0; attempt < 3; attempt++) {
    await trigger.click()
    await expect(page.getByRole('menuitem', { name: 'Добавить позицию' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    const closed = page.locator('.fos-overflow[data-state="closed"]')
    expect(await closed.evaluateAll(elements => elements.every(el => (el as HTMLElement).inert && getComputedStyle(el).pointerEvents === 'none'))).toBe(true)
  }
  await expect(page.locator('.fos-overflow')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.click()
  const comment = page.getByLabel('Комментарии', { exact: true })
  await comment.click()
  await expect(page.locator('.fos-overflow')).toHaveCount(0)
  await expect(comment).toBeFocused()
})
